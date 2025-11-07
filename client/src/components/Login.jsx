import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💬 Socket.io Chat</h1>
        <p>{isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              minLength={3}
              maxLength={20}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              minLength={6}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading || !username.trim() || !password.trim()}
            className="login-button"
          >
            {isLoading ? (
              <span className="loading">⏳ Processing...</span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={switchMode}
              className="switch-button"
              disabled={isLoading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="login-features">
          <div className="feature">
            <span>🔐</span>
            <span>Secure authentication</span>
          </div>
          <div className="feature">
            <span>💾</span>
            <span>Persistent messages</span>
          </div>
          <div className="feature">
            <span>⚡</span>
            <span>Real-time chat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;