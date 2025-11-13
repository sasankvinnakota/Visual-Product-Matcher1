import { useState, useMemo } from 'react'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import FilterBar from '../../components/FilterBar/FilterBar'
import './ResultsPage.css'

const ResultsPage = ({ results, uploadedImage, onNewSearch }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    minSimilarity: 0,
    sortBy: 'similarity'
  })

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = results.filter(product => 
      product.similarity >= filters.minSimilarity / 100
    )

    if (filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      )
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'similarity':
      default:
        filtered.sort((a, b) => b.similarity - a.similarity)
        break
    }

    return filtered
  }, [results, filters])

  const handleProductClick = (product) => {
    // In a real app, this would navigate to product detail page
    console.log('Product clicked:', product)
    alert(`Product: ${product.name}\nPrice: $${product.price}\nCategory: ${product.category}`)
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <div className="uploaded-image-section">
          <h3>Search Image</h3>
          <div className="uploaded-image">
            <img 
              src={uploadedImage.preview || uploadedImage.url} 
              alt="Search reference" 
            />
          </div>
        </div>

        <div className="results-summary">
          <h2>Similar Products Found</h2>
          <p className="results-count">
            Showing {filteredAndSortedProducts.length} of {results.length} products
          </p>
        </div>
      </div>

      <FilterBar 
        filters={filters}
        onFilterChange={setFilters}
      />

      <ProductGrid 
        products={filteredAndSortedProducts}
        onProductClick={handleProductClick}
      />

      {filteredAndSortedProducts.length === 0 && results.length > 0 && (
        <div className="no-filter-results">
          <p>No products match your current filters. Try adjusting the filters.</p>
        </div>
      )}
    </div>
  )
}

export default ResultsPage