import React from 'react';
import { SocketProvider, useSocket } from './context/SocketContext';
import Login from './components/Login';
import ChatPage from './pages/ChatPage';
import './App.css';

const AppContent = () => {
  const { user } = useSocket();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <ChatPage />
      )}
    </div>
  );
};

const App = () => {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
};

export default App;