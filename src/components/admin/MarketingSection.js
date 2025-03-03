import React, { useState } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import EmailCampaigns from './marketing/EmailCampaigns';
import TextMessages from './marketing/TextMessages';
import OrderNotifications from './marketing/OrderNotifications';

const MarketingSection = () => {
  const { colorPalette } = useWebsite();
  const [activeTab, setActiveTab] = useState('email');

  // Marketing tabs
  const tabs = [
    { id: 'email', label: 'Email Campaigns' },
    { id: 'text', label: 'Text Messages' },
    { id: 'notifications', label: 'Order Notifications' },
    { id: 'settings', label: 'Settings' },
  ];

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
            onClick={() => setActiveTab(tab.id)}
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

      {/* Content based on active tab */}
      <div className="bg-white rounded-lg overflow-hidden">
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
  );
};

export default MarketingSection;
