import PropTypes from 'prop-types'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { errorLogger } from '../../modules/ErrorLogger/ErrorLogger'

// Set up worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const PdfViewer = ({ url, title }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error)
    errorLogger.logError(error, { context: 'PdfViewer', url })
    setError('No se pudo cargar el documento PDF')
    setLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1)
  }

  const goToNextPage = () => {
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1)
  }

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
          Descargar PDF
        </a>
      </div>
    )
  }

  return (
    <div className="pdf-viewer">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex justify-center items-center h-64 bg-gray-100 rounded-md">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        }
      >
        <Page 
          pageNumber={pageNumber} 
          renderTextLayer={false}
          className="flex justify-center"
          width={600}
        />
      </Document>

      {!loading && numPages > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={goToPrevPage} 
            disabled={pageNumber <= 1}
            className={`px-3 py-1 rounded-md ${
              pageNumber <= 1 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            Anterior
          </button>
          
          <p className="text-center">
            Página {pageNumber} de {numPages}
          </p>
          
          <button 
            onClick={goToNextPage} 
            disabled={pageNumber >= numPages}
            className={`px-3 py-1 rounded-md ${
              pageNumber >= numPages 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

PdfViewer.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string
}

export default PdfViewer 