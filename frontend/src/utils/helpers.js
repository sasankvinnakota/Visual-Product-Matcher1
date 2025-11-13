// Format price with currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Calculate similarity percentage
export const calculateSimilarity = (score) => {
  return Math.round(score * 100)
}

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Validate image URL
export const isValidImageUrl = (url) => {
  try {
    const parsedUrl = new URL(url)
    return /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(parsedUrl.pathname)
  } catch {
    return false
  }
}

// Generate placeholder product data
export const generatePlaceholderProducts = (count) => {
  const categories = ['electronics', 'clothing', 'footwear', 'home', 'sports']
  const products = []

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    products.push({
      id: `prod-${i + 1}`,
      name: `Product ${i + 1}`,
      category: category,
      price: Math.floor(Math.random() * 200) + 10,
      imageUrl: `https://picsum.photos/300/200?random=${i + 1}`,
      similarity: Math.random() * 0.5 + 0.5 // 0.5 to 1.0
    })
  }

  return products.sort((a, b) => b.similarity - a.similarity)
}