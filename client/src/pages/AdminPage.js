import React, { useState } from 'react';
import { useWebsite, colorPalette, useDocumentTitle } from '../context/WebsiteContext';
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
  const [activeCategory, setActiveCategory] = useState('content');
  const [activeTab, setActiveTab] = useState('products');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  // Admin categories and their tabs
  const categories = [
    {
      id: 'content',
      label: 'Content',
      tabs: [
        { id: 'products', label: 'Products' },
        { id: 'about', label: 'About' },
        { id: 'contact', label: 'Contact' },
        { id: 'testimonials', label: 'Testimonials' },
      ]
    },
    {
      id: 'commerce',
      label: 'Commerce',
      tabs: [
        { id: 'orders', label: 'Orders' },
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      tabs: [
        { id: 'marketing', label: 'Marketing Hub' },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      tabs: [
        { id: 'colors', label: 'Theme Colors' },
        { id: 'users', label: 'Users' },
      ]
    }
  ];

  // Find current category based on active tab
  const getCurrentCategory = (tabId) => {
    for (const category of categories) {
      if (category.tabs.some(tab => tab.id === tabId)) {
        return category.id;
      }
    }
    return 'content'; // Default
  };

  // Handle tab changes with animation
  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;

    const newCategory = getCurrentCategory(tabId);
    setIsTabTransitioning(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setActiveTab(tabId);
      setActiveCategory(newCategory);
      // Wait a bit then start the entrance animation
      setTimeout(() => {
        setIsTabTransitioning(false);
      }, 50);
    }, 200);
  };

  // Set document title
  useDocumentTitle('Admin Dashboard');

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

        {/* Category Navigation */}
        <div className="flex flex-wrap mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                if (category.id !== activeCategory) {
                  const firstTabInCategory = category.tabs[0].id;
                  handleTabChange(firstTabInCategory);
                }
              }}
              className={`px-5 py-2 mr-2 mb-2 rounded-t-lg transition-all duration-300 ease-in-out ${
                activeCategory === category.id
                  ? `bg-${colorPalette.primary.base} text-white font-medium`
                  : `bg-gray-100 text-${colorPalette.text.secondary} hover:bg-gray-200`
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Tab Navigation for current category */}
        <div className="flex flex-wrap mb-6 border-b border-gray-200">
          {categories
            .find(cat => cat.id === activeCategory)
            .tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 mr-2 transition-all duration-300 ease-in-out relative ${
                  activeTab === tab.id
                    ? `text-${colorPalette.primary.base} font-medium`
                    : `text-${colorPalette.text.secondary} hover:text-${colorPalette.primary.base}`
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-${colorPalette.primary.base} transform transition-transform duration-300 scale-x-100`}></span>
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
