import React from 'react';

const OnlineUsers = ({ onlineUsers }) => {
  return (
    <div className="online-users">
      <h3>Online Users ({onlineUsers.length})</h3>
      <div className="users-list">
        {onlineUsers.map((userId) => (
          <div key={userId} className="online-user">
            <span className="status-dot">🟢</span>
            User {userId}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsers;