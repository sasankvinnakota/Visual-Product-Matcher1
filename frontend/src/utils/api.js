import axios from 'axios'

// Use environment variable for API URL or fallback to deployed backend
// REPLACE 'your-app' with your actual Vercel app name// Use your deployed backend URL
const API_BASE_URL = 'https://your-app.vercel.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`, response.data)
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    
    let message = 'An error occurred'
    
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      message = 'Unable to connect to the server. Please check if the backend is deployed and running.'
    } else if (error.response) {
      message = error.response.data?.message || error.message
    } else if (error.request) {
      message = 'No response received from server. The backend might be down.'
    } else {
      message = error.message
    }
    
    throw new Error(message)
  }
)

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await api.get('/health')
    console.log('API connection test:', response)
    return response
  } catch (error) {
    console.error('API connection test failed:', error)
    throw error
  }
}

// Get all products
export const getProducts = async () => {
  try {
    return await api.get('/products')
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Search similar products with image upload
export const searchSimilarProducts = async (formData) => {
  try {
    return await api.post('/search', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

// Search by image URL
export const searchByImageUrl = async (imageUrl) => {
  try {
    return await api.post('/search/url', { imageUrl })
  } catch (error) {
    console.error('Error searching by URL:', error)
    throw error
  }
}

// Upload image (if you have this endpoint)
export const uploadImage = async (imageData) => {
  try {
    const formData = new FormData()
    
    if (imageData.file) {
      formData.append('image', imageData.file)
    } else if (imageData.url) {
      return await searchByImageUrl(imageData.url)
    }

    return await api.post('/search', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Get product by ID
export const getProductById = async (id) => {
  try {
    return await api.get(`/products/${id}`)
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    return await api.get(`/products/category/${category}`)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw error
  }
}

export default api