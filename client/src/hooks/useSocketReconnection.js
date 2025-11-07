import { useEffect, useState } from 'react';

export const useSocketReconnection = (socket) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setReconnectAttempts(0);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onReconnectAttempt = (attempt) => {
      setReconnectAttempts(attempt);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('reconnect_attempt', onReconnectAttempt);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('reconnect_attempt', onReconnectAttempt);
    };
  }, [socket]);

  return { isConnected, reconnectAttempts };
};