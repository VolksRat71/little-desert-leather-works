import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';
import { useWebsite, useDocumentTitle } from '../context/WebsiteContext';

const HomePage = () => {
  const { products, testimonials, navigate, artisan, colorPalette, sectionsVisibility } = useWebsite();

  // Set document title for the home page
  useDocumentTitle('Home');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Default classes if colorPalette isn't loaded yet
  const bgLightClass = colorPalette?.ui?.lightBackground ? `bg-${colorPalette.ui.lightBackground}` : 'bg-stone-50';
  const textDarkClass = colorPalette?.text?.dark ? `text-${colorPalette.text.dark}` : 'text-gray-900';
  const accentClass = colorPalette?.primary?.base ? `bg-${colorPalette.primary.base}` : 'bg-amber-600';
  const textMediumClass = colorPalette?.text?.medium ? `text-${colorPalette.text.medium}` : 'text-gray-700';
  const bgPrimaryClass = colorPalette?.primary?.base ? `bg-${colorPalette.primary.base}` : 'bg-amber-600';
  const bgPrimaryHoverClass = colorPalette?.primary?.dark ? `hover:bg-${colorPalette.primary.dark}` : 'hover:bg-amber-700';
  const bgSecondaryClass = colorPalette?.secondary?.base ? `bg-${colorPalette.secondary.base}` : 'bg-amber-700';
  const bgSecondaryLightClass = colorPalette?.secondary?.light ? `bg-${colorPalette.secondary.light}` : 'bg-amber-600';
  const textLightClass = colorPalette?.text?.light ? `text-${colorPalette.text.light}` : 'text-white';
  const borderClass = colorPalette?.ui?.border ? `border-${colorPalette.ui.border}` : 'border-amber-600';
  const bgPrimaryLightestClass = colorPalette?.primary?.lightest ? `bg-${colorPalette.primary.lightest}` : 'bg-amber-100';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className={`py-16 px-4 ${bgLightClass}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${textDarkClass}`}>Featured Products</h2>
          <div className={`w-24 h-1 ${accentClass} mb-8`}></div>
          <p className={`mb-12 ${textMediumClass} max-w-2xl`}>
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
              className={`inline-block px-6 py-3 ${bgPrimaryClass} text-white font-medium rounded-md ${bgPrimaryHoverClass} transition-colors duration-300`}
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

      {/* Testimonials Section */}
      {sectionsVisibility.testimonials && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${textDarkClass}`}>What Our Customers Say</h2>
            <div className={`w-24 h-1 ${accentClass} mb-8`}></div>
            <p className={`mb-12 ${textMediumClass} max-w-2xl`}>
              We take pride in creating products that our customers love. Here's what some of them have to say about their Little Desert Leather Works purchases.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About the Artisan Section */}
      {sectionsVisibility.about && artisan && (
        <section className={`py-16 px-4 ${bgPrimaryLightestClass}`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:space-x-12">
              <div className="w-full md:w-1/3 mb-8 md:mb-0">
                <img
                  src={artisan.image}
                  alt={`${artisan.name}, ${artisan.title}`}
                  className={`w-full h-auto rounded-lg shadow-xl border-4 ${borderClass}`}
                />
              </div>
              <div className="w-full md:w-2/3">
                <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${textDarkClass}`}>Meet the Artisan</h2>
                <div className={`w-24 h-1 ${accentClass} mb-8`}></div>
                <h3 className={`text-xl mb-4 ${textMediumClass}`}>{artisan.name}, {artisan.title}</h3>
                <p className={`mb-6 ${textMediumClass}`}>
                  {artisan.bio.split('\n\n')[0]}
                </p>
                <div className="mb-6">
                  <h4 className={`font-bold mb-2 ${textDarkClass}`}>Our Philosophy</h4>
                  <p className={textMediumClass}>{artisan.philosophy}</p>
                </div>
                <button
                  onClick={() => navigate('/about')}
                  className={`px-6 py-3 ${bgSecondaryClass} ${textLightClass} font-medium rounded-md hover:${bgSecondaryLightClass} transition-colors duration-300`}
                >
                  Learn More About Us
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className={`py-16 px-4 ${bgPrimaryClass} ${textLightClass}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your perfect leather companion?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Browse our collection of handcrafted leather goods and find something that will last a lifetime.
          </p>
          <button
            onClick={() => navigate('/products')}
            className={`px-8 py-4 bg-white ${textDarkClass} font-medium text-lg rounded-md hover:${bgPrimaryLightestClass} transition-colors duration-300`}
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
