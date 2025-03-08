import React, { useState } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import EmailCampaigns from './marketing/EmailCampaigns';
import TextMessages from './marketing/TextMessages';
import OrderNotifications from './marketing/OrderNotifications';
import SalesCampaigns from './marketing/SalesCampaigns';

const MarketingSection = () => {
  const { colorPalette } = useWebsite();
  const [activeTab, setActiveTab] = useState('sales');
  const [previousTab, setPreviousTab] = useState('');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  // Marketing tabs
  const tabs = [
    { id: 'sales', label: 'Sales Campaigns' },
    { id: 'email', label: 'Email Campaigns' },
    { id: 'text', label: 'Text Messages' },
    { id: 'notifications', label: 'Order Notifications' },
    { id: 'settings', label: 'Settings' },
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
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Marketing Management</h2>
      <p className="mb-6 text-gray-600">
        Create and manage marketing campaigns, automated messages, and customer communications.
      </p>

      {/* Marketing Navigation */}
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

      {/* Content based on active tab with animation */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className={`transition-all duration-200 ease-in-out ${isTabTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          {activeTab === 'sales' && <SalesCampaigns />}
          {activeTab === 'email' && <EmailCampaigns />}
          {activeTab === 'text' && <TextMessages />}
          {activeTab === 'notifications' && <OrderNotifications />}
          {activeTab === 'settings' && (
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">Marketing Settings</h3>
              <p className="text-gray-600 mb-4">
                Configure global settings for all marketing communications.
              </p>
              <div className="text-center py-8 text-gray-500">
                Marketing settings will be implemented in the next update.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingSection;
