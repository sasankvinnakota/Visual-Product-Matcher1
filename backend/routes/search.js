const express = require('express')
const multer = require('multer')
const axios = require('axios')
const productsData = require('../data/products.json')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Search for similar products
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Search request received')
    
    let imageFeatures

    if (req.file) {
      // Process uploaded file
      console.log('Processing file upload')
      imageFeatures = await extractFeaturesFromImage(req.file.buffer)
    } else if (req.body.imageUrl) {
      // Process image from URL
      console.log('Processing URL:', req.body.imageUrl)
      const response = await axios({
        method: 'GET',
        url: req.body.imageUrl,
        responseType: 'arraybuffer',
        timeout: 10000
      })
      imageFeatures = await extractFeaturesFromImage(response.data)
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'No image provided. Please upload a file or provide an image URL.' 
      })
    }

    console.log('Image features extracted:', imageFeatures)

    // Calculate similarity with all products
    const productsWithSimilarity = productsData.products.map(product => {
      const similarity = calculateSimilarity(imageFeatures, product.features)
      return {
        ...product,
        similarity: similarity
      }
    })

    // Sort by similarity (highest first)
    const sortedProducts = productsWithSimilarity.sort((a, b) => b.similarity - a.similarity)

    // Return top 20 most similar products
    const results = sortedProducts.slice(0, 20)

    console.log(`Found ${results.length} similar products`)

    res.json({
      success: true,
      data: results,
      total: results.length,
      message: `Found ${results.length} similar products`
    })

  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to search for similar products',
      error: error.message
    })
  }
})

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Search route is working!',
    products: productsData.products.slice(0, 3)
  })
})

// Mock feature extraction
async function extractFeaturesFromImage(imageBuffer) {
  const hash = simpleHash(imageBuffer)
  
  return {
    color: hash % 100 / 100,
    texture: (hash % 73) / 73,
    shape: (hash % 89) / 89,
    size: (hash % 97) / 97
  }
}

// Mock similarity calculation
function calculateSimilarity(features1, features2) {
  if (!features2) return Math.random() * 0.3 + 0.1 // Low similarity for products without features

  const colorDiff = 1 - Math.abs(features1.color - (features2.color || 0))
  const textureDiff = 1 - Math.abs(features1.texture - (features2.texture || 0))
  const shapeDiff = 1 - Math.abs(features1.shape - (features2.shape || 0))
  const sizeDiff = 1 - Math.abs(features1.size - (features2.size || 0))

  const similarity = (colorDiff * 0.4 + textureDiff * 0.3 + shapeDiff * 0.2 + sizeDiff * 0.1)
  
  return Math.min(0.99, Math.max(0.1, similarity + (Math.random() * 0.2 - 0.1)))
}

// Simple hash function for demo
function simpleHash(buffer) {
  let hash = 0
  for (let i = 0; i < Math.min(buffer.length, 100); i++) {
    hash = ((hash << 5) - hash) + buffer[i]
    hash |= 0
  }
  return Math.abs(hash)
}

module.exports = router