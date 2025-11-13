import { useState, useEffect } from 'react'
import { getProducts, searchSimilarProducts } from '../utils/api'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const searchProducts = async (imageData) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      
      if (imageData.type === 'file') {
        formData.append('image', imageData.file)
      } else if (imageData.type === 'url') {
        formData.append('imageUrl', imageData.url)
      }

      const results = await searchSimilarProducts(formData)
      return results
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return {
    products,
    isLoading,
    error,
    searchProducts,
    refreshProducts: loadProducts
  }
}