const express = require('express')
const productsData = require('../data/products.json')

const router = express.Router()

// Get all products
router.get('/', (req, res) => {
  try {
    console.log('Products request received')
    
    const { category, limit } = req.query
    
    let products = productsData.products

    // Filter by category if provided
    if (category && category !== 'all') {
      products = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Apply limit if provided
    if (limit) {
      products = products.slice(0, parseInt(limit))
    }

    console.log(`Returning ${products.length} products`)

    res.json({
      success: true,
      data: products,
      total: products.length
    })

  } catch (error) {
    console.error('Products error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    })
  }
})

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const product = productsData.products.find(p => p.id === req.params.id)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      data: product
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    })
  }
})

// Test endpoint
router.get('/test/test', (req, res) => {
  res.json({
    success: true,
    message: 'Products route is working!',
    totalProducts: productsData.products.length
  })
})

module.exports = router