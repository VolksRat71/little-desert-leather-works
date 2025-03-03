import React, { useState, useRef, useEffect } from 'react';

const ImageMagnifier = ({ src, alt, width = '100%', height = 'auto', magnifierSize = 150, zoomLevel = 2.5 }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const imgRef = useRef(null);

  // Detect touch device on component mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setShowMagnifier(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setShowMagnifier(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isTouchDevice) {
      // Get the position of the image element
      const imgRect = imgRef.current.getBoundingClientRect();

      // Calculate the mouse position relative to the image
      const x = e.clientX - imgRect.left;
      const y = e.clientY - imgRect.top;

      setMousePosition({ x, y });
    }
  };

  // Handle touch events for mobile devices
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    setShowMagnifier(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const imgRect = imgRef.current.getBoundingClientRect();

      // Calculate touch position relative to the image
      const x = touch.clientX - imgRect.left;
      const y = touch.clientY - imgRect.top;

      setMousePosition({ x, y });
    }
  };

  const handleTouchEnd = () => {
    setShowMagnifier(false);
  };

  // Calculate magnifier position without constraining it to image boundaries
  const getMagnifierPosition = () => {
    if (!imgRef.current) return { left: 0, top: 0 };

    const imgRect = imgRef.current.getBoundingClientRect();

    // On touch devices, position the magnifier above the touch point
    if (isTouchDevice) {
      // Calculate position above the finger
      const left = mousePosition.x - magnifierSize / 2;
      // Position above the finger with 20px gap
      const top = mousePosition.y - magnifierSize - 20;

      // If the magnifier would go above the image, position it below the finger instead
      if (top < 0) {
        return {
          left,
          top: mousePosition.y + 20 // 20px below the touch point
        };
      }

      return { left, top };
    } else {
      // For desktop: center on mouse position
      const left = mousePosition.x - magnifierSize / 2;
      const top = mousePosition.y - magnifierSize / 2;
      return { left, top };
    }
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
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
