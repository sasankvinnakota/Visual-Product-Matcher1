import { useState } from 'react'

export const useImageUpload = () => {
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select an image file'))
        return
      }

      setIsLoading(true)
      setError(null)

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = {
          file: file,
          preview: e.target.result,
          type: 'file'
        }
        setImage(imageData)
        setIsLoading(false)
        resolve(imageData)
      }
      reader.onerror = () => {
        const error = new Error('Failed to read file')
        setError(error)
        setIsLoading(false)
        reject(error)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleUrlUpload = async (url) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate URL and check if it's an image
      const response = await fetch(url, { method: 'HEAD' })
      const contentType = response.headers.get('content-type')
      
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL does not point to a valid image')
      }

      const imageData = {
        url: url,
        type: 'url'
      }
      setImage(imageData)
      setIsLoading(false)
      return imageData
    } catch (err) {
      const error = new Error('Invalid image URL or failed to load image')
      setError(error)
      setIsLoading(false)
      throw error
    }
  }

  const clearImage = () => {
    setImage(null)
    setError(null)
  }

  return {
    image,
    isLoading,
    error,
    handleFileUpload,
    handleUrlUpload,
    clearImage
  }
}