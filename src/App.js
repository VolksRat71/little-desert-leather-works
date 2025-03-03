import React from 'react';
import './App.css';
import { WebsiteProvider, useWebsite, colorPalette } from './context/WebsiteContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartNotification from './components/CartNotification';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';

// Import the logo images
import logoImage from './assets/images/logo.png';
import logoWithTextImage from './assets/images/logo-with-text.png';

// Logo component that can be reused across the app
export const Logo = ({ size = 'md', textOnly = false, withText = false, className = '' }) => {
  // Size classes for the image
  const sizeClasses = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20',
    xl: 'h-32',
    '2xl': 'h-40'
  };

  // Text size classes - much larger than before
  const textSizeClasses = {
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl'
  };

  if (textOnly) {
    return (
      <span className={`desert-road-font ${textSizeClasses[size] || 'text-2xl'} font-bold ${className}`}>
        Little Desert Leather Works
      </span>
    );
  }

  // If withText is true, use the logo with text image
  if (withText) {
    return (
      <img
        src={logoWithTextImage}
        alt="Little Desert Leather Works"
        className={`logo-responsive logo-${size} ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img src={logoImage} alt="Logo" className={`${sizeClasses[size]} mr-3`} />
      <span className={`desert-road-font ${textSizeClasses[size] || 'text-2xl'} font-bold ${className.includes('text-shadow') ? 'text-shadow' : ''}`}>
        Little Desert Leather Works
      </span>
    </div>
  );
};

// CSS for animations
const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animation-delay-300 {
    animation-delay: 300ms;
  }

  .animation-delay-600 {
    animation-delay: 600ms;
  }
`;

// Main App Content with Routes
const AppContent = () => {
  const { pageTransition } = useWebsite();
  const location = useLocation();

  return (
    <div className={`font-serif bg-${colorPalette.primary.background} text-${colorPalette.text.primary} min-h-screen`}>
      <style>{globalStyles}</style>
      <Navbar />
      <CartNotification />
      <div className={`pt-16 transition-opacity duration-500 ${pageTransition ? 'opacity-0' : 'opacity-100'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/account" element={<UserPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <WebsiteProvider>
        <AppContent />
      </WebsiteProvider>
    </BrowserRouter>
  );
}

export default App;
