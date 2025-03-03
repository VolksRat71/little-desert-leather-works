import React, { useState } from 'react';
import { useWebsite } from '../../../context/WebsiteContext';
import Modal from '../../Modal';

const TextMessages = () => {
  const { users, colorPalette } = useWebsite();

  // Sample text message templates
  const [textTemplates, setTextTemplates] = useState([
    {
      id: 1,
      name: 'Flash Sale',
      message: 'Flash Sale! 30% off all leather goods today only. Use code FLASH30 at checkout. Shop now: [link]',
      lastSent: '2023-02-20',
      status: 'active',
      type: 'campaign'
    },
    {
      id: 2,
      name: 'New Arrival Notification',
      message: 'New handcrafted items just arrived! Be the first to check them out: [link]',
      lastSent: '2023-03-05',
      status: 'draft',
      type: 'automated'
    },
    {
      id: 3,
      name: 'Limited Edition Release',
      message: 'Limited edition leather journal collection now available! Only 50 pieces. Shop now: [link]',
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
    message: '',
    type: 'campaign'
  });

  // Get counts of users with text marketing enabled
  const textableUserCount = users ? users.filter(user =>
    user.marketingPreferences && user.marketingPreferences.textOffers
  ).length : 0;

  const handleCreateClick = () => {
    setNewTemplate({
      name: '',
      message: '',
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
    const newId = Math.max(...textTemplates.map(t => t.id)) + 1;
    const templateToAdd = {
      ...newTemplate,
      id: newId,
      lastSent: 'Never',
      status: 'draft'
    };

    setTextTemplates([...textTemplates, templateToAdd]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateTemplate = () => {
    setTextTemplates(textTemplates.map(template =>
      template.id === selectedTemplate.id ? selectedTemplate : template
    ));

    setIsEditModalOpen(false);
  };

  const handleDeleteTemplate = () => {
    setTextTemplates(textTemplates.filter(template => template.id !== selectedTemplate.id));
    setIsDeleteModalOpen(false);
  };

  const handleSendText = () => {
    // In a real app, this would integrate with an SMS service
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    setTextTemplates(textTemplates.map(template =>
      template.id === selectedTemplate.id
        ? {...template, lastSent: formattedDate, status: 'active'}
        : template
    ));

    setIsSendModalOpen(false);
  };

  // Character count helper
  const getCharacterCount = (message) => {
    return message.length;
  };

  // Get estimated segment count (SMS messages are typically 160 chars)
  const getSegmentCount = (message) => {
    const count = getCharacterCount(message);
    return Math.ceil(count / 160);
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
          <h3 className="text-lg font-medium">Text Message Marketing</h3>
          <p className="text-gray-600 mt-1">
            Create and send SMS messages to {textableUserCount} subscribed users
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className={`bg-${colorPalette.primary.base} text-white px-4 py-2 rounded hover:bg-${colorPalette.primary.dark}`}
        >
          Create New Text
        </button>
      </div>

      {/* SMS Templates Table */}
      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 mb-8">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Template Name</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Message</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Type</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Last Sent</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {textTemplates.map((template, index) => (
              <tr
                key={template.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 0.3s ease-out forwards'
                }}
              >
                <td className="py-3 px-4 font-medium">{template.name}</td>
                <td className="py-3 px-4 truncate max-w-[200px]">{template.message}</td>
                <td className="py-3 px-4">
                  <TypeBadge type={template.type} />
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={template.status} />
                </td>
                <td className="py-3 px-4">{template.lastSent}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleSendClick(template)}
                    className={`text-${colorPalette.primary.base} hover:text-${colorPalette.primary.dark} transition-colors duration-150 mr-2`}
                  >
                    Send
                  </button>
                  <button
                    onClick={() => handleEditClick(template)}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-150 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(template)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-150"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Text Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Text Message Template"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Template Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              placeholder="e.g., Flash Sale Announcement"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Message Type</label>
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
            <label className="block text-gray-700 mb-1">Message Content</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px]"
              value={newTemplate.message}
              onChange={(e) => setNewTemplate({...newTemplate, message: e.target.value})}
              placeholder="Enter your SMS content here... Use [link] as a placeholder for your website URL."
              maxLength={480}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{getCharacterCount(newTemplate.message)} characters</span>
              <span>{getSegmentCount(newTemplate.message)} segment(s)</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 mb-2">
            <p className="font-medium">SMS Best Practices:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Keep messages under 160 characters when possible (1 segment)</li>
              <li>Include a clear call to action</li>
              <li>Personalize with [name] placeholder</li>
              <li>Always include opt-out information</li>
            </ul>
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

      {/* Edit Text Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Text Message Template"
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
              <label className="block text-gray-700 mb-1">Message Type</label>
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
              <label className="block text-gray-700 mb-1">Message Content</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px]"
                value={selectedTemplate.message}
                onChange={(e) => setSelectedTemplate({...selectedTemplate, message: e.target.value})}
                maxLength={480}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{getCharacterCount(selectedTemplate.message)} characters</span>
                <span>{getSegmentCount(selectedTemplate.message)} segment(s)</span>
              </div>
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

      {/* Send Text Modal */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Text Message Campaign"
      >
        {selectedTemplate && (
          <div>
            <p className="mb-4">You are about to send "{selectedTemplate.name}" to {textableUserCount} users who have opted in to SMS marketing.</p>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <p className="whitespace-pre-line">{selectedTemplate.message}</p>
              <div className="flex justify-between text-xs text-gray-500 mt-3">
                <span>{getCharacterCount(selectedTemplate.message)} characters</span>
                <span>{getSegmentCount(selectedTemplate.message)} segment(s)</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 mb-4">
              <p>
                <span className="font-medium">Estimated cost: </span>
                ${(textableUserCount * getSegmentCount(selectedTemplate.message) * 0.01).toFixed(2)}
                ({textableUserCount} recipients × {getSegmentCount(selectedTemplate.message)} segments × $0.01)
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendText}
                className={`px-4 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.dark}`}
              >
                Send Now ({textableUserCount} recipients)
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TextMessages;
