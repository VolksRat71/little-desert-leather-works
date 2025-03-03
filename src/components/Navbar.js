import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useWebsite, colorPalette } from '../context/WebsiteContext';

// NavLink component with transition effects
const CustomNavLink = ({ to, children, mobile }) => {
  const { navigate, currentRoute } = useWebsite();

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        ${mobile ? 'block py-2 ' : ''}
        ${isActive ? `text-${colorPalette.primary.base}` : `text-${colorPalette.text.light}`}
        hover:text-${colorPalette.primary.lightest}
        transition-colors duration-300 relative
        after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
        after:bg-${colorPalette.primary.base} after:transform
        ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'}
        after:transition-transform after:duration-300 after:origin-left
        hover:after:scale-x-100
      `}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </NavLink>
  );
};

const Navbar = () => {
  const { isMenuOpen, setIsMenuOpen, isNavbarVisible, navigate, getCartItemCount } = useWebsite();
  const cartItemCount = getCartItemCount();

  return (
    <nav className={`fixed w-full bg-${colorPalette.ui.darkBackground} text-${colorPalette.text.light} z-50 transition-transform duration-300 ${isNavbarVisible ? 'transform-none' : '-translate-y-full'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span
              className={`text-2xl font-bold cursor-pointer hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
              onClick={() => navigate('/')}
            >
              Little Desert Leather Works
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* Cart Icon for Mobile */}
            <button
              onClick={() => navigate('/cart')}
              className={`mr-4 relative text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className={`absolute -top-2 -right-2 bg-${colorPalette.primary.base} text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center`}>
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <CustomNavLink to="/">Home</CustomNavLink>
            <CustomNavLink to="/products">Products</CustomNavLink>
            <CustomNavLink to="/about">About</CustomNavLink>
            <CustomNavLink to="/contact">Contact</CustomNavLink>
            <CustomNavLink to="/admin">Admin</CustomNavLink>

            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className={`relative text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className={`absolute -top-2 -right-2 bg-${colorPalette.primary.base} text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center`}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-60 py-4' : 'max-h-0'}`}>
          <CustomNavLink to="/" mobile>Home</CustomNavLink>
          <CustomNavLink to="/products" mobile>Products</CustomNavLink>
          <CustomNavLink to="/about" mobile>About</CustomNavLink>
          <CustomNavLink to="/contact" mobile>Contact</CustomNavLink>
          <CustomNavLink to="/admin" mobile>Admin</CustomNavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
