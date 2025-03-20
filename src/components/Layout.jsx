import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link to="/" className="flex items-center">
              <span className="font-heading text-2xl font-bold text-primary-600">WebMatemática</span>
            </Link>
          </div>
          
          <nav className="flex space-x-4 items-center">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Cursos
                </Link>
                {currentUser.email === 'admin@example.com' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600">
                    Admin
                  </Link>
                )}
                <div className="flex items-center ml-4">
                  <span className="text-sm text-gray-600 mr-2">{currentUser.email}</span>
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-primary-600">
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <span className="font-heading text-xl font-bold">WebMatemática</span>
              <p className="mt-2 text-gray-400 text-sm">
                Una plataforma educativa para el aprendizaje de matemáticas.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider">Recursos</h2>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">Documentación</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">Tutoriales</a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider">Soporte</h2>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">Preguntas frecuentes</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">Contacto</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row md:justify-between">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} WebMatemática. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 