import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';
import { useWebsite, colorPalette, useDocumentTitle } from '../context/WebsiteContext';

const HomePage = () => {
  const { products, testimonials, navigate, artisan } = useWebsite();

  // Set document title for the home page
  useDocumentTitle('Home');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className={`py-16 px-4 bg-${colorPalette.ui.lightBackground}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold mb-2 text-${colorPalette.text.dark}`}>Featured Products</h2>
          <div className={`w-24 h-1 bg-${colorPalette.primary.base} mb-8`}></div>
          <p className={`mb-12 text-${colorPalette.text.medium} max-w-2xl`}>
            Each piece is handcrafted with the finest materials, designed to last a lifetime and develop a unique patina that tells your story.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className={`inline-block px-6 py-3 bg-${colorPalette.primary.base} text-white font-medium rounded-md hover:bg-${colorPalette.primary.dark} transition-colors duration-300`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/products');
              }}
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Artisan Section */}
      <section className={`py-16 px-4 bg-${colorPalette.secondary.lightest}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className={`text-3xl md:text-4xl font-bold mb-2 text-${colorPalette.text.dark}`}>Meet the Artisan</h2>
              <div className={`w-24 h-1 bg-${colorPalette.primary.base} mb-8`}></div>
              <h3 className={`text-xl font-semibold mb-4 text-${colorPalette.text.medium}`}>{artisan.name} - {artisan.title}</h3>
              <p className={`mb-6 text-${colorPalette.text.medium}`}>{artisan.bio}</p>
              <Link
                to="/about"
                className={`inline-block px-6 py-3 bg-${colorPalette.primary.base} text-white font-medium rounded-md hover:bg-${colorPalette.primary.dark} transition-colors duration-300`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                }}
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-16 px-4 bg-${colorPalette.ui.lightBackground}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold mb-2 text-${colorPalette.text.dark}`}>What Our Customers Say</h2>
          <div className={`w-24 h-1 bg-${colorPalette.primary.base} mb-8`}></div>
          <p className={`mb-12 text-${colorPalette.text.medium} max-w-2xl`}>
            Don't just take our word for it. Here's what customers have to say about our handcrafted leather goods.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-16 px-4 bg-${colorPalette.primary.dark} text-white text-center`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Own a Piece of Handcrafted Excellence?</h2>
          <p className="mb-8 text-lg opacity-90">
            Each item is made with dedication to quality and craftsmanship. Start your journey with Little Desert Leather Works today.
          </p>
          <Link
            to="/contact"
            className={`inline-block px-8 py-4 bg-white text-${colorPalette.primary.dark} font-bold rounded-md hover:bg-${colorPalette.secondary.lightest} transition-colors duration-300`}
            onClick={(e) => {
              e.preventDefault();
              navigate('/contact');
            }}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
