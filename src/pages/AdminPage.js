import React, { useState } from 'react';
import { useWebsite } from '../context/WebsiteContext';
// Import all section components
import ProductsSection from '../components/admin/ProductsSection';
import AboutSection from '../components/admin/AboutSection';
import ContactSection from '../components/admin/ContactSection';
import TestimonialsSection from '../components/admin/TestimonialsSection';
import ColorsSection from '../components/admin/ColorsSection';
import OrdersSection from '../components/admin/OrdersSection';
import UsersSection from '../components/admin/UsersSection';
import MarketingSection from '../components/admin/MarketingSection';

const AdminPage = () => {
  const { colorPalette } = useWebsite();
  const [activeTab, setActiveTab] = useState('products');
  const [previousTab, setPreviousTab] = useState('');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  // Admin sections
  const tabs = [
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'colors', label: 'Theme Colors' },
    { id: 'orders', label: 'Orders' },
    { id: 'users', label: 'Users' },
    { id: 'marketing', label: 'Marketing' },
  ];

  // Handle tab changes with animation
  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;

    setPreviousTab(activeTab);
    setIsTabTransitioning(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setActiveTab(tabId);
      // Wait a bit then start the entrance animation
      setTimeout(() => {
        setIsTabTransitioning(false);
      }, 50);
    }, 200);
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-${colorPalette.text.primary}`}>
            Website Administration
          </h1>
          <p className={`text-${colorPalette.text.secondary} mt-2`}>
            Manage your website content, products, and settings
          </p>
        </div>

        {/* Admin Navigation */}
        <div className="flex flex-wrap mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 mr-2 transition-all duration-300 ease-in-out relative ${
                activeTab === tab.id
                  ? `bg-${colorPalette.primary.base} text-white`
                  : `text-${colorPalette.text.secondary} hover:text-${colorPalette.primary.base}`
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-white transform transition-transform duration-300 scale-x-100"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content Sections with Animation */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
          <div className={`transition-all duration-200 ease-in-out ${isTabTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            {activeTab === 'products' && <ProductsSection />}
            {activeTab === 'about' && <AboutSection />}
            {activeTab === 'contact' && <ContactSection />}
            {activeTab === 'testimonials' && <TestimonialsSection />}
            {activeTab === 'colors' && <ColorsSection />}
            {activeTab === 'orders' && <OrdersSection />}
            {activeTab === 'users' && <UsersSection />}
            {activeTab === 'marketing' && <MarketingSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
