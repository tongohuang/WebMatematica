import { useState, useEffect } from 'react'
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase/config'
import { errorLogger } from '../../modules/ErrorLogger/ErrorLogger'

// Components
import CourseForm from '../../components/admin/CourseForm'
import ResourceForm from '../../components/admin/ResourceForm'
import ActivityForm from '../../components/admin/ActivityForm'
import CourseList from '../../components/admin/CourseList'
import ResourceList from '../../components/admin/ResourceList'
import ActivityList from '../../components/admin/ActivityList'

const AdminPage = () => {
  // State for managing courses, sections, resources, activities
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)
  const [sections, setSections] = useState([])
  const [resources, setResources] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // State for forms
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [isEditingCourse, setIsEditingCourse] = useState(false)
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [isAddingResource, setIsAddingResource] = useState(false)
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  
  // Fetch courses on mount
  useEffect(() => {
    fetchCourses()
  }, [])
  
  // Fetch sections when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchSections(selectedCourse.id)
    } else {
      setSections([])
      setSelectedSection(null)
    }
  }, [selectedCourse])
  
  // Fetch resources and activities when section is selected
  useEffect(() => {
    if (selectedSection) {
      fetchResources(selectedCourse.id, selectedSection.id)
      fetchActivities(selectedCourse.id, selectedSection.id)
    } else {
      setResources([])
      setActivities([])
    }
  }, [selectedSection])
  
  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true)
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
      errorLogger.logError(error, { context: 'AdminPage:fetchCourses' })
      setError('Error al cargar los cursos')
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch sections for a course
  const fetchSections = async (courseId) => {
    setLoading(true)
    try {
      const sectionsCollection = collection(db, 'courses', courseId, 'sections')
      const sectionsSnapshot = await getDocs(sectionsCollection)
      const sectionsList = sectionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSections(sectionsList)
    } catch (error) {
      console.error('Error fetching sections:', error)
      errorLogger.logError(error, { context: 'AdminPage:fetchSections', courseId })
      setError('Error al cargar las secciones')
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch resources for a section
  const fetchResources = async (courseId, sectionId) => {
    setLoading(true)
    try {
      const resourcesCollection = collection(db, 'courses', courseId, 'sections', sectionId, 'resources')
      const resourcesSnapshot = await getDocs(resourcesCollection)
      const resourcesList = resourcesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setResources(resourcesList)
    } catch (error) {
      console.error('Error fetching resources:', error)
      errorLogger.logError(error, { context: 'AdminPage:fetchResources', courseId, sectionId })
      setError('Error al cargar los recursos')
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch activities for a section
  const fetchActivities = async (courseId, sectionId) => {
    setLoading(true)
    try {
      const activitiesCollection = collection(db, 'courses', courseId, 'sections', sectionId, 'activities')
      const activitiesSnapshot = await getDocs(activitiesCollection)
      const activitiesList = activitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setActivities(activitiesList)
    } catch (error) {
      console.error('Error fetching activities:', error)
      errorLogger.logError(error, { context: 'AdminPage:fetchActivities', courseId, sectionId })
      setError('Error al cargar las actividades')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course)
    setSelectedSection(null)
    setSelectedResource(null)
  }
  
  // Handle section selection
  const handleSectionSelect = (section) => {
    setSelectedSection(section)
    setSelectedResource(null)
  }
  
  // Handle resource selection
  const handleResourceSelect = (resource) => {
    setSelectedResource(resource)
  }
  
  // Add new course
  const handleAddCourse = async (courseData) => {
    try {
      const coursesCollection = collection(db, 'courses')
      const newCourseRef = await addDoc(coursesCollection, courseData)
      
      // Add the new course to the list
      setCourses([...courses, { id: newCourseRef.id, ...courseData }])
      setIsAddingCourse(false)
    } catch (error) {
      console.error('Error adding course:', error)
      errorLogger.logError(error, { context: 'AdminPage:handleAddCourse', courseData })
      setError('Error al agregar el curso')
    }
  }
  
  // Update existing course
  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      const courseRef = doc(db, 'courses', courseId)
      await updateDoc(courseRef, courseData)
      
      // Update course in the list
      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, ...courseData } : course
      ))
      setIsEditingCourse(false)
    } catch (error) {
      console.error('Error updating course:', error)
      errorLogger.logError(error, { context: 'AdminPage:handleUpdateCourse', courseId, courseData })
      setError('Error al actualizar el curso')
    }
  }
  
  // Delete a course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
      return
    }
    
    try {
      await deleteDoc(doc(db, 'courses', courseId))
      
      // Remove the course from the list
      setCourses(courses.filter(course => course.id !== courseId))
      
      // Reset selected course if it was deleted
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null)
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      errorLogger.logError(error, { context: 'AdminPage:handleDeleteCourse', courseId })
      setError('Error al eliminar el curso')
    }
  }
  
  // Add new section
  const handleAddSection = async (sectionData) => {
    if (!selectedCourse) return
    
    try {
      const sectionsCollection = collection(db, 'courses', selectedCourse.id, 'sections')
      const newSectionRef = await addDoc(sectionsCollection, sectionData)
      
      // Add the new section to the list
      setSections([...sections, { id: newSectionRef.id, ...sectionData }])
      setIsAddingSection(false)
    } catch (error) {
      console.error('Error adding section:', error)
      errorLogger.logError(error, { 
        context: 'AdminPage:handleAddSection', 
        courseId: selectedCourse.id,
        sectionData 
      })
      setError('Error al agregar la sección')
    }
  }
  
  // Add new resource
  const handleAddResource = async (resourceData) => {
    if (!selectedCourse || !selectedSection) return
    
    try {
      // Handle file upload if PDF
      if (resourceData.type === 'pdf' && resourceData.file) {
        const storageRef = ref(storage, `courses/${selectedCourse.id}/resources/${resourceData.file.name}`)
        await uploadBytes(storageRef, resourceData.file)
        const downloadUrl = await getDownloadURL(storageRef)
        
        // Replace file with URL
        resourceData.url = downloadUrl
        delete resourceData.file
      }
      
      const resourcesCollection = collection(
        db, 
        'courses', 
        selectedCourse.id, 
        'sections', 
        selectedSection.id, 
        'resources'
      )
      
      const newResourceRef = await addDoc(resourcesCollection, resourceData)
      
      // Add the new resource to the list
      setResources([...resources, { id: newResourceRef.id, ...resourceData }])
      setIsAddingResource(false)
    } catch (error) {
      console.error('Error adding resource:', error)
      errorLogger.logError(error, { 
        context: 'AdminPage:handleAddResource', 
        courseId: selectedCourse.id,
        sectionId: selectedSection.id,
        resourceData 
      })
      setError('Error al agregar el recurso')
    }
  }
  
  // Add new activity
  const handleAddActivity = async (activityData) => {
    if (!selectedCourse || !selectedSection) return
    
    try {
      const activitiesCollection = collection(
        db, 
        'courses', 
        selectedCourse.id, 
        'sections', 
        selectedSection.id, 
        'activities'
      )
      
      const newActivityRef = await addDoc(activitiesCollection, activityData)
      
      // Add the new activity to the list
      setActivities([...activities, { id: newActivityRef.id, ...activityData }])
      setIsAddingActivity(false)
    } catch (error) {
      console.error('Error adding activity:', error)
      errorLogger.logError(error, { 
        context: 'AdminPage:handleAddActivity', 
        courseId: selectedCourse.id,
        sectionId: selectedSection.id,
        activityData 
      })
      setError('Error al agregar la actividad')
    }
  }
  
  // Delete a resource
  const handleDeleteResource = async (resourceId) => {
    if (!selectedCourse || !selectedSection) return
    
    if (!window.confirm('¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.')) {
      return
    }
    
    try {
      // Get resource data before deleting to check if it's a PDF
      const resourceToDelete = resources.find(r => r.id === resourceId)
      
      // Delete the resource document
      await deleteDoc(doc(
        db, 
        'courses', 
        selectedCourse.id, 
        'sections', 
        selectedSection.id, 
        'resources',
        resourceId
      ))
      
      // If it's a PDF, delete the file from storage
      if (resourceToDelete.type === 'pdf' && resourceToDelete.url) {
        try {
          // Extract filename from URL
          const url = new URL(resourceToDelete.url)
          const pathname = url.pathname
          const filename = pathname.substring(pathname.lastIndexOf('/') + 1)
          
          // Delete file from storage
          const fileRef = ref(storage, `courses/${selectedCourse.id}/resources/${filename}`)
          await deleteObject(fileRef)
        } catch (storageError) {
          console.error('Error deleting file from storage:', storageError)
        }
      }
      
      // Remove the resource from the list
      setResources(resources.filter(resource => resource.id !== resourceId))
    } catch (error) {
      console.error('Error deleting resource:', error)
      errorLogger.logError(error, { 
        context: 'AdminPage:handleDeleteResource', 
        courseId: selectedCourse.id,
        sectionId: selectedSection.id,
        resourceId 
      })
      setError('Error al eliminar el recurso')
    }
  }
  
  // Delete an activity
  const handleDeleteActivity = async (activityId) => {
    if (!selectedCourse || !selectedSection) return
    
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.')) {
      return
    }
    
    try {
      await deleteDoc(doc(
        db, 
        'courses', 
        selectedCourse.id, 
        'sections', 
        selectedSection.id, 
        'activities',
        activityId
      ))
      
      // Remove the activity from the list
      setActivities(activities.filter(activity => activity.id !== activityId))
    } catch (error) {
      console.error('Error deleting activity:', error)
      errorLogger.logError(error, { 
        context: 'AdminPage:handleDeleteActivity', 
        courseId: selectedCourse.id,
        sectionId: selectedSection.id,
        activityId 
      })
      setError('Error al eliminar la actividad')
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
          >
            Cerrar
          </button>
        </div>
      )}
      
      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Course/Section/Resource Management (80%) */}
        <div className="w-full lg:w-4/5">
          <div className="bg-white p-6 rounded-xl shadow-md">
            {/* Course management */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Cursos</h2>
                <button
                  onClick={() => setIsAddingCourse(true)}
                  className="btn btn-primary"
                >
                  Agregar Curso
                </button>
              </div>
              
              {isAddingCourse ? (
                <CourseForm 
                  onSubmit={handleAddCourse}
                  onCancel={() => setIsAddingCourse(false)}
                />
              ) : isEditingCourse && selectedCourse ? (
                <CourseForm 
                  initialData={selectedCourse}
                  onSubmit={(data) => handleUpdateCourse(selectedCourse.id, data)}
                  onCancel={() => setIsEditingCourse(false)}
                />
              ) : (
                <CourseList 
                  courses={courses}
                  selectedCourseId={selectedCourse?.id}
                  onSelect={handleCourseSelect}
                  onEdit={() => setIsEditingCourse(true)}
                  onDelete={handleDeleteCourse}
                />
              )}
            </div>
            
            {/* Section management */}
            {selectedCourse && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Secciones de "{selectedCourse.title}"
                  </h2>
                  <button
                    onClick={() => setIsAddingSection(true)}
                    className="btn btn-primary"
                  >
                    Agregar Sección
                  </button>
                </div>
                
                {isAddingSection ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-3">Nueva Sección</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Título de la sección"
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsAddingSection(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddSection}
                        className="btn btn-primary"
                        disabled={!newSectionTitle}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {sections.map(section => (
                      <button
                        key={section.id}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          selectedSection?.id === section.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        onClick={() => handleSectionSelect(section)}
                      >
                        {section.title}
                      </button>
                    ))}
                    
                    {sections.length === 0 && (
                      <p className="text-gray-500">No hay secciones disponibles. Agrega una sección para empezar.</p>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Resource management */}
            {selectedCourse && selectedSection && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Recursos de "{selectedSection.title}"
                  </h2>
                  <button
                    onClick={() => setIsAddingResource(true)}
                    className="btn btn-primary"
                  >
                    Agregar Recurso
                  </button>
                </div>
                
                {isAddingResource ? (
                  <ResourceForm 
                    onSubmit={handleAddResource}
                    onCancel={() => setIsAddingResource(false)}
                  />
                ) : (
                  <ResourceList 
                    resources={resources}
                    onDelete={handleDeleteResource}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Activity Management (20%) */}
        <div className="w-full lg:w-1/5">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Actividades</h2>
            
            {selectedCourse && selectedSection ? (
              <>
                <button
                  onClick={() => setIsAddingActivity(true)}
                  className="btn btn-primary w-full mb-4"
                >
                  Agregar Actividad
                </button>
                
                {isAddingActivity ? (
                  <ActivityForm 
                    onSubmit={handleAddActivity}
                    onCancel={() => setIsAddingActivity(false)}
                  />
                ) : (
                  <ActivityList 
                    activities={activities}
                    onDelete={handleDeleteActivity}
                  />
                )}
              </>
            ) : (
              <p className="text-gray-500">
                Selecciona un curso y una sección para gestionar actividades.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage 