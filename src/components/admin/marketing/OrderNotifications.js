import React, { useState } from 'react';
import { useWebsite } from '../../../context/WebsiteContext';

const OrderNotifications = () => {
  const { users, colorPalette } = useWebsite();

  // Sample notification templates
  const [notificationTemplates, setNotificationTemplates] = useState([
    {
      id: 1,
      name: 'Order Confirmation',
      emailTemplate: 'Thank you for your order! Your order #[order_id] has been received and is being processed.',
      smsTemplate: 'Your order #[order_id] with Little Desert Leather Works has been received. Thank you!',
      triggerEvent: 'order_placed',
      emailEnabled: true,
      smsEnabled: false
    },
    {
      id: 2,
      name: 'Shipping Confirmation',
      emailTemplate: 'Good news! Your order #[order_id] has shipped. Track your package: [tracking_link]',
      smsTemplate: 'Your order #[order_id] has shipped. Track: [tracking_link]',
      triggerEvent: 'order_shipped',
      emailEnabled: true,
      smsEnabled: true
    },
    {
      id: 3,
      name: 'Delivery Confirmation',
      emailTemplate: 'Your order #[order_id] has been delivered. We hope you enjoy your new leather goods!',
      smsTemplate: 'Your order #[order_id] has been delivered. Enjoy!',
      triggerEvent: 'order_delivered',
      emailEnabled: true,
      smsEnabled: false
    },
    {
      id: 4,
      name: 'Order Canceled',
      emailTemplate: 'Your order #[order_id] has been canceled as requested. If you have any questions, please contact us.',
      smsTemplate: 'Your order #[order_id] has been canceled as requested.',
      triggerEvent: 'order_canceled',
      emailEnabled: true,
      smsEnabled: false
    }
  ]);

  // Get counts of users with order notifications enabled
  const orderUpdateEnabledCount = users ? users.filter(user =>
    user.marketingPreferences && user.marketingPreferences.orderUpdates
  ).length : 0;

  const handleToggleEmail = (templateId) => {
    setNotificationTemplates(notificationTemplates.map(template =>
      template.id === templateId
        ? {...template, emailEnabled: !template.emailEnabled}
        : template
    ));
  };

  const handleToggleSms = (templateId) => {
    setNotificationTemplates(notificationTemplates.map(template =>
      template.id === templateId
        ? {...template, smsEnabled: !template.smsEnabled}
        : template
    ));
  };

  const handleUpdateTemplate = (templateId, field, value) => {
    setNotificationTemplates(notificationTemplates.map(template =>
      template.id === templateId
        ? {...template, [field]: value}
        : template
    ));
  };

  // Information cards about placeholder variables
  const notificationVariables = [
    { name: '[order_id]', description: 'The unique order ID number' },
    { name: '[customer_name]', description: 'The customer\'s full name' },
    { name: '[tracking_link]', description: 'Shipment tracking URL' },
    { name: '[order_date]', description: 'Date the order was placed' },
    { name: '[shipping_address]', description: 'Customer\'s shipping address' },
    { name: '[order_total]', description: 'Total amount of the order' },
    { name: '[product_list]', description: 'List of products ordered' }
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Order & Shipping Notifications</h3>
          <p className="text-gray-600 mt-1">
            Configure automated notifications for order status updates to {orderUpdateEnabledCount} subscribed users
          </p>
        </div>
      </div>

      {/* Notification Variables Card */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-blue-800 mb-2">Available Placeholder Variables</h4>
        <p className="text-blue-700 text-sm mb-3">
          Use these variables in your notification templates to personalize messages.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {notificationVariables.map((variable, index) => (
            <div key={index} className="bg-white rounded p-2 text-sm border border-blue-100">
              <span className="font-mono text-blue-600 block">{variable.name}</span>
              <span className="text-gray-600 text-xs">{variable.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Templates */}
      <div className="space-y-6">
        {notificationTemplates.map((template) => (
          <div key={template.id} className="border border-gray-200 rounded-lg p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-lg font-medium">{template.name}</h4>
                <p className="text-gray-500 text-sm">
                  Trigger: <span className="capitalize">{template.triggerEvent.replace(/_/g, ' ')}</span>
                </p>
              </div>

              <div className="flex space-x-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                    checked={template.emailEnabled}
                    onChange={() => handleToggleEmail(template.id)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Email</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                    checked={template.smsEnabled}
                    onChange={() => handleToggleSms(template.id)}
                  />
                  <span className="ml-2 text-sm text-gray-700">SMS</span>
                </label>
              </div>
            </div>

            {/* Email Template */}
            <div className={`transition-opacity duration-300 ${template.emailEnabled ? 'opacity-100' : 'opacity-50'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Template:
              </label>
              <textarea
                className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[80px] ${!template.emailEnabled && 'bg-gray-50'}`}
                value={template.emailTemplate}
                onChange={(e) => handleUpdateTemplate(template.id, 'emailTemplate', e.target.value)}
                disabled={!template.emailEnabled}
              />
            </div>

            {/* SMS Template */}
            <div className={`mt-4 transition-opacity duration-300 ${template.smsEnabled ? 'opacity-100' : 'opacity-50'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMS Template: <span className="text-xs font-normal text-gray-500">({template.smsTemplate.length} chars)</span>
              </label>
              <textarea
                className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[80px] ${!template.smsEnabled && 'bg-gray-50'}`}
                value={template.smsTemplate}
                onChange={(e) => handleUpdateTemplate(template.id, 'smsTemplate', e.target.value)}
                disabled={!template.smsEnabled}
                maxLength={160}
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">
                  {Math.ceil(template.smsTemplate.length / 160)} SMS segment(s)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Test and Save Section */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
        >
          Test Notifications
        </button>
        <button
          className={`px-4 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.dark}`}
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default OrderNotifications;
