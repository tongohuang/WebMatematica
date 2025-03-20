import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { errorLogger } from '../../modules/ErrorLogger/ErrorLogger'

// Components
import CourseCard from '../../components/courses/CourseCard'

const HomePage = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, 'courses')
        const coursesSnapshot = await getDocs(coursesCollection)
        const coursesList = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCourses(coursesList)
      } catch (error) {
        console.error('Error fetching courses:', error)
        errorLogger.logError(error, { context: 'HomePage:fetchCourses' })
        
        // Set sample data for development/preview
        setCourses([
          {
            id: '1',
            title: 'Álgebra Básica',
            description: 'Fundamentos y operaciones algebraicas para estudiantes de nivel medio.',
            imageUrl: 'https://source.unsplash.com/random/300x200/?math',
            level: 'Básico',
            category: 'Álgebra'
          },
          {
            id: '2',
            title: 'Geometría Analítica',
            description: 'Estudio de formas geométricas utilizando coordenadas y ecuaciones.',
            imageUrl: 'https://source.unsplash.com/random/300x200/?geometry',
            level: 'Intermedio',
            category: 'Geometría'
          },
          {
            id: '3',
            title: 'Cálculo Diferencial',
            description: 'Introducción a límites, derivadas y sus aplicaciones.',
            imageUrl: 'https://source.unsplash.com/random/300x200/?calculus',
            level: 'Avanzado',
            category: 'Cálculo'
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchCourses()
  }, [])
  
  // Filter courses by category
  const categories = ['Todos', 'Álgebra', 'Geometría', 'Cálculo', 'Estadística']
  const [activeCategory, setActiveCategory] = useState('Todos')
  
  const filteredCourses = activeCategory === 'Todos' 
    ? courses 
    : courses.filter(course => course.category === activeCategory)
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Aprende Matemáticas de Forma Interactiva
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Plataforma educativa gratuita con recursos interactivos, videos y actividades para todos los niveles.
          </p>
          <Link to="/courses" className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold text-lg transition-colors">
            Explorar Cursos
          </Link>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Características Principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Contenido Interactivo</h3>
              <p className="text-gray-600">
                Videos, simulaciones y applets para comprender conceptos matemáticos de forma visual e interactiva.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Autoevaluación</h3>
              <p className="text-gray-600">
                Actividades y ejercicios para practicar y evaluar tu comprensión con retroalimentación inmediata.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalización</h3>
              <p className="text-gray-600">
                Los docentes pueden personalizar el contenido y las actividades según las necesidades de sus estudiantes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestros Cursos</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } transition-colors`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Courses Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500 py-8">
                  No hay cursos disponibles en esta categoría.
                </p>
              )}
            </div>
          )}
          
          {/* View all courses button */}
          <div className="text-center mt-10">
            <Link to="/courses" className="btn btn-primary">
              Ver Todos los Cursos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage 