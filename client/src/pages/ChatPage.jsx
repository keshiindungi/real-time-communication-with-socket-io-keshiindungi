import React from 'react';
import { useSocket } from '../context/SocketContext';

const ChatPage = () => {
  const { user, onlineUsers, sendMessage, currentRoom, changeRoom } = useSocket();

  const rooms = ['general', 'random', 'help', 'tech-support'];

  const handleSendMessage = () => {
    const input = document.getElementById('messageInput');
    if (input.value.trim()) {
      sendMessage(input.value.trim());
      input.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>💬 SocketChat</h2>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
          </div>
        </div>

        <div className="rooms-section">
          <h3>Rooms</h3>
          {rooms.map(room => (
            <button
              key={room}
              className={`room-button ${currentRoom === room ? 'active' : ''}`}
              onClick={() => changeRoom(room)}
            >
              # {room}
            </button>
          ))}
        </div>

        <div className="online-users">
          <div className="online-users-header">
            <h3>Online Users</h3>
            <span className="online-count">{onlineUsers.length}</span>
          </div>
          
          <div className="users-list">
            {onlineUsers.map((user) => (
              <div key={user.id} className="user-item">
                <span className="status-indicator"></span>
                <span className="username">{user.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h1># {currentRoom}</h1>
          <div className="room-info">
            {onlineUsers.length} users online
          </div>
        </div>

        <div className="messages-container">
          <div className="welcome-message">
            <h3>Welcome to #{currentRoom}!</h3>
            <p>Start chatting with other users in real-time.</p>
            <p>Features include: typing indicators, multiple rooms, and persistent messages.</p>
          </div>
        </div>

        <div className="message-input-container">
          <input
            id="messageInput"
            type="text"
            placeholder={`Message #${currentRoom}`}
            onKeyPress={handleKeyPress}
            className="message-input"
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;