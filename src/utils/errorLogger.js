import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Logs an error to Firestore and optionally to the console
 * @param {string} message - Error message
 * @param {Object} errorData - Additional error data
 * @param {boolean} consoleLog - Whether to log to console
 * @returns {Promise<void>}
 */
export const logError = async (message, errorData = {}, consoleLog = true) => {
  try {
    // Create error object with timestamp
    const errorObject = {
      message,
      timestamp: serverTimestamp(),
      date: new Date().toISOString(),
      ...errorData,
    };
    
    // Log to Firestore
    await addDoc(collection(db, 'errors'), errorObject);
    
    // Optionally log to console
    if (consoleLog) {
      console.error('Error logged:', message, errorData);
    }
  } catch (err) {
    // If error logging fails, at least log to console
    console.error('Failed to log error:', err);
    console.error('Original error:', message, errorData);
  }
};

/**
 * Captures unhandled errors and logs them
 */
export const setupErrorCapture = () => {
  window.addEventListener('error', (event) => {
    logError(event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      type: 'unhandled'
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    logError(
      event.reason?.message || 'Unhandled Promise Rejection',
      {
        stack: event.reason?.stack,
        type: 'unhandledrejection'
      }
    );
  });
};

/**
 * Create a higher-order component for error boundaries
 * @param {Object} additionalContext - Additional context to log with errors
 * @returns {Function} - Error handler function
 */
export const createErrorHandler = (additionalContext = {}) => {
  return (error, errorInfo) => {
    logError(error.message, {
      componentStack: errorInfo.componentStack,
      stack: error.stack,
      ...additionalContext,
      type: 'react'
    });
  };
}; 