import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../App';
import { useTheme } from '../hooks/useTheme';
import Button from './Button';
import { useCommonStyles } from './common';

// NavLink component with transition effects
const CustomNavLink = ({ to, children, mobile }) => {
  const { navigate } = useWebsite();
  const theme = useTheme();

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        ${mobile ? 'block py-2 text-sm' : 'text-sm lg:text-base'}
        ${isActive ? theme.text('primary.base', 'amber-600') : theme.text('text.light', 'white')}
        ${theme.hoverText('primary.lightest', 'amber-200')}
        transition-colors duration-300 relative whitespace-nowrap font-serif
        after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
        after:bg-${theme.getPalette()?.primary?.base || 'amber-600'} after:transform
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

// Auth Button component for consistent styling
const AuthButton = ({ onClick, children }) => {
  const theme = useTheme();

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const Navbar = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isNavbarVisible,
    navigate,
    getCartItemCount,
    users,
    colorPalette
  } = useWebsite();

  const { currentUser, signOut } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const theme = useTheme();
  const styles = useCommonStyles();

  const cartItemCount = getCartItemCount();
  const [animationKey, setAnimationKey] = useState(0);

  // Track cart count changes for animation
  useEffect(() => {
    // Increment the key to force a re-render with fresh animation
    setAnimationKey(prevKey => prevKey + 1);
  }, [cartItemCount]);

  // Default classes if colorPalette isn't loaded yet
  const bgDarkClass = theme.bg('ui.darkBackground', 'gray-900');

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle sign out
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      setIsAccountMenuOpen(false);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // Get profile image for user
  const getProfileImage = () => {
    if (currentUser && currentUser.profileImage) {
      return currentUser.profileImage;
    }
    // Default profile image with user's initials if no image is available
    const initials = currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U';
    return `https://placehold.co/32x32/amber600/ffffff?text=${initials}`;
  };

  return (
    <nav
      className={`${bgDarkClass} fixed top-0 left-0 right-0 z-50 shadow-md transition-transform duration-300 ${
        isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <Logo size="sm" light />
            </div>

            {/* Main navigation - desktop */}
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-6">
                <CustomNavLink to="/">Home</CustomNavLink>
                <CustomNavLink to="/products">Products</CustomNavLink>
                <CustomNavLink to="/about">About</CustomNavLink>
                <CustomNavLink to="/contact">Contact</CustomNavLink>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center">
            {/* Cart button with item count */}
            <button
              className={`relative px-3 py-2 rounded ${theme.text('text.light', 'white')} ${theme.hoverText('primary.lightest', 'amber-200')} transition-colors duration-300`}
              onClick={() => navigate('/cart')}
              aria-label="Shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>

              {/* Cart item count indicator */}
              {cartItemCount > 0 && (
                <span
                  key={animationKey}
                  className={`absolute top-0 right-0 ${theme.bg('primary.base', 'amber-600')} ${theme.text('text.light', 'white')} text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${cartItemCount === 1 ? 'animate-expand-in' : 'animate-count-bounce'}`}
                >
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Auth links */}
            <div className="hidden md:ml-4 md:flex md:items-center">
              {currentUser ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center space-x-1 focus:outline-none"
                    aria-expanded={isAccountMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className={`w-8 h-8 rounded-full overflow-hidden border ${theme.border('ui.darkBorder', 'gray-800')}`}>
                      <img
                        src={getProfileImage()}
                        alt={currentUser.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <svg className={`w-4 h-4 ${theme.text('text.light', 'white')} transition-transform duration-200 ${isAccountMenuOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {/* Profile dropdown */}
                  {isAccountMenuOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${theme.bg('ui.background', 'white')} ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-scaleIn origin-top-right`}>
                      <div
                        className={`block px-4 py-2 text-sm ${theme.text('text.primary', 'gray-900')} border-b ${theme.border('ui.border', 'gray-200')}`}
                      >
                        <div className="font-medium">{currentUser.name || 'User'}</div>
                        <div className={`text-xs ${theme.text('text.secondary', 'gray-500')} truncate`}>{currentUser.email}</div>
                      </div>

                      {currentUser.role === 'Admin' && (
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            navigate('/admin');
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${theme.text('text.primary', 'gray-900')} ${theme.hoverBg('ui.hover', 'gray-100')}`}
                        >
                          Admin Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          navigate('/account');
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme.text('text.primary', 'gray-900')} ${theme.hoverBg('ui.hover', 'gray-100')}`}
                      >
                        My Account
                      </button>

                      <button
                        onClick={handleSignOut}
                        className={`block w-full text-left px-4 py-2 text-sm ${theme.text('text.primary', 'gray-900')} ${theme.hoverBg('ui.hover', 'gray-100')}`}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AuthButton onClick={() => navigate('/signin')}>
                    Sign In
                  </AuthButton>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${theme.text('text.light', 'white')} ${theme.hoverBg('primary.base', 'amber-600')} focus:outline-none`}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                {isMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden ${bgDarkClass} border-t ${theme.border('ui.darkBorder', 'gray-800')} z-50`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <CustomNavLink to="/" mobile>Home</CustomNavLink>
          <CustomNavLink to="/products" mobile>Products</CustomNavLink>
          <CustomNavLink to="/about" mobile>About</CustomNavLink>
          <CustomNavLink to="/contact" mobile>Contact</CustomNavLink>
        </div>

        {/* Mobile auth menu */}
        <div className={`border-t ${theme.border('ui.darkBorder', 'gray-800')} pt-4 pb-3`}>
          {currentUser ? (
            <div>
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={getProfileImage()}
                    alt={currentUser.name || 'User'}
                  />
                </div>
                <div className="ml-3">
                  <div className={`text-base font-medium ${theme.text('text.light', 'white')}`}>{currentUser.name || 'User'}</div>
                  <div className={`text-sm ${theme.text('text.lightest', 'gray-300')}`}>{currentUser.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {currentUser.role === 'Admin' && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/admin');
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base ${theme.text('text.light', 'white')} ${theme.hoverBg('primary.base', 'amber-600')}`}
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/account');
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base ${theme.text('text.light', 'white')} ${theme.hoverBg('primary.base', 'amber-600')}`}
                >
                  My Account
                </button>
                <button
                  onClick={handleSignOut}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base ${theme.text('text.light', 'white')} ${theme.hoverBg('primary.base', 'amber-600')}`}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col px-5 space-y-2">
              <AuthButton onClick={() => navigate('/signin')}>
                Sign In
              </AuthButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
