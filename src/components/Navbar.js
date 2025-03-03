import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useWebsite, colorPalette } from '../context/WebsiteContext';
import { Logo } from '../App';

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
  const { isMenuOpen, setIsMenuOpen, isNavbarVisible, navigate, getCartItemCount, users } = useWebsite();
  const cartItemCount = getCartItemCount();

  // For demo purposes, assuming the first user is currently logged in
  const currentUser = users && users.length > 0 ? users[0] : null;
  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'Admin';

  return (
    <nav className={`fixed w-full bg-${colorPalette.ui.darkBackground} text-${colorPalette.text.light} z-50 transition-transform duration-300 ${isNavbarVisible ? 'transform-none' : '-translate-y-full'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-5">
          <div className="flex items-center">
            <div onClick={() => navigate('/')} className="cursor-pointer">
              <Logo size="md" className={`hover:text-${colorPalette.primary.lightest} transition-colors duration-300 text-shadow`} />
            </div>
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

            {/* User Icon for Mobile */}
            {isLoggedIn && (
              <button
                onClick={() => navigate('/account')}
                className={`mr-4 relative text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}

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
            {isAdmin && <CustomNavLink to="/admin">Admin</CustomNavLink>}

            {/* User Account */}
            {isLoggedIn && (
              <div className="relative group">
                <button
                  onClick={() => navigate('/account')}
                  className={`flex items-center text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
                >
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{currentUser?.name?.split(' ')[0] || 'Account'}</span>
                </button>
              </div>
            )}

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
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className={`bg-${colorPalette.ui.darkBackground} py-2 px-4 space-y-2 transition-all duration-300`}>
          <CustomNavLink to="/" mobile>Home</CustomNavLink>
          <CustomNavLink to="/products" mobile>Products</CustomNavLink>
          <CustomNavLink to="/about" mobile>About</CustomNavLink>
          <CustomNavLink to="/contact" mobile>Contact</CustomNavLink>
          {isAdmin && <CustomNavLink to="/admin" mobile>Admin</CustomNavLink>}
          {isLoggedIn && <CustomNavLink to="/account" mobile>My Account</CustomNavLink>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
