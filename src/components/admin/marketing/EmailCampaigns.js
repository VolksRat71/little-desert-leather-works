import React, { useState } from 'react';
import { useWebsite } from '../../../context/WebsiteContext';
import Modal from '../../Modal';
import EllipsisMenu from '../../../components/EllipsisMenu';

const EmailCampaigns = () => {
  const { users, colorPalette } = useWebsite();

  // Sample email templates
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to Little Desert Leather Works!',
      body: 'Thank you for creating an account with us. We\'re excited to have you as part of our community!',
      lastSent: '2023-02-15',
      status: 'active',
      type: 'automated'
    },
    {
      id: 2,
      name: 'New Products Announcement',
      subject: 'Check Out Our New Handcrafted Items!',
      body: 'We\'ve just added some amazing new leather goods to our collection. Click here to see them!',
      lastSent: '2023-03-10',
      status: 'draft',
      type: 'campaign'
    },
    {
      id: 3,
      name: 'Seasonal Sale',
      subject: '25% Off All Wallets - Limited Time!',
      body: 'For the next week, enjoy 25% off all wallets in our collection. Use code WALLET25 at checkout.',
      lastSent: 'Never',
      status: 'draft',
      type: 'campaign'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    body: '',
    type: 'campaign'
  });

  // Get counts of users with email marketing enabled
  const emailableUserCount = users ? users.filter(user =>
    user.marketingPreferences && user.marketingPreferences.emailOffers
  ).length : 0;

  const handleCreateClick = () => {
    setNewTemplate({
      name: '',
      subject: '',
      body: '',
      type: 'campaign'
    });
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (template) => {
    setSelectedTemplate({...template});
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (template) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const handleSendClick = (template) => {
    setSelectedTemplate(template);
    setIsSendModalOpen(true);
  };

  const handleCreateTemplate = () => {
    const newId = Math.max(...emailTemplates.map(t => t.id)) + 1;
    const templateToAdd = {
      ...newTemplate,
      id: newId,
      lastSent: 'Never',
      status: 'draft'
    };

    setEmailTemplates([...emailTemplates, templateToAdd]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateTemplate = () => {
    setEmailTemplates(emailTemplates.map(template =>
      template.id === selectedTemplate.id ? selectedTemplate : template
    ));

    setIsEditModalOpen(false);
  };

  const handleDeleteTemplate = () => {
    setEmailTemplates(emailTemplates.filter(template => template.id !== selectedTemplate.id));
    setIsDeleteModalOpen(false);
  };

  const handleSendEmail = () => {
    // In a real app, this would integrate with an email service
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    setEmailTemplates(emailTemplates.map(template =>
      template.id === selectedTemplate.id
        ? {...template, lastSent: formattedDate, status: 'active'}
        : template
    ));

    setIsSendModalOpen(false);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor;

    switch(status) {
      case 'active':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'draft':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  // Type badge component
  const TypeBadge = ({ type }) => {
    let bgColor, textColor;

    switch(type) {
      case 'automated':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
      case 'campaign':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${bgColor} ${textColor}`}>
        {type}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Email Marketing Campaigns</h3>
          <p className="text-gray-600 mt-1">
            Create and send marketing emails to {emailableUserCount} subscribed users
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className={`bg-${colorPalette.primary.base} text-white px-4 py-2 rounded hover:bg-${colorPalette.primary.dark}`}
        >
          Create New Email
        </button>
      </div>

      {/* Email Templates Table */}
      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 mb-8">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Template Name</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Subject</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Type</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Last Sent</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emailTemplates.map((template, index) => (
              <tr
                key={template.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 0.3s ease-out forwards'
                }}
              >
                <td className="py-3 px-4 font-medium">{template.name}</td>
                <td className="py-3 px-4">{template.subject}</td>
                <td className="py-3 px-4">
                  <TypeBadge type={template.type} />
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={template.status} />
                </td>
                <td className="py-3 px-4">{template.lastSent}</td>
                <td className="py-3 px-4">
                  <EllipsisMenu
                    position="left"
                    actions={[
                      {
                        label: 'Send',
                        onClick: () => handleSendClick(template),
                        className: `text-${colorPalette.primary.base} hover:text-${colorPalette.primary.dark}`
                      },
                      {
                        label: 'Edit',
                        onClick: () => handleEditClick(template),
                        className: 'text-blue-600 hover:text-blue-800'
                      },
                      {
                        label: 'Delete',
                        onClick: () => handleDeleteClick(template),
                        className: 'text-red-600 hover:text-red-800'
                      }
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Email Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Email Template"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Template Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              placeholder="e.g., Summer Sale Announcement"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email Subject</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newTemplate.subject}
              onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
              placeholder="e.g., Special Offer: 20% Off All Products!"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email Type</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newTemplate.type}
              onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})}
            >
              <option value="campaign">Campaign (One-time)</option>
              <option value="automated">Automated</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email Body</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[150px]"
              value={newTemplate.body}
              onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
              placeholder="Enter your email content here..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTemplate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Template
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Email Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Email Template"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Template Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={selectedTemplate.name}
                onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email Subject</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={selectedTemplate.subject}
                onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email Type</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={selectedTemplate.type}
                onChange={(e) => setSelectedTemplate({...selectedTemplate, type: e.target.value})}
              >
                <option value="campaign">Campaign (One-time)</option>
                <option value="automated">Automated</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email Body</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[150px]"
                value={selectedTemplate.body}
                onChange={(e) => setSelectedTemplate({...selectedTemplate, body: e.target.value})}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Template Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        {selectedTemplate && (
          <div>
            <p className="mb-4">Are you sure you want to delete the template "{selectedTemplate.name}"?</p>
            <p className="mb-6 text-red-600">This action cannot be undone.</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTemplate}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Send Email Modal */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Email Campaign"
      >
        {selectedTemplate && (
          <div>
            <p className="mb-4">You are about to send "{selectedTemplate.name}" to {emailableUserCount} users who have opted in to email marketing.</p>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <p className="font-semibold">Subject: {selectedTemplate.subject}</p>
              <p className="mt-2 whitespace-pre-line">{selectedTemplate.body}</p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className={`px-4 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.dark}`}
              >
                Send Now ({emailableUserCount} recipients)
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmailCampaigns;
