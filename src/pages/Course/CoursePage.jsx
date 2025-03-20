import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { errorLogger } from '../../modules/ErrorLogger/ErrorLogger'

// Components for different resource types
import YouTubeEmbed from '../../components/resources/YouTubeEmbed'
import GeoGebraEmbed from '../../components/resources/GeoGebraEmbed'
import PdfViewer from '../../components/resources/PdfViewer'
import PhETEmbed from '../../components/resources/PhETEmbed'
import ActivityCard from '../../components/activities/ActivityCard'

const CoursePage = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  
  const [course, setCourse] = useState(null)
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  const [resources, setResources] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRef = doc(db, 'courses', courseId)
        const courseSnap = await getDoc(courseRef)
        
        if (!courseSnap.exists()) {
          setError('Curso no encontrado')
          return
        }
        
        setCourse({
          id: courseSnap.id,
          ...courseSnap.data()
        })
        
        // Fetch sections
        const sectionsRef = collection(db, 'courses', courseId, 'sections')
        const sectionsSnap = await getDocs(sectionsRef)
        
        const sectionsData = sectionsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setSections(sectionsData)
        
        // Set first section as selected if available
        if (sectionsData.length > 0) {
          setSelectedSection(sectionsData[0])
          fetchResourcesForSection(sectionsData[0].id)
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        errorLogger.logError(error, { context: 'CoursePage:fetchCourse', courseId })
        setError('Error al cargar el curso')
        
        // Mock data for development
        setCourse({
          id: '1',
          title: 'Álgebra Básica',
          description: 'Fundamentos y operaciones algebraicas para estudiantes.',
          level: 'Básico',
          category: 'Álgebra'
        })
        
        const mockSections = [
          { id: 's1', title: 'Introducción al Álgebra', order: 1 },
          { id: 's2', title: 'Expresiones Algebraicas', order: 2 },
          { id: 's3', title: 'Ecuaciones Lineales', order: 3 }
        ]
        
        setSections(mockSections)
        setSelectedSection(mockSections[0])
        
        const mockResources = [
          { 
            id: 'r1', 
            title: 'Introducción a las Variables', 
            type: 'youtube', 
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            description: 'Video introductorio sobre variables en álgebra'
          },
          { 
            id: 'r2', 
            title: 'Manipulación de Expresiones', 
            type: 'geogebra', 
            url: 'https://www.geogebra.org/m/nbjfjtpv',
            description: 'Applet para practicar con expresiones algebraicas'
          },
          { 
            id: 'r3', 
            title: 'Ecuaciones Lineales', 
            type: 'phet', 
            url: 'https://phet.colorado.edu/sims/html/equality-explorer/latest/equality-explorer_es.html',
            description: 'Simulador para ecuaciones lineales'
          }
        ]
        
        setResources(mockResources)
        
        const mockActivities = [
          {
            id: 'a1',
            title: 'Cuestionario: Variables',
            type: 'quizz',
            questions: [
              {
                id: 'q1',
                text: '¿Qué representa una variable en álgebra?',
                options: [
                  'Un número desconocido',
                  'Una operación matemática',
                  'Un símbolo para dividir',
                  'Una constante'
                ],
                correctAnswer: 0,
                explanation: 'Una variable representa un valor desconocido que puede cambiar'
              }
            ]
          },
          {
            id: 'a2',
            title: 'Ejercicio: Simplificación',
            type: 'exercise',
            content: 'Simplifica la expresión: 2x + 3x - 5',
            solution: '5x - 5',
            explanation: 'Agrupamos términos similares: 2x + 3x = 5x, y mantenemos el -5'
          }
        ]
        
        setActivities(mockActivities)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCourse()
  }, [courseId])
  
  // Fetch resources and activities when section changes
  const fetchResourcesForSection = async (sectionId) => {
    try {
      // Fetch resources
      const resourcesRef = collection(db, 'courses', courseId, 'sections', sectionId, 'resources')
      const resourcesSnap = await getDocs(resourcesRef)
      
      const resourcesData = resourcesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setResources(resourcesData)
      
      // Fetch activities
      const activitiesRef = collection(db, 'courses', courseId, 'sections', sectionId, 'activities')
      const activitiesSnap = await getDocs(activitiesRef)
      
      const activitiesData = activitiesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setActivities(activitiesData)
    } catch (error) {
      console.error('Error fetching section resources:', error)
      errorLogger.logError(error, { 
        context: 'CoursePage:fetchResourcesForSection', 
        courseId, 
        sectionId 
      })
    }
  }
  
  const handleSectionChange = (section) => {
    setSelectedSection(section)
    fetchResourcesForSection(section.id)
  }
  
  // Render resource based on type
  const renderResource = (resource) => {
    switch (resource.type) {
      case 'youtube':
        return <YouTubeEmbed url={resource.url} title={resource.title} />
      case 'geogebra':
        return <GeoGebraEmbed url={resource.url} title={resource.title} />
      case 'pdf':
        return <PdfViewer url={resource.url} title={resource.title} />
      case 'phet':
        return <PhETEmbed url={resource.url} title={resource.title} />
      default:
        return (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <p className="text-yellow-800">
              Tipo de recurso no soportado: {resource.type}
            </p>
          </div>
        )
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-center">
          <h2 className="text-red-800 text-xl font-semibold mb-2">{error}</h2>
          <p className="text-red-600 mb-4">No se pudo cargar la información del curso.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-primary"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        
        <div className="flex items-center gap-2 mb-6">
          <span className={`px-3 py-1 text-sm font-medium rounded-full 
            ${course.level === 'Básico' 
              ? 'bg-green-100 text-green-800' 
              : course.level === 'Intermedio' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
            {course.level}
          </span>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
            {course.category}
          </span>
        </div>
      </div>
      
      {/* Sections navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sections.map(section => (
          <button
            key={section.id}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedSection?.id === section.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => handleSectionChange(section)}
          >
            {section.title}
          </button>
        ))}
      </div>
      
      {/* Main content - two column layout */}
      {selectedSection && (
        <div className="flex flex-col md:flex-row">
          {/* Left column - Resources (80%) */}
          <div className="w-full md:w-4/5 pr-0 md:pr-6 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">{selectedSection.title}</h2>
            
            {resources.length > 0 ? (
              <div className="space-y-8">
                {resources.map(resource => (
                  <div key={resource.id} className="card">
                    <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    
                    <div className="rounded-lg overflow-hidden mb-4">
                      {renderResource(resource)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-500">No hay recursos disponibles para esta sección.</p>
              </div>
            )}
          </div>
          
          {/* Right column - Activities (20%) */}
          <div className="w-full md:w-1/5">
            <h2 className="text-xl font-bold mb-4">Actividades</h2>
            
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500">No hay actividades disponibles.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CoursePage 