import { useState } from 'react'
import PropTypes from 'prop-types'

const ActivityForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'quiz',
    description: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ]
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle changes to questions
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    }
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  // Handle changes to question options
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions]
    const updatedOptions = [...updatedQuestions[questionIndex].options]
    updatedOptions[optionIndex] = value
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    }
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  // Handle correct answer selection
  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctAnswer: optionIndex
    }
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  // Add a new question
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }
      ]
    })
  }

  // Remove a question
  const removeQuestion = (index) => {
    if (formData.questions.length <= 1) {
      return // Don't remove the last question
    }
    
    const updatedQuestions = [...formData.questions]
    updatedQuestions.splice(index, 1)
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate that all fields are filled
    const isValid = formData.questions.every(q => 
      q.question.trim() !== '' && 
      q.options.every(opt => opt.trim() !== '') &&
      q.explanation.trim() !== ''
    )
    
    if (!isValid) {
      alert('Por favor completa todos los campos de las preguntas')
      return
    }
    
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-lg font-medium mb-3">Nueva Actividad</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Título de la actividad"
            required
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="quiz">Quiz</option>
            <option value="exercise">Ejercicio</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Descripción breve de la actividad"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">Preguntas</h4>
            <button
              type="button"
              onClick={addQuestion}
              className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md hover:bg-green-100"
            >
              Agregar Pregunta
            </button>
          </div>
          
          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="border border-gray-200 rounded-md p-3 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium">Pregunta {qIndex + 1}</h5>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pregunta
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Escribe la pregunta"
                  required
                />
              </div>
              
              <div className="mb-3">
                <p className="block text-xs font-medium text-gray-700 mb-1">
                  Opciones (Selecciona la opción correcta)
                </p>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center mb-2">
                    <input
                      type="radio"
                      checked={question.correctAnswer === oIndex}
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                      className="h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="ml-2 w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder={`Opción ${oIndex + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Explicación de la respuesta
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Explica por qué esta es la respuesta correcta"
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 rounded-md text-sm font-medium text-white hover:bg-primary-700"
        >
          Crear
        </button>
      </div>
    </form>
  )
}

ActivityForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ActivityForm 