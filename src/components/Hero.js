import React, { useEffect, useState } from 'react';
import { Logo } from '../App';
import { useTheme } from '../hooks/useTheme';
import Button from './Button';

const Hero = () => {
  const theme = useTheme();
  const [animationApplied, setAnimationApplied] = useState(false);

  useEffect(() => {
    setAnimationApplied(true);
  }, []);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      const featuredSection = document.querySelector('section');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={`${theme.bg('primary.lightest')} py-16 md:py-24 px-4`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center flex flex-col items-center justify-center">
          <div className={`flex justify-center mb-8 ${animationApplied ? 'animate-fadeIn' : ''}`}>
            <div className="flex justify-center w-full max-w-2xl">
              <Logo withText size="xl" className="mx-auto max-w-full" />
            </div>
          </div>
          <p className={`text-xl md:text-2xl ${theme.text('text.secondary')} mb-8 max-w-2xl mx-auto ${animationApplied ? 'animate-fadeIn animation-delay-300' : ''}`}>
            Artisanal pieces made to last a lifetime, from our workshop to your hands
          </p>
          <div className={`${animationApplied ? 'animate-fadeIn animation-delay-500' : ''}`}>
            <Button
              variant="primary"
              size="large"
              onClick={scrollToProducts}
              className="transform hover:-translate-y-1"
            >
              Explore Collection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
