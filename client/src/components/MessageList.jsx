import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, typingUsers, currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.username === currentUser ? 'own-message' : ''}`}
        >
          <div className="message-header">
            <span className="username">{message.username}</span>
            <span className="timestamp">{formatTime(message.timestamp)}</span>
          </div>
          <div className="message-content">{message.content}</div>
        </div>
      ))}
      
      {typingUsers.map((user) => (
        <div key={user.username} className="typing-indicator">
          <span>{user.username} is typing...</span>
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;