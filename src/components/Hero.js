import React, { useEffect, useState } from 'react';
import { useWebsite, colorPalette } from '../context/WebsiteContext';
import { Logo } from '../App';

const Hero = () => {
  const { navigate } = useWebsite();
  const [animationApplied, setAnimationApplied] = useState(false);

  useEffect(() => {
    setAnimationApplied(true);
  }, []);

  return (
    <div className={`bg-${colorPalette.primary.lightest} py-16 md:py-24 px-4`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <div className={`flex justify-center mb-8 ${animationApplied ? 'animate-fadeIn' : ''}`}>
            <div className="w-full max-w-xs md:max-w-sm">
              <Logo withText size="lg" className="w-full" />
            </div>
          </div>
          <p className={`text-xl md:text-2xl text-${colorPalette.text.secondary} mb-8 ${animationApplied ? 'animate-fadeIn animation-delay-300' : ''}`}>
            Artisanal pieces made to last a lifetime, from our workshop to your hands
          </p>
          <button
            className={`bg-${colorPalette.primary.base} text-white px-6 py-3 rounded-md hover:bg-${colorPalette.primary.dark} transition-all duration-300 transform hover:-translate-y-1 ${animationApplied ? 'animate-fadeIn animation-delay-500' : ''}`}
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
