import PropTypes from 'prop-types'

const PhETEmbed = ({ url, title }) => {
  // Validate URL (should be from phet.colorado.edu)
  const isValidPhETUrl = url.includes('phet.colorado.edu')
  
  if (!isValidPhETUrl) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <p className="text-red-800">URL de PhET inválida</p>
        <a 
          href="https://phet.colorado.edu/es/simulations/category/math" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary-600 hover:underline mt-2 inline-block"
        >
          Buscar simulaciones PhET
        </a>
      </div>
    )
  }
  
  return (
    <div className="phet-container h-[600px]">
      <iframe
        src={url}
        title={title || 'PhET Interactive Simulation'}
        className="w-full h-full border-none"
        allowFullScreen
      ></iframe>
    </div>
  )
}

PhETEmbed.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string
}

export default PhETEmbed 