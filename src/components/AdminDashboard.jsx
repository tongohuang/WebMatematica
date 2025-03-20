import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import Button from './Button';
import { logError } from '../utils/errorLogger';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch courses
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
        
        // In a real app, we would fetch users, but for now we'll just simulate it
        // This would require Firestore Security Rules or a backend server
        const mockUsers = [
          { id: '1', displayName: 'Admin User', email: 'admin@example.com', role: 'admin' },
          { id: '2', displayName: 'Test User', email: 'test@example.com', role: 'student' }
        ];
        setUsers(mockUsers);
        
      } catch (err) {
        logError('Error fetching admin data', { error: err });
        setError('Error al cargar los datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-4xl mx-auto mt-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Panel de Administración
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button as={Link} to="/courses/new" variant="primary">
              Crear nuevo curso
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Courses section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Cursos</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {courses.length} cursos disponibles
                </p>
              </div>
              <Button as={Link} to="/courses" variant="secondary" size="sm">
                Ver todos
              </Button>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {courses.slice(0, 5).map((course) => (
                  <li key={course.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-600 truncate">{course.title}</p>
                        <p className="text-sm text-gray-500 truncate">{course.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button as={Link} to={`/courses/${course.id}`} variant="tertiary" size="xs">
                          Ver
                        </Button>
                        <Button as={Link} to={`/courses/${course.id}/edit`} variant="secondary" size="xs">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
                {courses.length === 0 && (
                  <li className="px-4 py-5 text-center text-sm text-gray-500 italic">
                    No hay cursos disponibles
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Users section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Usuarios</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {users.length} usuarios registrados
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Gestionar usuarios
              </Button>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                  <li key={user.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-600 truncate">{user.displayName || user.email}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-gray-400">Rol: {user.role}</p>
                      </div>
                      <Button variant="secondary" size="xs">
                        Editar
                      </Button>
                    </div>
                  </li>
                ))}
                {users.length === 0 && (
                  <li className="px-4 py-5 text-center text-sm text-gray-500 italic">
                    No hay usuarios registrados
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Analytics section (placeholder) */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg lg:col-span-2">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Estadísticas</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Información sobre el uso de la plataforma
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-indigo-50 rounded-lg px-6 py-5">
                  <div className="text-2xl font-bold text-indigo-600">{courses.length}</div>
                  <div className="text-sm font-medium text-indigo-900">Cursos totales</div>
                </div>
                <div className="bg-green-50 rounded-lg px-6 py-5">
                  <div className="text-2xl font-bold text-green-600">{users.length}</div>
                  <div className="text-sm font-medium text-green-900">Usuarios registrados</div>
                </div>
                <div className="bg-yellow-50 rounded-lg px-6 py-5">
                  <div className="text-2xl font-bold text-yellow-600">0</div>
                  <div className="text-sm font-medium text-yellow-900">Actividades completadas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 