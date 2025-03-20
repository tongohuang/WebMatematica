import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { errorLogger } from '../../modules/ErrorLogger/ErrorLogger'

const YouTubeEmbed = ({ url, title }) => {
  const [videoId, setVideoId] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    try {
      // Extract YouTube video ID from URL
      const extractVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
      }
      
      const id = extractVideoId(url)
      if (!id) {
        throw new Error('URL de YouTube inválida')
      }
      
      setVideoId(id)
    } catch (error) {
      console.error('YouTube embed error:', error)
      errorLogger.logError(error, { context: 'YouTubeEmbed', url })
      setError('No se pudo cargar el video de YouTube')
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
          Ver en YouTube
        </a>
      </div>
    )
  }
  
  if (!videoId) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-md">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  )
}

YouTubeEmbed.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string
}

export default YouTubeEmbed 