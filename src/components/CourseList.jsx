import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import Button from './Button';
import CourseCard from './CourseCard';
import { logError } from '../utils/errorLogger';

export default function CourseList({ isPublic = false }) {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCourses(coursesData);
      } catch (err) {
        logError('Error fetching courses', { error: err });
        setError('Error al cargar los cursos: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCourses();
  }, []);

  const isAdmin = currentUser && currentUser.email === 'docente@webmatematica.com';

  return (
    <Layout withAuth={!isPublic}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isPublic && (
          <div className="pb-5 border-b border-gray-200 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mis Cursos</h1>
          </div>
        )}
        
        {isPublic && (
          <div className="pb-5 border-b border-gray-200 mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Cursos Disponibles</h1>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Iniciar Sesión Docente
            </Link>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">No hay cursos disponibles</h2>
            <p className="mt-2 text-gray-600">
              {isAdmin ? 'Comienza creando un nuevo curso.' : 'Pronto habrá cursos disponibles.'}
            </p>
            {isAdmin && (
              <div className="mt-6">
                <Button as={Link} to="/courses/new" variant="primary">
                  Crear Nuevo Curso
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                {courses.length} {courses.length === 1 ? 'curso disponible' : 'cursos disponibles'}
              </h2>
              
              {isAdmin && (
                <Button as={Link} to="/courses/new" variant="primary">
                  Crear Nuevo Curso
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 