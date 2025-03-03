import React, { useState, useEffect } from 'react';
import { useWebsite, colorPalette } from '../context/WebsiteContext';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const { products } = useWebsite();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    sortBy: 'default',
  });

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sort (by ID)
        result.sort((a, b) => a.id - b.id);
    }

    setFilteredProducts(result);
  }, [products, filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, searchTerm: e.target.value });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sortBy: e.target.value });
  };

  return (
    <div className="pb-16 pt-16 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 text-${colorPalette.text.primary}`}>Our Handcrafted Products</h1>

        <div className="mb-8 p-4 bg-white rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className={`block mb-2 text-${colorPalette.text.secondary}`}>Search Products</label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or description..."
                className={`w-full p-2 border border-${colorPalette.ui.border} rounded focus:ring-2 focus:ring-${colorPalette.primary.base} focus:outline-none`}
                value={filters.searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className={`block mb-2 text-${colorPalette.text.secondary}`}>Sort By</label>
              <select
                id="sort"
                className={`w-full p-2 border border-${colorPalette.ui.border} rounded focus:ring-2 focus:ring-${colorPalette.primary.base} focus:outline-none`}
                value={filters.sortBy}
                onChange={handleSortChange}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className={`text-${colorPalette.text.secondary}`}>Showing {filteredProducts.length} products</p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={`text-center p-8 bg-white rounded shadow text-${colorPalette.text.secondary}`}>
            <p>No products found matching your criteria.</p>
            <button
              className={`mt-4 px-4 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.dark}`}
              onClick={() => setFilters({ searchTerm: '', sortBy: 'default' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
