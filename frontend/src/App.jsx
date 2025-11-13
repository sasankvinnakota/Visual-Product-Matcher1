import { useState, useEffect } from 'react'
import SearchPage from './pages/SearchPage/SearchPage'
import ResultsPage from './pages/ResultsPage/ResultsPage'
import { testApiConnection } from './utils/api'
import './styles/globals.css'

function App() {
  const [currentPage, setCurrentPage] = useState('search')
  const [searchResults, setSearchResults] = useState([])
  const [uploadedImage, setUploadedImage] = useState(null)
  const [apiStatus, setApiStatus] = useState('checking')

  // Test API connection on app start
  useEffect(() => {
    const checkApi = async () => {
      try {
        await testApiConnection()
        setApiStatus('connected')
      } catch (error) {
        console.error('API connection failed:', error)
        setApiStatus('disconnected')
      }
    }

    checkApi()
  }, [])

  const handleSearchComplete = (results, image) => {
    setSearchResults(results)
    setUploadedImage(image)
    setCurrentPage('results')
  }

  const handleNewSearch = () => {
    setCurrentPage('search')
    setSearchResults([])
    setUploadedImage(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Visual Product Matcher</h1>
          <div className="api-status">
            <span className={`status-indicator ${apiStatus}`}>
              {apiStatus === 'connected' ? '✅ API Connected' : 
               apiStatus === 'disconnected' ? '❌ API Disconnected' : 
               '⏳ Checking API...'}
            </span>
          </div>
        </div>
        {currentPage === 'results' && (
          <button onClick={handleNewSearch} className="new-search-btn">
            New Search
          </button>
        )}
      </header>

      {apiStatus === 'disconnected' && (
        <div className="api-warning">
          <p>
            ⚠️ Cannot connect to the backend server. Please make sure the backend is running on port 5000.
          </p>
          <p>
            Run: <code>cd backend && npm run dev</code>
          </p>
        </div>
      )}
      
      <main className="app-main">
        {currentPage === 'search' ? (
          <SearchPage onSearchComplete={handleSearchComplete} />
        ) : (
          <ResultsPage 
            results={searchResults} 
            uploadedImage={uploadedImage}
            onNewSearch={handleNewSearch}
          />
        )}
      </main>
    </div>
  )
}

export default App