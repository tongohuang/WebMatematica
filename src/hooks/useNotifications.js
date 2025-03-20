import { useState, useEffect } from 'react';
import { requestNotificationPermission, setupMessageListener } from '../services/messaging';
import { logError } from '../utils/errorLogger';

/**
 * Hook for handling Firebase Cloud Messaging notifications
 * @param {Object} options - Options
 * @param {boolean} options.autoRequestPermission - Whether to request permission automatically
 * @param {Function} options.onMessageReceived - Callback for when a message is received
 * @returns {Object} - Notification state and functions
 */
export default function useNotifications({ 
  autoRequestPermission = false,
  onMessageReceived = () => {}
} = {}) {
  const [permission, setPermission] = useState('default');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Request permission on mount if autoRequestPermission is true
  useEffect(() => {
    if (autoRequestPermission) {
      requestPermission();
    }
    
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, [autoRequestPermission]);

  // Set up message listener
  useEffect(() => {
    const unsubscribe = setupMessageListener((message) => {
      console.log('Foreground message received:', message);
      onMessageReceived(message);
    });
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [onMessageReceived]);

  // Function to request notification permission
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      setError('This browser does not support notifications');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const fcmToken = await requestNotificationPermission();
      
      if (fcmToken) {
        setToken(fcmToken);
        setPermission('granted');
      } else {
        setPermission(Notification.permission);
      }
    } catch (err) {
      logError('Failed to request notification permission', { error: err });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    permission,
    token,
    loading,
    error,
    requestPermission,
    isSupported: 'Notification' in window
  };
} 