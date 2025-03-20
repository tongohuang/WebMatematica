import { useState } from 'react'
import PropTypes from 'prop-types'

const ResourceForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    url: '',
    file: null,
    description: ''
  })

  const [previewUrl, setPreviewUrl] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (type === 'file') {
      // Handle file uploads
      const file = files[0]
      if (file) {
        setFormData({
          ...formData,
          file: file,
          url: '' // Clear URL when a file is selected
        })
        
        // Show preview
        const fileReader = new FileReader()
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
      }
    } else {
      // Handle other form fields
      setFormData({
        ...formData,
        [name]: value
      })
      
      // Clear file when URL is entered
      if (name === 'url' && value) {
        setFormData({
          ...formData,
          [name]: value,
          file: null
        })
        setPreviewUrl(null)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Render different form fields based on resource type
  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'video':
        return (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL del video (YouTube)
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Introduce una URL de YouTube válida
            </p>
          </div>
        )
      
      case 'geogebra':
        return (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL de GeoGebra
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://www.geogebra.org/m/..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Introduce una URL de GeoGebra válida
            </p>
          </div>
        )
      
      case 'phet':
        return (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL de PhET
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://phet.colorado.edu/sims/..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Introduce una URL de PhET válida
            </p>
          </div>
        )
      
      case 'pdf':
        return (
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Archivo PDF
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".pdf"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required={!formData.url}
            />
            {previewUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Vista previa no disponible para PDFs</p>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-lg font-medium mb-3">Nuevo Recurso</h3>
      
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
            placeholder="Título del recurso"
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
            <option value="video">Video (YouTube)</option>
            <option value="geogebra">GeoGebra</option>
            <option value="phet">PhET</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        
        {renderTypeSpecificFields()}
        
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
            placeholder="Descripción del recurso (opcional)"
          />
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

ResourceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ResourceForm 