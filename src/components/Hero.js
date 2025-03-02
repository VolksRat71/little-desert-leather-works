import React from 'react';
import { useWebsite, colorPalette } from '../context/WebsiteContext';

const Hero = () => {
  const { navigate } = useWebsite();

  return (
    <div className={`bg-${colorPalette.primary.lightest} py-24 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold text-${colorPalette.text.primary} mb-4 animate-fadeIn`}>
            Handcrafted Leather Goods
          </h1>
          <p className={`text-xl md:text-2xl text-${colorPalette.text.secondary} mb-8 animate-fadeIn animation-delay-300`}>
            Artisanal pieces made to last a lifetime, from our workshop to your hands
          </p>
          <button
            className={`bg-${colorPalette.primary.base} text-white px-6 py-3 rounded-md hover:bg-${colorPalette.primary.dark} transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn animation-delay-600`}
            onClick={() => {
              const productsSection = document.getElementById('products');
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                const featuredSection = document.querySelector('section');
                if (featuredSection) {
                  featuredSection.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          >
            Explore Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
