const express = require('express')
const multer = require('multer')
const axios = require('axios')

const router = express.Router()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

// Upload endpoints
router.post('/file', upload.single('image'), async (req, res) => {
  try {
    console.log('File upload request received')
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      })
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    })

    const imageInfo = {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      features: await extractImageFeatures(req.file.buffer)
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: imageInfo
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process image upload',
      error: error.message
    })
  }
})

router.post('/url', async (req, res) => {
  try {
    console.log('URL upload request received:', req.body)
    
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image URL provided' 
      })
    }

    // Validate URL
    try {
      new URL(imageUrl)
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid URL provided' 
      })
    }

    // Download image
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'arraybuffer',
      timeout: 10000
    })

    const imageInfo = {
      originalUrl: imageUrl,
      size: response.data.length,
      mimetype: response.headers['content-type'],
      features: await extractImageFeatures(response.data)
    }

    res.json({
      success: true,
      message: 'Image URL processed successfully',
      data: imageInfo
    })

  } catch (error) {
    console.error('URL upload error:', error)
    
    if (error.response) {
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to download image from URL. Please check the URL and try again.' 
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to process image URL',
      error: error.message
    })
  }
})

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Upload route is working!',
    timestamp: new Date().toISOString()
  })
})

// Simple feature extraction (placeholder)
async function extractImageFeatures(imageBuffer) {
  // For demo purposes, return mock features
  const hash = simpleHash(imageBuffer)
  
  return {
    color: hash % 100 / 100,
    texture: (hash % 73) / 73,
    shape: (hash % 89) / 89,
    size: (hash % 97) / 97
  }
}

// Simple hash function for demo
function simpleHash(buffer) {
  let hash = 0
  for (let i = 0; i < Math.min(buffer.length, 100); i++) {
    hash = ((hash << 5) - hash) + buffer[i]
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

module.exports = router