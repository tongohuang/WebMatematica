import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { errorLogger } from '../../modules/ErrorLogger/ErrorLogger'

const GeoGebraEmbed = ({ url, title }) => {
  const [geogebraId, setGeogebraId] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    try {
      // Extract GeoGebra material ID from URL
      const extractId = (url) => {
        // Handle URLs like https://www.geogebra.org/m/nbjfjtpv
        const match = url.match(/geogebra\.org\/m\/([a-zA-Z0-9]+)/)
        if (match && match[1]) {
          return match[1]
        }
        
        // Handle URLs like https://www.geogebra.org/material/show/id/12345
        const idMatch = url.match(/id\/([a-zA-Z0-9]+)/)
        if (idMatch && idMatch[1]) {
          return idMatch[1]
        }
        
        return null
      }
      
      const id = extractId(url)
      if (!id) {
        throw new Error('URL de GeoGebra inválida')
      }
      
      setGeogebraId(id)
    } catch (error) {
      console.error('GeoGebra embed error:', error)
      errorLogger.logError(error, { context: 'GeoGebraEmbed', url })
      setError('No se pudo cargar el applet de GeoGebra')
    }
  }, [url])
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <p className="text-red-800">{error}</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary-600 hover:underline mt-2 inline-block"
        >
          Ver en GeoGebra
        </a>
      </div>
    )
  }
  
  if (!geogebraId) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-md">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div className="geogebra-container h-[500px]">
      <iframe
        src={`https://www.geogebra.org/material/iframe/id/${geogebraId}`}
        title={title || 'GeoGebra Applet'}
        className="w-full h-full border-none"
        allowFullScreen
      ></iframe>
    </div>
  )
}

GeoGebraEmbed.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string
}

export default GeoGebraEmbed 