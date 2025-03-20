import { useState } from 'react'
import PropTypes from 'prop-types'

const ActivityCard = ({ activity }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      // Reset state when collapsing
      setShowSolution(false)
      setSelectedAnswers({})
      setSubmitted(false)
    }
  }
  
  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    })
  }
  
  const handleSubmit = () => {
    setSubmitted(true)
  }
  
  const getScoreMessage = () => {
    if (activity.type !== 'quizz' || !submitted) return null
    
    const correctAnswers = activity.questions.filter(
      question => selectedAnswers[question.id] === question.correctAnswer
    ).length
    
    const totalQuestions = activity.questions.length
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)
    
    let message = `Puntaje: ${correctAnswers}/${totalQuestions} (${percentage}%)`
    
    if (percentage === 100) {
      message += ' - ¡Excelente!'
    } else if (percentage >= 80) {
      message += ' - ¡Muy bien!'
    } else if (percentage >= 60) {
      message += ' - Bien'
    } else {
      message += ' - Sigue practicando'
    }
    
    return message
  }
  
  // Render different activity types
  const renderActivityContent = () => {
    switch (activity.type) {
      case 'quizz':
        return (
          <div className="space-y-4">
            {activity.questions.map((question, qIndex) => (
              <div key={question.id} className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium mb-2">{qIndex + 1}. {question.text}</p>
                
                <div className="space-y-2 ml-2">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`${question.id}-${index}`}
                        name={question.id}
                        checked={selectedAnswers[question.id] === index}
                        onChange={() => handleAnswerSelect(question.id, index)}
                        disabled={submitted}
                        className="mr-2"
                      />
                      <label 
                        htmlFor={`${question.id}-${index}`}
                        className={`
                          ${submitted && index === question.correctAnswer ? 'text-green-600 font-medium' : ''}
                          ${submitted && selectedAnswers[question.id] === index && index !== question.correctAnswer ? 'text-red-600 line-through' : ''}
                        `}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                
                {submitted && (
                  <div className="mt-2 text-sm">
                    {selectedAnswers[question.id] === question.correctAnswer ? (
                      <p className="text-green-600">¡Correcto!</p>
                    ) : (
                      <p className="text-red-600">
                        Incorrecto. La respuesta correcta es: {question.options[question.correctAnswer]}
                      </p>
                    )}
                    
                    {showSolution && question.explanation && (
                      <p className="text-gray-600 mt-1 italic">{question.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== activity.questions.length}
                className={`w-full py-2 rounded-md font-medium 
                  ${Object.keys(selectedAnswers).length === activity.questions.length
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Verificar respuestas
              </button>
            ) : (
              <div className="text-center font-medium mt-4">
                {getScoreMessage()}
              </div>
            )}
          </div>
        )
        
      case 'exercise':
        return (
          <div>
            <p className="mb-4">{activity.content}</p>
            
            {showSolution && (
              <div className="mt-4">
                <div className="p-3 bg-green-50 rounded-md mb-2">
                  <p className="font-semibold">Solución:</p>
                  <p>{activity.solution}</p>
                </div>
                
                {activity.explanation && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="font-semibold">Explicación:</p>
                    <p>{activity.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
        
      default:
        return <p>Tipo de actividad no soportado</p>
    }
  }
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Activity header */}
      <div 
        className="bg-gray-100 p-3 cursor-pointer flex justify-between items-center"
        onClick={toggleExpand}
      >
        <h3 className="font-medium">
          {activity.title}
        </h3>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Activity content */}
      {isExpanded && (
        <div className="p-4">
          {renderActivityContent()}
          
          <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              {showSolution ? 'Ocultar solución' : 'Ver solución'}
            </button>
            
            <button
              onClick={toggleExpand}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

ActivityCard.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['quizz', 'exercise']).isRequired,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string),
        correctAnswer: PropTypes.number,
        explanation: PropTypes.string
      })
    ),
    content: PropTypes.string,
    solution: PropTypes.string,
    explanation: PropTypes.string
  }).isRequired
}

export default ActivityCard 