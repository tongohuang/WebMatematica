import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from './Layout';
import Button from './Button';
import { logError } from '../utils/errorLogger';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          // Create a basic profile if it doesn't exist
          setUserProfile({
            displayName: currentUser.displayName || 'Usuario',
            email: currentUser.email,
            role: 'student'
          });
        }
      } catch (err) {
        logError('Error fetching user profile', { error: err });
        setError('Error al cargar el perfil: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido, {userProfile?.displayName || currentUser.email}!</h2>
              <p className="mt-1 text-sm text-gray-500">
                Panel personal de WebMatemática
              </p>
            </div>
            
            {userProfile?.role === 'admin' && (
              <Button as={Link} to="/admin/dashboard" variant="secondary" size="sm">
                Panel de administración
              </Button>
            )}
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userProfile?.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Rol</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                  {userProfile?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Acciones rápidas</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Explorar cursos</h3>
              <p className="text-gray-600 mb-4">Descubre todos los cursos de matemáticas disponibles en la plataforma.</p>
              <Button as={Link} to="/courses" variant="primary" size="sm" className="w-full">
                Ver cursos
              </Button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mi progreso</h3>
              <p className="text-gray-600 mb-4">Revisa tu avance en los cursos y actividades que has comenzado.</p>
              <Button as={Link} to="/progress" variant="secondary" size="sm" className="w-full">
                Ver progreso
              </Button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil</h3>
              <p className="text-gray-600 mb-4">Actualiza tu información personal y preferencias de aprendizaje.</p>
              <Button as={Link} to="/profile" variant="secondary" size="sm" className="w-full">
                Editar perfil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 