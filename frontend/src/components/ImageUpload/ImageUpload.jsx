import { useState } from 'react'
import './ImageUpload.css'

const ImageUpload = ({ onImageSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageSelect({
          file: file,
          preview: e.target.result,
          type: 'file'
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    if (imageUrl) {
      onImageSelect({
        url: imageUrl,
        type: 'url'
      })
    }
  }

  return (
    <div className="image-upload">
      <div className="upload-methods">
        {/* File Upload */}
        <div className="upload-section">
          <h3>Upload Image</h3>
          <div 
            className={`drop-zone ${dragActive ? 'active' : ''} ${isLoading ? 'disabled' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleChange}
              disabled={isLoading}
            />
            <label htmlFor="file-upload" className="drop-zone-label">
              <div className="upload-icon">📁</div>
              <p>Drag & drop an image here</p>
              <p>or</p>
              <span className="browse-btn">Browse Files</span>
            </label>
          </div>
        </div>

        {/* URL Input */}
        <div className="upload-section">
          <h3>Or Enter Image URL</h3>
          <form onSubmit={handleUrlSubmit} className="url-form">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isLoading}
              className="url-input"
            />
            <button 
              type="submit" 
              disabled={!imageUrl || isLoading}
              className="url-submit-btn"
            >
              Use URL
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload