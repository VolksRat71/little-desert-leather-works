import React, { useState, useRef, useEffect, useCallback } from 'react';

const ImageMagnifier = ({ src, alt, width = '100%', height = 'auto', magnifierSize = 150, zoomLevel = 2.5 }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchActive, setTouchActive] = useState(false); // Track if touch interaction is active
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Detect touch device on component mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Memoize event handlers to ensure they have access to current state
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    setTouchActive(true); // Mark touch as active
    setShowMagnifier(true);

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const imgRect = imgRef.current.getBoundingClientRect();

      // Calculate touch position relative to the image
      const x = touch.clientX - imgRect.left;
      const y = touch.clientY - imgRect.top;

      setMousePosition({ x, y });
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const imgRect = imgRef.current.getBoundingClientRect();

      // Calculate touch position relative to the image
      const x = touch.clientX - imgRect.left;
      const y = touch.clientY - imgRect.top;

      // Check if touch is outside the image boundaries
      if (x < 0 || y < 0 || x > imgRect.width || y > imgRect.height) {
        // Touch is outside image boundaries, close magnifier
        setShowMagnifier(false);
      } else {
        // Touch is inside image, update position and ensure magnifier is shown
        setMousePosition({ x, y });
        if (!showMagnifier) {
          setShowMagnifier(true);
        }
      }
    }
  }, [showMagnifier]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    setShowMagnifier(false);
    setTouchActive(false); // Mark touch as inactive
  }, []);

  // Add non-passive touch event listeners to ensure preventDefault works
  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement || !isTouchDevice) return;

    // Add non-passive event listeners
    imgElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    imgElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    imgElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    imgElement.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // Clean up
    return () => {
      imgElement.removeEventListener('touchstart', handleTouchStart);
      imgElement.removeEventListener('touchmove', handleTouchMove);
      imgElement.removeEventListener('touchend', handleTouchEnd);
      imgElement.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isTouchDevice, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Document-level touch event handler to prevent scrolling
  useEffect(() => {
    if (!isTouchDevice) return;

    const preventScroll = (e) => {
      if (showMagnifier) {
        e.preventDefault();
        return false;
      }
    };

    // Add document-level listener with passive: false
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isTouchDevice, showMagnifier]);

  // Document-level touch event handler to track touches outside the image
  useEffect(() => {
    if (!isTouchDevice) return;

    const handleDocumentTouch = (e) => {
      if (showMagnifier && imgRef.current) {
        const imgRect = imgRef.current.getBoundingClientRect();
        const touch = e.touches[0];

        // Check if touch is outside the image
        if (
          touch.clientX < imgRect.left ||
          touch.clientX > imgRect.right ||
          touch.clientY < imgRect.top ||
          touch.clientY > imgRect.bottom
        ) {
          setShowMagnifier(false);
        }
      }
    };

    // Add document-level touch move listener
    document.addEventListener('touchmove', handleDocumentTouch, { passive: true });

    return () => {
      document.removeEventListener('touchmove', handleDocumentTouch);
    };
  }, [isTouchDevice, showMagnifier]);

  // Enhanced scroll locking that works on iOS and modern browsers
  useEffect(() => {
    if (showMagnifier && isTouchDevice) {
      // Save the current body style
      const originalBodyStyle = window.getComputedStyle(document.body).overflow;
      const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;
      const originalBodyPosition = window.getComputedStyle(document.body).position;
      const originalBodyTop = window.getComputedStyle(document.body).top;

      // Get current scroll position
      const scrollY = window.scrollY;

      // Apply scroll lock to both HTML and BODY elements
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // Restore on cleanup
      return () => {
        document.body.style.overflow = originalBodyStyle;
        document.documentElement.style.overflow = originalHtmlStyle;
        document.body.style.position = originalBodyPosition;
        document.body.style.top = originalBodyTop;
        document.body.style.width = '';

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [showMagnifier, isTouchDevice]);

  // Desktop mouse handlers
  const handleMouseEnter = useCallback(() => {
    // Only activate on desktop and when no touch interaction is happening
    if (!isTouchDevice && !touchActive) {
      setShowMagnifier(true);
    }
  }, [isTouchDevice, touchActive]);

  const handleMouseLeave = useCallback(() => {
    // Only deactivate on desktop and when no touch interaction is happening
    if (!isTouchDevice && !touchActive) {
      setShowMagnifier(false);
    }
  }, [isTouchDevice, touchActive]);

  const handleMouseMove = useCallback((e) => {
    // Only update position on desktop and when no touch interaction is happening
    if (!isTouchDevice && !touchActive) {
      // Get the position of the image element
      const imgRect = imgRef.current.getBoundingClientRect();

      // Calculate the mouse position relative to the image
      const x = e.clientX - imgRect.left;
      const y = e.clientY - imgRect.top;

      setMousePosition({ x, y });
    }
  }, [isTouchDevice, touchActive]);

  // Prevent context menu (right-click menu)
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Calculate magnifier position without constraining it to image boundaries
  const getMagnifierPosition = () => {
    if (!imgRef.current) return { left: 0, top: 0 };

    // On touch devices, always position the magnifier above the touch point
    if (isTouchDevice) {
      // Center horizontally on touch point without constraints
      const left = mousePosition.x - magnifierSize / 2;

      // Always position above the finger with 50px gap without vertical constraints
      const top = mousePosition.y - magnifierSize - 50;

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
      ref={containerRef}
      className="relative"
      style={{
        width,
        height,
        touchAction: isTouchDevice ? 'none' : 'auto'
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-auto rounded select-none"
        style={{
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          userSelect: 'none',
          pointerEvents: 'auto', // Allow pointer events always for desktop hover
          touchAction: 'none'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        draggable="false"
        onContextMenu={handleContextMenu}
      />

      {showMagnifier && (
        <div
          className="fixed border border-gray-300 rounded-full shadow-lg pointer-events-none"
          style={{
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            left: `${magnifierPosition.left + imgRef.current.getBoundingClientRect().left}px`,
            top: `${magnifierPosition.top + imgRef.current.getBoundingClientRect().top}px`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
            zIndex: 100000 // Increased z-index to ensure it renders above navbar
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;
