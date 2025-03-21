import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Layout({ children, withAuth = true }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = currentUser && currentUser.email === 'docente@webmatematica.com';

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                WebMatemática
              </Link>
              
              <nav className="ml-10 space-x-6">
                <Link to="/" className="text-gray-700 hover:text-indigo-600">
                  Cursos
                </Link>
                
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-indigo-600">
                    Administración
                  </Link>
                )}
              </nav>
            </div>
            
            <div>
              {withAuth && currentUser ? (
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <Button onClick={handleLogout} variant="secondary" size="sm">
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Iniciar Sesión Docente
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} WebMatemática. Todos los derechos reservados.
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              Aplicación educativa para aprendizaje de matemáticas
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 