import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const CourseCard = ({ course }) => {
  const { id, title, description, imageUrl, level, category } = course
  
  // Define badge color based on level
  const getLevelBadgeColor = (level) => {
    switch (level.toLowerCase()) {
      case 'básico':
        return 'bg-green-100 text-green-800'
      case 'intermedio':
        return 'bg-blue-100 text-blue-800'
      case 'avanzado':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={imageUrl || 'https://source.unsplash.com/random/300x200/?math'} 
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(level)}`}>
          {level}
        </span>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
        </div>
        
        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mb-3">
          {category}
        </span>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>
        
        <Link 
          to={`/course/${id}`}
          className="btn btn-primary w-full text-center"
        >
          Ver Curso
        </Link>
      </div>
    </div>
  )
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    level: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
  }).isRequired
}

export default CourseCard 