import React, { useState, useRef, useEffect } from 'react';

const ImageMagnifier = ({ src, alt, width = '100%', height = 'auto', magnifierSize = 150, zoomLevel = 2.5 }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e) => {
    // Get the position of the image element
    const imgRect = imgRef.current.getBoundingClientRect();

    // Calculate the mouse position relative to the image
    const x = e.clientX - imgRect.left;
    const y = e.clientY - imgRect.top;

    setMousePosition({ x, y });
  };

  // Calculate magnifier position without constraining it to image boundaries
  const getMagnifierPosition = () => {
    if (!imgRef.current) return { left: 0, top: 0 };

    // Simply position the magnifier centered on the mouse
    const left = mousePosition.x - magnifierSize / 2;
    const top = mousePosition.y - magnifierSize / 2;

    return { left, top };
  };

  // Calculate the background position for the zoomed image
  const getBackgroundPosition = () => {
    if (!imgRef.current) return { x: 0, y: 0 };

    const imgRect = imgRef.current.getBoundingClientRect();

    // Calculate the percentage position of the mouse within the image
    const x = (mousePosition.x / imgRect.width) * 100;
    const y = (mousePosition.y / imgRect.height) * 100;

    return { x, y };
  };

  const magnifierPosition = getMagnifierPosition();
  const backgroundPosition = getBackgroundPosition();

  return (
    <div
      className="relative cursor-crosshair overflow-visible"
      style={{ width, height }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-auto rounded"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      />

      {showMagnifier && (
        <div
          className="absolute border border-gray-300 rounded-full shadow-lg pointer-events-none z-10 overflow-hidden"
          style={{
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            left: `${magnifierPosition.left}px`,
            top: `${magnifierPosition.top}px`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;
