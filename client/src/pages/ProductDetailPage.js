import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebsite, useDocumentTitle } from '../context/WebsiteContext';
import ProductCard from '../components/ProductCard';
import ImageCarousel from '../components/ImageCarousel';

const ProductDetailPage = () => {
  const { navigate, products, addToCart, colorPalette } = useWebsite();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();

  // Find the product based on the URL parameter
  useEffect(() => {
    if (productId) {
      const foundProduct = products.find(p => p.id === parseInt(productId));
      setProduct(foundProduct);
    }
  }, [productId, products]);

  // Set document title when product is loaded
  useDocumentTitle(product ? product.name : 'Product');

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  return (
    <div className="pb-16 pt-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className={`text-${colorPalette.text.secondary}`}>
            <span
              className="cursor-pointer hover:underline"
              onClick={() => navigate('/')}
            >
              Home
            </span> &gt;
            <span
              className="cursor-pointer hover:underline ml-1"
              onClick={() => navigate('/products')}
            >
              Products
            </span> &gt;
            <span className="ml-1">{product.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images Carousel */}
          <ImageCarousel product={product} />

          {/* Product Details */}
          <div className={`bg-${colorPalette.ui.background} p-6 rounded shadow`}>
            <h1 className={`text-3xl font-bold mb-2 text-${colorPalette.text.primary}`}>{product.name}</h1>
            <p className={`text-2xl text-${colorPalette.text.accent} font-bold mb-4`}>{product.price}</p>
            <p className={`text-${colorPalette.text.secondary} mb-6`}>{product.description}</p>

            <div className="mb-6">
              <h3 className={`text-xl font-semibold mb-2 text-${colorPalette.text.primary}`}>Features</h3>
              <ul className={`list-disc pl-5 text-${colorPalette.text.secondary}`}>
                {product.features.map((feature, index) => (
                  <li key={index} className="mb-1">{feature}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className={`text-xl font-semibold mb-2 text-${colorPalette.text.primary}`}>Care Instructions</h3>
              <p className={`text-${colorPalette.text.secondary}`}>{product.careInstructions}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className={`block mb-2 text-${colorPalette.text.primary} font-semibold`}>Quantity</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className={`w-24 p-2 border border-${colorPalette.ui.border} rounded focus:ring-2 focus:ring-${colorPalette.primary.base} focus:outline-none`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 bg-${colorPalette.primary.base} text-${colorPalette.text.light} py-3 rounded hover:bg-${colorPalette.primary.dark} transition-all duration-300 transform hover:scale-105`}
              >
                Add to Cart
              </button>
              <button
                className={`px-4 py-3 border border-${colorPalette.primary.base} text-${colorPalette.primary.base} rounded hover:bg-${colorPalette.primary.lightest} transition-colors duration-300`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className={`text-2xl font-bold mb-6 text-${colorPalette.text.primary}`}>You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products
              .filter(p => p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
