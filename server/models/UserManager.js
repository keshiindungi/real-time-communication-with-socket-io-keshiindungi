import { User } from './User.js';

export class UserManager {
  constructor() {
    this.users = new Map();
  }

  addUser(socketId, username) {
    const userId = this.generateUserId();
    const user = new User(userId, username, socketId);
    this.users.set(userId, user);
    return user;
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  getUserBySocketId(socketId) {
    return Array.from(this.users.values()).find(user => user.socketId === socketId);
  }

  removeUser(userId) {
    this.users.delete(userId);
  }

  getOnlineUsers() {
    return Array.from(this.users.values())
      .filter(user => user.connected)
      .map(user => ({
        id: user.id,
        username: user.username,
        lastSeen: user.lastSeen
      }));
  }

  generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}