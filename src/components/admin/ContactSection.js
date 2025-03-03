import React, { useState } from 'react';
import { useWebsite } from '../../context/WebsiteContext';

const ContactSection = () => {
  const { contactInfo, updateContactInfo } = useWebsite();
  const [editedContactInfo, setEditedContactInfo] = useState({ ...contactInfo });

  const handleSaveContact = () => {
    updateContactInfo(editedContactInfo);
    // Could add a success message here
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={editedContactInfo.email}
              onChange={(e) => setEditedContactInfo({ ...editedContactInfo, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={editedContactInfo.phone}
              onChange={(e) => setEditedContactInfo({ ...editedContactInfo, phone: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Address</label>
            <textarea
              value={editedContactInfo.address}
              onChange={(e) => setEditedContactInfo({ ...editedContactInfo, address: e.target.value })}
              className="w-full p-2 border rounded h-24"
              placeholder="Enter your business address..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Business Hours</label>
            <textarea
              value={editedContactInfo.hours}
              onChange={(e) => setEditedContactInfo({ ...editedContactInfo, hours: e.target.value })}
              className="w-full p-2 border rounded h-24"
              placeholder="Enter your business hours..."
            />
            <p className="text-sm text-gray-500 mt-1">Format as: Day: Hours (one per line)</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleSaveContact}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Contact Information
        </button>
      </div>
    </div>
  );
};

export default ContactSection;
