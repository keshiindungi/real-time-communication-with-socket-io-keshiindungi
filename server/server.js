const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Simple storage
let users = [];
let messages = [];
let privateMessages = [];

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User registration
    socket.on('user-registered', (userData) => {
        const user = {
            id: socket.id,
            username: userData.username,
            email: userData.email
        };
        
        // Remove if user already exists
        users = users.filter(u => u.id !== socket.id);
        users.push(user);
        
        console.log('User registered:', userData.username);
        
        // Send success with user list
        socket.emit('login-success', {
            user: user,
            onlineUsers: users.filter(u => u.id !== socket.id)
        });
        
        // Tell everyone about new user
        socket.broadcast.emit('user-joined', {
            username: userData.username,
            onlineUsers: users
        });
    });

    // Send public message - SIMPLE VERSION
    socket.on('send-group-message', (data) => {
        const user = users.find(u => u.id === socket.id);
        if (!user) return;

        const message = {
            id: Date.now().toString(),
            user: user.username,
            userId: socket.id,
            text: data.text,
            time: new Date().toLocaleTimeString(),
            type: 'public'
        };

        messages.push(message);
        
        // Send to EVERYONE
        io.emit('new-message', message);
        
        console.log('Public message sent:', user.username, ':', data.text);
    });

    // Send private message - SIMPLE VERSION
    socket.on('send-private-message', (data) => {
        const fromUser = users.find(u => u.id === socket.id);
        const toUser = users.find(u => u.id === data.toUserId);
        
        if (!fromUser || !toUser) return;

        const message = {
            id: Date.now().toString(),
            fromUserId: socket.id,
            fromUsername: fromUser.username,
            toUserId: data.toUserId,
            toUsername: toUser.username,
            text: data.text,
            time: new Date().toLocaleTimeString(),
            type: 'private'
        };

        privateMessages.push(message);
        
        // Send to both users
        socket.emit('new-private-message', message);
        socket.to(data.toUserId).emit('new-private-message', message);
        
        console.log('Private message:', fromUser.username, '->', toUser.username, ':', data.text);
    });

    // Get user's private messages
    socket.on('get-private-conversation', (data) => {
        const conversation = privateMessages.filter(msg => 
            (msg.fromUserId === socket.id && msg.toUserId === data.otherUserId) ||
            (msg.fromUserId === data.otherUserId && msg.toUserId === socket.id)
        );
        socket.emit('private-conversation-loaded', {
            conversation: conversation,
            otherUserId: data.otherUserId
        });
    });

    socket.on('disconnect', () => {
        const user = users.find(u => u.id === socket.id);
        if (user) {
            users = users.filter(u => u.id !== socket.id);
            console.log('User disconnected:', user.username);
            
            // Notify others
            socket.broadcast.emit('user-left', {
                username: user.username,
                onlineUsers: users
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});