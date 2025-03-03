import React, { useState } from 'react';
import { useWebsite } from '../../context/WebsiteContext';

const ContactSection = () => {
  const { contactInfo, updateContactInfo, sectionsVisibility, updateSectionVisibility } = useWebsite();
  const [editedContactInfo, setEditedContactInfo] = useState({ ...contactInfo });

  const handleSaveContact = () => {
    updateContactInfo(editedContactInfo);
    // Could add a success message here
  };

  const handleSectionVisibilityChange = (e) => {
    updateSectionVisibility('contact', e.target.checked);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        <div className="flex items-center">
          <label className="flex items-center text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={sectionsVisibility.contact}
              onChange={handleSectionVisibilityChange}
              className="mr-2 h-5 w-5 text-blue-600"
            />
            <span>Section Visible on Website</span>
          </label>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <h3 className="font-medium text-lg mb-3">Visibility Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editedContactInfo.showMap}
                onChange={(e) => setEditedContactInfo({ ...editedContactInfo, showMap: e.target.checked })}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span>Show Map</span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-7">
              {editedContactInfo.showMap
                ? "Map is currently visible to visitors"
                : "Map is currently hidden from visitors"}
            </p>
          </div>

          <div>
            <label className="flex items-center text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editedContactInfo.showAddress}
                onChange={(e) => setEditedContactInfo({ ...editedContactInfo, showAddress: e.target.checked })}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span>Show Address</span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-7">
              {editedContactInfo.showAddress
                ? "Address is currently visible to visitors"
                : "Address is currently hidden from visitors"}
            </p>
          </div>

          <div>
            <label className="flex items-center text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editedContactInfo.showPhone}
                onChange={(e) => setEditedContactInfo({ ...editedContactInfo, showPhone: e.target.checked })}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span>Show Phone Number</span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-7">
              {editedContactInfo.showPhone
                ? "Phone number is currently visible to visitors"
                : "Phone number is currently hidden from visitors"}
            </p>
          </div>
        </div>
      </div>

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
            <label className="block text-gray-700 font-medium mb-2">
              Phone Number
              {!editedContactInfo.showPhone && (
                <span className="ml-2 text-sm text-gray-500">(Hidden on website)</span>
              )}
            </label>
            <input
              type="tel"
              value={editedContactInfo.phone}
              onChange={(e) => setEditedContactInfo({ ...editedContactInfo, phone: e.target.value })}
              className={`w-full p-2 border rounded ${!editedContactInfo.showPhone ? 'border-dashed opacity-70' : ''}`}
            />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Address
              {!editedContactInfo.showAddress && (
                <span className="ml-2 text-sm text-gray-500">(Hidden on website)</span>
              )}
            </label>
            <textarea
              value={editedContactInfo.address}
              onChange={(e) => setEditedContactInfo({ ...editedContactInfo, address: e.target.value })}
              className={`w-full p-2 border rounded h-24 ${!editedContactInfo.showAddress ? 'border-dashed opacity-70' : ''}`}
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
