import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { logError } from '../utils/errorLogger';

let messaging;

// Initialize Firebase Cloud Messaging
try {
  messaging = getMessaging();
} catch (error) {
  console.error('Firebase messaging is not supported in this environment');
}

/**
 * Request permission for notifications and get FCM token
 * @returns {Promise<string|null>} FCM token or null if not supported/allowed
 */
export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      return token;
    }
    
    return null;
  } catch (error) {
    logError('Failed to get notification permission', { error });
    return null;
  }
};

/**
 * Set up a listener for foreground messages
 * @param {Function} callback - Function to call when message is received
 * @returns {Function|null} Unsubscribe function or null if not supported
 */
export const setupMessageListener = (callback) => {
  if (!messaging) return null;
  
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

/**
 * Subscribe user to a topic (For admin use only)
 * @param {string} token - FCM token
 * @param {string} topic - Topic to subscribe to
 * @returns {Promise<void>}
 */
export const subscribeToTopic = async (token, topic) => {
  if (!token || !topic) return;
  
  try {
    // This would typically be done through a server function
    // We need a server to handle this (Firebase Cloud Function)
    const response = await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${import.meta.env.VITE_FIREBASE_SERVER_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to subscribe to topic');
    }
  } catch (error) {
    logError('Failed to subscribe to topic', { error, token, topic });
  }
}; 