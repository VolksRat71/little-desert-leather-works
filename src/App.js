import React from 'react';
import './App.css';
import { WebsiteProvider, useWebsite, colorPalette } from './context/WebsiteContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

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
      <div className={`pt-16 transition-opacity duration-500 ${pageTransition ? 'opacity-0' : 'opacity-100'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
