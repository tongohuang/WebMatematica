import PropTypes from 'prop-types'

const ResourceList = ({ resources, onDelete }) => {
  if (resources.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-md text-center">
        <p className="text-gray-500">No hay recursos disponibles. Agrega un recurso para empezar.</p>
      </div>
    )
  }

  // Get icon based on resource type
  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'geogebra':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
        )
      case 'phet':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        )
      case 'pdf':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )
    }
  }

  // Get label for resource type
  const getResourceTypeLabel = (type) => {
    switch (type) {
      case 'video':
        return 'Video'
      case 'geogebra':
        return 'GeoGebra'
      case 'phet':
        return 'PhET'
      case 'pdf':
        return 'PDF'
      default:
        return 'Recurso'
    }
  }

  return (
    <ul className="divide-y divide-gray-200">
      {resources.map((resource) => (
        <li key={resource.id} className="py-4">
          <div className="flex items-center space-x-4">
            {getResourceIcon(resource.type)}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{resource.title}</p>
              <p className="truncate text-sm text-gray-500">
                {resource.description || `Recurso tipo ${getResourceTypeLabel(resource.type)}`}
              </p>
            </div>
            <div className="flex space-x-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {getResourceTypeLabel(resource.type)}
              </span>
              <button
                onClick={() => onDelete(resource.id)}
                className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                Eliminar
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

ResourceList.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      url: PropTypes.string,
      description: PropTypes.string
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ResourceList 