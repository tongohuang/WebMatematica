import PropTypes from 'prop-types'

const CourseList = ({ courses, selectedCourseId, onSelect, onEdit, onDelete }) => {
  if (courses.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-md text-center">
        <p className="text-gray-500">No hay cursos disponibles. Agrega un curso para empezar.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {courses.map((course) => (
          <li key={course.id} className={`block hover:bg-gray-50 ${selectedCourseId === course.id ? 'bg-gray-50' : ''}`}>
            <div className="flex items-center px-4 py-4 sm:px-6">
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={course.image || 'https://via.placeholder.com/50'}
                    alt={course.title}
                  />
                </div>
                <div className="min-w-0 flex-1 px-4">
                  <div>
                    <p className="truncate text-sm font-medium text-primary-600">
                      {course.title}
                    </p>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {course.description?.substring(0, 80)}
                      {course.description?.length > 80 ? '...' : ''}
                    </p>
                    <div className="mt-2 flex">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.level === 'beginner' ? 'Principiante' :
                         course.level === 'intermediate' ? 'Intermedio' :
                         'Avanzado'}
                      </span>
                      {course.published === false && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          No publicado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onSelect(course)}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    selectedCourseId === course.id
                      ? 'bg-primary-700 text-white'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  {selectedCourseId === course.id ? 'Seleccionado' : 'Seleccionar'}
                </button>
                <button
                  onClick={() => {
                    onSelect(course)
                    onEdit()
                  }}
                  className="inline-flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

CourseList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      image: PropTypes.string,
      level: PropTypes.string,
      published: PropTypes.bool
    })
  ).isRequired,
  selectedCourseId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default CourseList 