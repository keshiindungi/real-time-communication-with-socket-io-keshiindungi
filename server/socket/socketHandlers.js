import { Message } from '../models/Message.js';
import { UserManager } from '../models/UserManager.js';

const userManager = new UserManager();
const messages = new Map(); // room -> messages

export const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User authentication
    socket.on('authenticate', async (data, callback) => {
      try {
        const { username, token } = data;
        
        if (!username) {
          throw new Error('Username is required');
        }

        const user = userManager.addUser(socket.id, username);
        socket.userId = user.id;
        socket.username = username;

        // Join general room by default
        socket.join('general');

        // Send current users and messages
        callback({
          success: true,
          user: { id: user.id, username },
          onlineUsers: userManager.getOnlineUsers(),
          rooms: ['general'],
          recentMessages: messages.get('general')?.slice(-50) || []
        });

        // Notify others about new user
        socket.broadcast.emit('userConnected', {
          userId: user.id,
          username,
          onlineUsers: userManager.getOnlineUsers()
        });

      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Handle joining rooms
    socket.on('joinRoom', (room) => {
      socket.join(room);
      userManager.getUser(socket.userId)?.joinRoom(room);
      
      // Send room messages
      const roomMessages = messages.get(room) || [];
      socket.emit('roomMessages', {
        room,
        messages: roomMessages.slice(-50)
      });

      socket.to(room).emit('userJoinedRoom', {
        username: socket.username,
        room
      });
    });

    // Handle sending messages
    socket.on('sendMessage', (data) => {
      const { content, room, type = 'text' } = data;
      
      const message = new Message(
        Date.now().toString(),
        content,
        socket.username,
        room,
        type
      );

      // Store message
      if (!messages.has(room)) {
        messages.set(room, []);
      }
      messages.get(room).push(message);

      // Broadcast to room
      io.to(room).emit('newMessage', message);

      // Send delivery receipt
      socket.emit('messageDelivered', { messageId: message.id });
    });

    // Handle typing indicators
    socket.on('typingStart', (room) => {
      socket.to(room).emit('userTyping', {
        username: socket.username,
        room,
        isTyping: true
      });
    });

    socket.on('typingStop', (room) => {
      socket.to(room).emit('userTyping', {
        username: socket.username,
        room,
        isTyping: false
      });
    });

    // Handle private messages
    socket.on('sendPrivateMessage', (data) => {
      const { toUserId, content } = data;
      const targetUser = userManager.getUser(toUserId);
      
      if (targetUser && targetUser.connected) {
        const message = new Message(
          Date.now().toString(),
          content,
          socket.username,
          `private_${socket.userId}_${toUserId}`,
          'private'
        );

        io.to(targetUser.socketId).emit('privateMessage', message);
        socket.emit('privateMessage', message);
      }
    });

    // Handle message reactions
    socket.on('addReaction', (data) => {
      const { messageId, room, reaction } = data;
      const roomMessages = messages.get(room);
      
      if (roomMessages) {
        const message = roomMessages.find(msg => msg.id === messageId);
        if (message) {
          message.addReaction(socket.username, reaction);
          io.to(room).emit('messageReaction', {
            messageId,
            reaction,
            username: socket.username
          });
        }
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const user = userManager.getUser(socket.userId);
      if (user) {
        user.disconnect();
        
        // Remove user after delay
        setTimeout(() => {
          if (!user.connected) {
            userManager.removeUser(user.id);
            io.emit('userDisconnected', {
              userId: user.id,
              onlineUsers: userManager.getOnlineUsers()
            });
          }
        }, 5000); // 5 second delay
      }
      
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};