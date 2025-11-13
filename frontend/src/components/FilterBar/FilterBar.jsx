import './FilterBar.css'

const FilterBar = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (e) => {
    onFilterChange({
      ...filters,
      category: e.target.value
    })
  }

  const handleSortChange = (e) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value
    })
  }

  const handleMinSimilarityChange = (e) => {
    onFilterChange({
      ...filters,
      minSimilarity: parseInt(e.target.value)
    })
  }

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="category-filter">Category:</label>
        <select 
          id="category-filter"
          value={filters.category} 
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="footwear">Footwear</option>
          <option value="home">Home & Garden</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="similarity-filter">Min Similarity:</label>
        <select 
          id="similarity-filter"
          value={filters.minSimilarity} 
          onChange={handleMinSimilarityChange}
        >
          <option value="0">Any</option>
          <option value="50">50%+</option>
          <option value="70">70%+</option>
          <option value="80">80%+</option>
          <option value="90">90%+</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-filter">Sort By:</label>
        <select 
          id="sort-filter"
          value={filters.sortBy} 
          onChange={handleSortChange}
        >
          <option value="similarity">Similarity Score</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Product Name</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar