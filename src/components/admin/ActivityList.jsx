import PropTypes from 'prop-types'

const ActivityList = ({ activities, onDelete }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        <p className="text-gray-500 text-sm">No hay actividades disponibles. Agrega una actividad para empezar.</p>
      </div>
    )
  }

  // Get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'exercise':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  // Get label for activity type
  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'quiz':
        return 'Quiz'
      case 'exercise':
        return 'Ejercicio'
      default:
        return 'Actividad'
    }
  }

  return (
    <ul className="space-y-2">
      {activities.map((activity) => (
        <li key={activity.id} className="border border-gray-200 rounded-md p-3">
          <div className="flex items-center space-x-3">
            {getActivityIcon(activity.type)}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{activity.title}</p>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                  {getActivityTypeLabel(activity.type)}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {activity.questions?.length || 0} {activity.questions?.length === 1 ? 'pregunta' : 'preguntas'}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(activity.id)}
              className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              Eliminar
            </button>
          </div>
          {activity.description && (
            <p className="mt-2 text-xs text-gray-500 line-clamp-2">{activity.description}</p>
          )}
        </li>
      ))}
    </ul>
  )
}

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string,
      questions: PropTypes.array
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ActivityList 