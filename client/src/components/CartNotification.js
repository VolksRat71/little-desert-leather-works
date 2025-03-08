import React, { useEffect, useState } from 'react';
import { useWebsite } from '../context/WebsiteContext';
import { useTheme } from '../hooks/useTheme';

const CartNotification = () => {
  const { showCartNotification, notificationMessage, navigate, isNavbarVisible } = useWebsite();
  const [animation, setAnimation] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (showCartNotification) {
      setAnimation('animate-slideInRight');
      const timer = setTimeout(() => {
        setAnimation('animate-slideInRight animate-fadeOut');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCartNotification]);

  if (!showCartNotification) return null;

  return (
    <div
      className={`fixed z-50 ${isNavbarVisible ? 'top-20' : 'top-2'} right-2 md:right-4 max-w-sm transition-all duration-300 transform ${animation}`}
    >
      <div className={`${theme.bg('primary.base', 'amber-600')} ${theme.text('text.light', 'white')} rounded-lg shadow-lg p-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{notificationMessage}</span>
        </div>

        <button
          onClick={() => navigate('/cart')}
          className={`ml-5 px-4 py-1.5 ${theme.bg('text.light', 'white')} ${theme.text('primary.base', 'amber-600')} rounded ${theme.hoverBg('primary.lightest', 'amber-100')} transition-colors duration-200`}
        >
          View Cart
        </button>
      </div>
    </div>
  );
};

export default CartNotification;
