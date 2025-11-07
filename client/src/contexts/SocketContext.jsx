import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketClient } from '../socket/socketClient';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');

  useEffect(() => {
    socketClient.connect();

    // Setup event listeners
    socketClient.on('connect', () => setIsConnected(true));
    socketClient.on('disconnect', () => setIsConnected(false));
    
    socketClient.on('user_list', (users) => setOnlineUsers(users));
    socketClient.on('typing_users', (users) => setTypingUsers(users));
    
    socketClient.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketClient.on('room_messages', (roomMessages) => {
      setMessages(roomMessages);
    });

    socketClient.on('user_joined', (data) => {
      console.log(`${data.username} joined the chat`);
    });

    socketClient.on('user_left', (data) => {
      console.log(`${data.username} left the chat`);
    });

    return () => {
      socketClient.disconnect();
    };
  }, []);

  const login = async (username, password) => {
    try {
      const response = await socketClient.login(username, password);
      setUser(response.user);
      setOnlineUsers(response.onlineUsers);
      setMessages(response.messages);
      setCurrentRoom('general');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await socketClient.register(username, password);
      setUser(response.user);
      setOnlineUsers(response.onlineUsers);
      setMessages(response.messages);
      setCurrentRoom('general');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendMessage = (content) => {
    socketClient.sendMessage(content, currentRoom);
  };

  const changeRoom = (newRoom) => {
    socketClient.changeRoom(newRoom);
    setCurrentRoom(newRoom);
    setMessages([]);
  };

  const setTyping = (isTyping) => {
    socketClient.setTyping(isTyping);
  };

  const value = {
    isConnected,
    user,
    onlineUsers,
    messages,
    typingUsers,
    currentRoom,
    login,
    register,
    sendMessage,
    changeRoom,
    setTyping,
    addReaction: socketClient.addReaction.bind(socketClient),
    markMessageRead: socketClient.markMessageRead.bind(socketClient)
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};