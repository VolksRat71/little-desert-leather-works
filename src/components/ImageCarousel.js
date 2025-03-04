import React, { useState, useEffect } from 'react';
import ImageMagnifier from '../components/ImageMagnifier';
import { colorPalette } from '../context/WebsiteContext';

const ImageCarousel = ({ product }) => {
  const { images } = product;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset current index when product changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [product]);

  const handleSelectImage = (index) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      {/* Main image container */}
      <div className="w-full h-96 rounded shadow bg-gray-100 relative">
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 flex justify-center items-center"
            style={{
              opacity: currentIndex === index ? 1 : 0,
              visibility: currentIndex === index ? 'visible' : 'hidden',
              zIndex: currentIndex === index ? 2 : 1,
              transition: 'opacity 0.4s ease'
            }}
          >
            <ImageMagnifier
              src={image}
              alt={`Product image ${index + 1}`}
              magnifierSize={180}
              zoomLevel={6}
            />
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded overflow-hidden border-2 transition-all duration-400 ${currentIndex === index ? `border-${colorPalette.primary.base}` : 'border-transparent'}`}
            onClick={() => handleSelectImage(index)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-16 h-16 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
