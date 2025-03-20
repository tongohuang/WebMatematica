import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../services/firestore';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import Button from './Button';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (err) {
        setError('Failed to load courses: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      );
    }
  
    if (courses.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900">No courses available</h3>
          {currentUser && currentUser.email === 'admin@example.com' && (
            <div className="mt-4">
              <Button 
                as={Link} 
                to="/courses/new"
              >
                Create a course
              </Button>
            </div>
          )}
        </div>
      );
    }
  
    return (
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Available Courses</h2>
            
            {currentUser && currentUser.email === 'admin@example.com' && (
              <Button 
                as={Link} 
                to="/courses/new"
              >
                Create a course
              </Button>
            )}
          </div>
  
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {courses.map((course) => (
              <div key={course.id} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img
                    src={course.imageUrl || 'https://via.placeholder.com/640x360?text=Course+Image'}
                    alt={course.title}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/courses/${course.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {course.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{course.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
} 