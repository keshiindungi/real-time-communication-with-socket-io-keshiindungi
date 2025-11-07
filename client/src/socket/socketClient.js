import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    this.socket = io('http://localhost:5000', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to server:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('Disconnected from server:', reason);
    });
  }

  // Authentication methods
  async register(username, password) {
    return new Promise((resolve, reject) => {
      this.socket.emit('authenticate', { 
        username, 
        password, 
        action: 'register' 
      }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async login(username, password) {
    return new Promise((resolve, reject) => {
      this.socket.emit('authenticate', { 
        username, 
        password, 
        action: 'login' 
      }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // User management
  changeRoom(room) {
    this.socket.emit('change_room', room);
  }

  // Message handling with status
  sendMessage(content, room = 'general') {
    this.socket.emit('send_message', { content, room });
  }

  markMessageDelivered(messageId) {
    this.socket.emit('message_delivered', messageId);
  }

  markMessageRead(messageId) {
    this.socket.emit('message_read', messageId);
  }

  // Typing indicators
  setTyping(isTyping) {
    this.socket.emit('typing', isTyping);
  }

  // Reactions
  addReaction(messageId, reaction) {
    this.socket.emit('message_reaction', { messageId, reaction });
  }

  // Event listeners
  on(event, callback) {
    this.socket?.on(event, callback);
    this.listeners.set(event, callback);
  }

  off(event) {
    this.socket?.off(event);
    this.listeners.delete(event);
  }

  disconnect() {
    this.listeners.forEach((callback, event) => {
      this.socket?.off(event, callback);
    });
    this.listeners.clear();
    this.socket?.disconnect();
  }
}

export const socketClient = new SocketClient();