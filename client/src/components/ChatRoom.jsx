import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';

const ChatRoom = ({ user }) => {
  const { socket, isConnected, onlineUsers } = useSocket();
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    // Load previous messages
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    // Socket event listeners
    socket.on('newMessage', (message) => {
      setMessages(prev => {
        const newMessages = [...prev, message];
        localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        return newMessages;
      });
    });

    socket.on('userTyping', (data) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(u => u.username !== data.username);
        if (data.isTyping) {
          return [...filtered, data];
        }
        return filtered;
      });
    });

    return () => {
      socket.off('newMessage');
      socket.off('userTyping');
    };
  }, [socket]);

  const sendMessage = (content) => {
    const message = {
      id: Date.now().toString(),
      content,
      username: user.username,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    socket.emit('sendMessage', message);
  };

  const handleTyping = (isTyping) => {
    socket.emit('typing', {
      username: user.username,
      isTyping
    });
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>Global Chat</h2>
        <div className="connection-status">
          {isConnected ? '🟢 Online' : '🔴 Offline'}
        </div>
      </div>
      
      <div className="chat-container">
        <div className="messages-section">
          <MessageList 
            messages={messages} 
            typingUsers={typingUsers}
            currentUser={user.username}
          />
          <MessageInput 
            onSendMessage={sendMessage}
            onTyping={handleTyping}
          />
        </div>
        
        <OnlineUsers onlineUsers={onlineUsers} />
      </div>
    </div>
  );
};

export default ChatRoom;