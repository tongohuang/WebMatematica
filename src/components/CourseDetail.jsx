import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import Button from './Button';
import { logError } from '../utils/errorLogger';

export default function CourseDetail({ isPublic = false }) {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        
        // Get course data
        const courseDoc = await getDoc(doc(db, 'courses', id));
        if (!courseDoc.exists()) {
          setError('Curso no encontrado');
          setLoading(false);
          return;
        }
        
        setCourse({ id: courseDoc.id, ...courseDoc.data() });
        
        // Get sections
        const sectionsQuery = query(
          collection(db, 'sections'),
          where('courseId', '==', id),
          orderBy('order', 'asc')
        );
        
        const sectionsSnapshot = await getDocs(sectionsQuery);
        const sectionsData = sectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSections(sectionsData);
        
        // Set first section as active if available
        if (sectionsData.length > 0) {
          setActiveSection(sectionsData[0]);
          await fetchActivities(sectionsData[0].id);
        }
        
      } catch (err) {
        logError('Error fetching course data', { courseId: id, error: err });
        setError('Error al cargar el curso: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCourseData();
  }, [id]);
  
  async function fetchActivities(sectionId) {
    try {
      const activitiesQuery = query(
        collection(db, 'activities'),
        where('sectionId', '==', sectionId)
      );
      
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const activitiesData = activitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setActivities(activitiesData);
    } catch (err) {
      logError('Error fetching activities', { sectionId, error: err });
      // We don't set error state here to avoid blocking the entire UI
      console.error('Error fetching activities:', err);
    }
  }
  
  function handleSectionChange(section) {
    setActiveSection(section);
    fetchActivities(section.id);
  }
  
  function renderYoutubeVideo(url) {
    // Extract video ID from YouTube URL
    const videoId = url.includes('youtube.com') 
      ? url.split('v=')[1]?.split('&')[0]
      : url.includes('youtu.be')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : null;
    
    if (!videoId) return null;
    
    return (
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  
  function renderMarkdown(content) {
    // Simple markdown parser for headings, paragraphs, lists
    if (!content) return null;
    
    // Split content by new lines and map each line
    return (
      <div className="prose max-w-none">
        {content.split('\n').map((line, index) => {
          // Heading 1
          if (line.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
          }
          // Heading 2
          else if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-semibold mt-5 mb-3">{line.substring(3)}</h2>;
          }
          // Heading 3
          else if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-medium mt-4 mb-2">{line.substring(4)}</h3>;
          }
          // List item
          else if (line.startsWith('- ')) {
            return <li key={index} className="ml-4">{line.substring(2)}</li>;
          }
          // Paragraph (non-empty line)
          else if (line.trim()) {
            // Handle bold text with ** or __
            const formattedLine = line
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/__(.*?)__/g, '<strong>$1</strong>');
            
            return <p key={index} className="my-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
          }
          // Empty line
          return <br key={index} />;
        })}
      </div>
    );
  }
  
  function renderActivities() {
    if (activities.length === 0) {
      return <p className="text-gray-500 italic">No hay actividades disponibles para esta sección.</p>;
    }
    
    // Para usuarios no autenticados, solo mostrar nombres de actividades
    if (isPublic && !currentUser) {
      return (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Actividades</h3>
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-lg">{activity.title}</h4>
                <p className="text-gray-600">{activity.description}</p>
                <p className="text-sm text-indigo-600 mt-2">Inicia sesión como estudiante para realizar esta actividad</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Actividades</h3>
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-lg">{activity.title}</h4>
              <p className="text-gray-600">{activity.description}</p>
              <div className="mt-2">
                <Button size="sm" variant="secondary">
                  Ver actividad
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isAdmin = currentUser && currentUser.email === 'docente@webmatematica.com';

  if (loading) {
    return (
      <Layout withAuth={!isPublic}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout withAuth={!isPublic}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-4xl mx-auto mt-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout withAuth={!isPublic}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Curso no encontrado</h2>
          <div className="mt-4">
            <Link to="/courses" className="text-indigo-600 hover:text-indigo-800">
              Volver al listado de cursos
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout withAuth={!isPublic}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="mt-2 text-gray-600">{course.description}</p>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span className="mr-4">Nivel: {course.level}</span>
                <span className="mr-4">Duración: {course.duration}</span>
              </div>
            </div>
            
            {isPublic && !currentUser && (
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Iniciar Sesión Docente
              </Link>
            )}
            
            {isAdmin && (
              <Button as={Link} to={`/admin/courses/${id}/edit`} variant="secondary" size="sm">
                Editar curso
              </Button>
            )}
          </div>
        </div>
        
        {/* Course content */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Contenido del curso</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection?.id === section.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSectionChange(section)}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="mt-6 lg:mt-0 lg:col-span-9">
            {activeSection ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeSection.title}</h2>
                <p className="text-gray-600 mb-6">{activeSection.description}</p>
                
                {/* YouTube video if available */}
                {activeSection.videoUrl && renderYoutubeVideo(activeSection.videoUrl)}
                
                {/* Section content */}
                {renderMarkdown(activeSection.content)}
                
                {/* Activities */}
                {renderActivities()}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Selecciona una sección para ver su contenido</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 