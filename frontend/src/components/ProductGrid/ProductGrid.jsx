import './ProductGrid.css'

const ProductGrid = ({ products, onProductClick }) => {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <div 
          key={product.id || index} 
          className="product-card"
          onClick={() => onProductClick && onProductClick(product)}
        >
          <div className="product-image">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              loading="lazy"
            />
            <div className="similarity-badge">
              {Math.round(product.similarity * 100)}% match
            </div>
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-price">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid