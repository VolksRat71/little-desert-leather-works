import React from 'react';
import { useWebsite } from '../context/WebsiteContext';

const CartNotification = () => {
  const { showCartNotification, notificationMessage, navigate, colorPalette, isNavbarVisible } = useWebsite();

  if (!showCartNotification) return null;

  // Default color classes in case colorPalette is not loaded yet
  const bgClass = colorPalette ? `bg-${colorPalette.primary.base}` : 'bg-amber-600';
  const textClass = colorPalette ? `text-${colorPalette.primary.base}` : 'text-amber-600';
  const hoverClass = colorPalette ? `hover:bg-${colorPalette.primary.lightest}` : 'hover:bg-amber-100';

  // Calculate position based on navbar visibility
  // When navbar is hidden, keep notification at top=0 instead of off-screen
  const positionClass = isNavbarVisible
    ? "fixed top-16 md:top-20"
    : "fixed top-6 md:top-8";

  return (
    <div className={`${positionClass} right-4 md:right-8 z-50 animate-fadeIn transition-all duration-300`}
         style={{ transitionProperty: 'transform, opacity, top' }}>
      <div className={`${bgClass} text-white p-5 rounded-lg shadow-xl w-72 md:w-80`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium break-words">{notificationMessage}</p>
            <div className="mt-3">
              <button
                onClick={() => navigate('/cart')}
                className={`text-sm px-4 py-2 bg-white ${textClass} rounded ${hoverClass} transition-colors duration-300`}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
