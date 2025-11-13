import { useState } from 'react'
import ImageUpload from '../../components/ImageUpload/ImageUpload'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { searchSimilarProducts } from '../../utils/api'
import './SearchPage.css'

const SearchPage = ({ onSearchComplete }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageSelect = async (imageData) => {
    setError('')
    setSelectedImage(imageData)
    setIsLoading(true)

    try {
      const formData = new FormData()
      
      if (imageData.type === 'file') {
        formData.append('image', imageData.file)
      } else if (imageData.type === 'url') {
        formData.append('imageUrl', imageData.url)
      }

      const results = await searchSimilarProducts(formData)
      onSearchComplete(results, imageData)
    } catch (err) {
      setError(err.message || 'Failed to search for similar products')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>Find Visually Similar Products</h2>
        <p>Upload an image or enter an image URL to find similar products</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <ImageUpload 
        onImageSelect={handleImageSelect}
        isLoading={isLoading}
      />

      {isLoading && (
        <LoadingSpinner message="Analyzing image and finding similar products..." />
      )}

      {selectedImage && !isLoading && (
        <div className="selected-image-preview">
          <h3>Selected Image</h3>
          <div className="image-preview">
            <img 
              src={selectedImage.preview || selectedImage.url} 
              alt="Selected for search" 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage