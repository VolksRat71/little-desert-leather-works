import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../App';

// NavLink component with transition effects
const CustomNavLink = ({ to, children, mobile }) => {
  const { navigate, colorPalette } = useWebsite();

  // Default classes if colorPalette isn't loaded yet
  const primaryBaseClass = colorPalette?.primary?.base ? `text-${colorPalette.primary.base}` : 'text-amber-600';
  const textLightClass = colorPalette?.text?.light ? `text-${colorPalette.text.light}` : 'text-white';
  const primaryLightestClass = colorPalette?.primary?.lightest ? `hover:text-${colorPalette.primary.lightest}` : 'hover:text-amber-200';
  const primaryBaseAccentClass = colorPalette?.primary?.base ? `after:bg-${colorPalette.primary.base}` : 'after:bg-amber-600';

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        ${mobile ? 'block py-2 text-sm' : 'text-sm lg:text-base'}
        ${isActive ? primaryBaseClass : textLightClass}
        ${primaryLightestClass}
        transition-colors duration-300 relative whitespace-nowrap font-serif
        after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
        ${primaryBaseAccentClass} after:transform
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
  const { colorPalette } = useWebsite();

  // Get button styling from colorPalette or use defaults
  const bgClass = colorPalette?.primary?.base ? `bg-${colorPalette.primary.base}` : 'bg-amber-600';
  const bgHoverClass = colorPalette?.primary?.dark ? `hover:bg-${colorPalette.primary.dark}` : 'hover:bg-amber-700';

  return (
    <button
      onClick={onClick}
      className={`${bgClass} text-white px-4 py-1.5 rounded-md ${bgHoverClass} transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-serif shadow-sm`}
    >
      {children}
    </button>
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

  const cartItemCount = getCartItemCount();

  // Default classes if colorPalette isn't loaded yet
  const bgDarkClass = colorPalette?.ui?.darkBackground ? `bg-${colorPalette.ui.darkBackground}` : 'bg-gray-900';
  const textLightClass = colorPalette?.text?.light ? `text-${colorPalette.text.light}` : 'text-white';
  const primaryLightestClass = colorPalette?.primary?.lightest ? `hover:text-${colorPalette.primary.lightest}` : 'hover:text-amber-200';
  const primaryBaseClass = colorPalette?.primary?.base ? `bg-${colorPalette.primary.base}` : 'bg-amber-600';
  const darkBorderClass = colorPalette?.ui?.darkBorder ? `border-${colorPalette.ui.darkBorder}` : 'border-gray-800';

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
    <nav className={`fixed w-full ${bgDarkClass} ${textLightClass} z-50 transition-transform duration-300 ${isNavbarVisible ? 'transform-none' : '-translate-y-full'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <div onClick={() => navigate('/')} className="cursor-pointer">
              {/* Use logo with text on smaller screens, and regular logo on larger screens */}
              <div className="block lg:hidden">
                <Logo size="sm" withText={true} light={true} className={`${primaryLightestClass} transition-colors duration-300 text-shadow`} />
              </div>
              <div className="hidden lg:block">
                <Logo size="md" className={`${primaryLightestClass} transition-colors duration-300 text-shadow`} />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            {/* Cart Icon for Mobile */}
            <button
              onClick={() => navigate('/cart')}
              className={`mr-4 relative ${textLightClass} ${primaryLightestClass} transition-colors duration-300`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <div className="absolute" style={{ top: '-8px', right: '-8px' }}>
                  <span
                    key={cartItemCount} // Force re-render on count change to restart animation
                    className={`${primaryBaseClass} text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center
                    ${cartItemCount === 1 ? 'animate-expand-in' : 'animate-count-bounce'}`}
                  >
                    {cartItemCount}
                  </span>
                </div>
              )}
            </button>

            {/* User Icon for Mobile */}
            {currentUser && (
              <button
                onClick={() => navigate('/account')}
                className={`mr-4 relative ${textLightClass} ${primaryLightestClass} transition-colors duration-300`}
              >
                <img
                  src={getProfileImage()}
                  alt={currentUser.name || 'User'}
                  className="h-8 w-8 rounded-full object-cover border-2 border-amber-600"
                />
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${textLightClass} ${primaryLightestClass} transition-colors duration-300`}
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
          <div className="hidden lg:flex items-center space-x-5 whitespace-nowrap font-serif">
            <CustomNavLink to="/">Home</CustomNavLink>
            <CustomNavLink to="/products">Products</CustomNavLink>
            <CustomNavLink to="/about">About</CustomNavLink>
            <CustomNavLink to="/contact">Contact</CustomNavLink>

            {/* Authentication Links - Desktop */}
            {currentUser ? (
              <>
                {currentUser.role === 'Admin' && <CustomNavLink to="/admin">Admin</CustomNavLink>}

                {/* User Account with Popover */}
                <div className="relative group" ref={accountMenuRef}>
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className={`flex items-center ${textLightClass} ${primaryLightestClass} transition-colors duration-300 text-sm lg:text-base relative`}
                  >
                    <img
                      src={getProfileImage()}
                      alt={currentUser.name || 'User'}
                      className="h-8 w-8 rounded-full object-cover border-2 border-amber-600 mr-2"
                    />
                    <svg className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Account Dropdown Menu */}
                  <div
                    className={`absolute right-0 mt-2 w-48 ${bgDarkClass} border border-${darkBorderClass} rounded-md shadow-lg overflow-hidden transform origin-top-right transition-all duration-200 ease-in-out z-50
                    ${isAccountMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          navigate('/account');
                        }}
                        className={`w-full text-left block px-4 py-2 text-sm ${textLightClass} ${primaryLightestClass} transition-colors duration-300`}
                      >
                        My Account
                      </button>
                      <div className={`border-t border-${darkBorderClass} my-1`}></div>
                      <button
                        onClick={handleSignOut}
                        className={`w-full text-left block px-4 py-2 text-sm ${textLightClass} ${primaryLightestClass} transition-colors duration-300`}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signin')}
                  className={`${textLightClass} ${primaryLightestClass} transition-colors duration-300 text-sm lg:text-base font-serif`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className={`${textLightClass} ${primaryLightestClass} transition-colors duration-300 text-sm lg:text-base font-serif`}
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className={`relative ${textLightClass} ${primaryLightestClass} transition-colors duration-300`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <div className="absolute" style={{ top: '-8px', right: '-8px' }}>
                  <span
                    key={cartItemCount} // Force re-render on count change to restart animation
                    className={`${primaryBaseClass} text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center
                    ${cartItemCount === 1 ? 'animate-expand-in' : 'animate-count-bounce'}`}
                  >
                    {cartItemCount}
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className="lg:hidden">
        <div
          className={`mobile-menu ${bgDarkClass} px-6 space-y-3 border-${darkBorderClass}
          ${isMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'}`}
        >
          <CustomNavLink to="/" mobile>Home</CustomNavLink>
          <CustomNavLink to="/products" mobile>Products</CustomNavLink>
          <CustomNavLink to="/about" mobile>About</CustomNavLink>
          <CustomNavLink to="/contact" mobile>Contact</CustomNavLink>

          {/* Auth Links - Mobile */}
          {currentUser ? (
            <>
              <CustomNavLink to="/account" mobile>My Account</CustomNavLink>
              {currentUser.role === 'Admin' &&
                <CustomNavLink to="/admin" mobile>Admin</CustomNavLink>
              }
              <button
                onClick={handleSignOut}
                className={`block py-2 text-sm ${textLightClass} ${primaryLightestClass} text-left w-full transition-colors duration-300 font-serif`}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <CustomNavLink to="/signin" mobile>Sign In</CustomNavLink>
              <CustomNavLink to="/signup" mobile>Sign Up</CustomNavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
