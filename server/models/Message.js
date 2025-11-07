export class Message {
  constructor(id, content, username, room, type = 'text') {
    this.id = id;
    this.content = content;
    this.username = username;
    this.room = room;
    this.type = type;
    this.timestamp = new Date().toISOString();
    this.reactions = new Map();
    this.readBy = new Set();
  }

  addReaction(username, reaction) {
    this.reactions.set(username, reaction);
  }

  markAsRead(username) {
    this.readBy.add(username);
  }
}