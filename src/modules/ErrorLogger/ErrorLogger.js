import { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Error logger that records errors to Firestore for debugging
// This centralizes error handling and provides a way to track issues

class ErrorLoggerService {
  constructor() {
    this.errors = []
    this.MAX_ERRORS_IN_MEMORY = 10
  }

  // Log an error to memory and Firestore
  async logError(error, context = {}) {
    const errorData = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    }
    
    this.errors.push(errorData)
    
    // Keep only the most recent errors in memory
    if (this.errors.length > this.MAX_ERRORS_IN_MEMORY) {
      this.errors.shift()
    }
    
    try {
      // Only log to Firestore if we have a connection
      if (db) {
        await addDoc(collection(db, 'errorLogs'), {
          ...errorData,
          timestamp: serverTimestamp()
        })
      } else {
        // Store in localStorage as fallback
        const storedErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]')
        localStorage.setItem('errorLogs', JSON.stringify([...storedErrors, errorData]))
      }
    } catch (logError) {
      console.error('Failed to log error to Firestore:', logError)
      
      // Store in localStorage as fallback
      const storedErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]')
      localStorage.setItem('errorLogs', JSON.stringify([...storedErrors, errorData]))
    }
    
    return errorData
  }
  
  // Get all errors stored in memory
  getErrors() {
    return [...this.errors]
  }
  
  // Clear all errors from memory
  clearErrors() {
    this.errors = []
  }
}

// Create single instance
export const errorLogger = new ErrorLoggerService()

// React component for global error handling
function ErrorLogger() {
  const [hasError, setHasError] = useState(false)
  
  // Handle window errors
  useEffect(() => {
    const handleError = (event) => {
      event.preventDefault()
      errorLogger.logError(event.error || new Error(event.message), {
        type: 'window.onerror'
      })
      setHasError(true)
    }
    
    // Handle promise rejections
    const handleRejection = (event) => {
      event.preventDefault()
      errorLogger.logError(event.reason || new Error('Unhandled Promise rejection'), {
        type: 'unhandledrejection'
      })
      setHasError(true)
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])
  
  if (hasError) {
    // You can add a UI notification here if needed
    // But we don't want to disrupt the user experience
    // so we just quietly log errors and don't display anything
  }
  
  return null // This component doesn't render anything
}

export default ErrorLogger 