import React from 'react';
import { useWebsite, colorPalette } from '../context/WebsiteContext';

const CartNotification = () => {
  const { showCartNotification, notificationMessage, navigate } = useWebsite();

  if (!showCartNotification) return null;

  return (
    <div className="fixed top-24 md:top-20 right-4 md:right-8 z-50 animate-fadeIn">
      <div className={`bg-${colorPalette.primary.base} text-white p-5 rounded-lg shadow-xl w-72 md:w-80`}>
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
                className={`text-sm px-4 py-2 bg-white text-${colorPalette.primary.base} rounded hover:bg-${colorPalette.primary.lightest} transition-colors duration-300`}
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
