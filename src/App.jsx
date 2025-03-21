import React, { useEffect } from 'react';
import TestAuthAndFirestore from "./TestAuthAndFirestore";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import AdminDashboard from './components/AdminDashboard';
import ErrorPage from './components/ErrorPage';
import NotFound from './components/NotFound';
import AdminSetup from './components/AdminSetup';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import { setupErrorCapture } from './utils/errorLogger';

// Initialize error capture
setupErrorCapture();

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/setup" element={<AdminSetup />} />
            <Route path="/" element={<CourseList isPublic={true} />} />
            <Route path="/courses" element={<CourseList isPublic={true} />} />
            <Route path="/courses/:id" element={<CourseDetail isPublic={true} />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
            
            {/* Error Routes */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 