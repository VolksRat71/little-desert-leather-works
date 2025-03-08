import React, { useState, useEffect, useRef } from 'react';
import { useWebsite } from '../../../context/WebsiteContext';
import Modal from '../../Modal';
import EllipsisMenu from '../../../components/EllipsisMenu';

const SalesCampaigns = () => {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, activateCampaign, deactivateCampaign, users, colorPalette } = useWebsite();

  const [campaignsList, setCampaignsList] = useState(campaigns);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'site-wide',
    discountType: 'percentage',
    discountValue: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    isActive: false,
    heroImage: '',
    description: '',
    promoCode: '',
    minimumPurchase: 0,
    targetUserIds: []
  });
  const newImageFileInputRef = useRef(null);
  const editImageFileInputRef = useRef(null);

  // Update local campaigns when context campaigns change
  useEffect(() => {
    setCampaignsList(campaigns);
  }, [campaigns]);

  const handleCreateClick = () => {
    setNewCampaign({
      name: '',
      type: 'site-wide',
      discountType: 'percentage',
      discountValue: 10,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      isActive: false,
      heroImage: '',
      description: '',
      promoCode: '',
      minimumPurchase: 0,
      targetUserIds: []
    });
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (campaign) => {
    setSelectedCampaign({...campaign});
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCampaign = () => {
    addCampaign(newCampaign);
    setIsCreateModalOpen(false);
  };

  const handleUpdateCampaign = () => {
    updateCampaign(selectedCampaign);
    setIsEditModalOpen(false);
  };

  const handleDeleteCampaign = () => {
    deleteCampaign(selectedCampaign.id);
    setIsDeleteModalOpen(false);
  };

  const handleToggleActive = (campaign) => {
    if (campaign.isActive) {
      deactivateCampaign(campaign.id);
    } else {
      activateCampaign(campaign.id);
    }
  };

  const handleNewHeroImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewCampaign({ ...newCampaign, heroImage: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleEditHeroImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedCampaign({ ...selectedCampaign, heroImage: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const generateRandomPromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Status badge component
  const StatusBadge = ({ isActive, startDate, endDate }) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    let status, bgColor, textColor;

    if (!isActive) {
      status = 'Inactive';
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
    } else if (now < start) {
      status = 'Scheduled';
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
    } else if (now > end) {
      status = 'Expired';
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    } else {
      status = 'Active';
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    }

    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  // Type badge component
  const TypeBadge = ({ type }) => {
    let bgColor, textColor;

    switch(type) {
      case 'site-wide':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'individual':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
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
          <h3 className="text-lg font-medium">Sales Campaigns</h3>
          <p className="text-gray-600 mt-1">
            Create and manage promotional campaigns and discounts
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className={`bg-${colorPalette.primary.base} text-white px-4 py-2 rounded hover:bg-${colorPalette.primary.dark}`}
        >
          Create New Campaign
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 mb-8">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Campaign Name</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Type</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Discount</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Dates</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Promo Code</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaignsList.map((campaign, index) => (
              <tr
                key={campaign.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 0.3s ease-out forwards'
                }}
              >
                <td className="py-3 px-4 font-medium">{campaign.name}</td>
                <td className="py-3 px-4">
                  <TypeBadge type={campaign.type} />
                </td>
                <td className="py-3 px-4">
                  {campaign.discountType === 'percentage' ? `${campaign.discountValue}%` : `$${campaign.discountValue}`}
                  {campaign.minimumPurchase > 0 && ` (min $${campaign.minimumPurchase})`}
                </td>
                <td className="py-3 px-4">
                  {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                </td>
                <td className="py-3 px-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">{campaign.promoCode}</code>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge
                    isActive={campaign.isActive}
                    startDate={campaign.startDate}
                    endDate={campaign.endDate}
                  />
                </td>
                <td className="py-3 px-4">
                  <EllipsisMenu
                    position="left"
                    actions={[
                      {
                        label: campaign.isActive ? 'Deactivate' : 'Activate',
                        onClick: () => handleToggleActive(campaign),
                        className: campaign.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'
                      },
                      {
                        label: 'Edit',
                        onClick: () => handleEditClick(campaign),
                        className: 'text-blue-600 hover:text-blue-800'
                      },
                      {
                        label: 'Delete',
                        onClick: () => handleDeleteClick(campaign),
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

      {/* Create Campaign Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Sales Campaign"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Campaign Name</label>
            <input
              type="text"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Summer Sale 2023"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Campaign Type</label>
            <select
              value={newCampaign.type}
              onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="site-wide">Site-wide (All Customers)</option>
              <option value="individual">Individual (Specific Customers)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Discount Type</label>
              <select
                value={newCampaign.discountType}
                onChange={(e) => setNewCampaign({ ...newCampaign, discountType: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Discount Value</label>
              <input
                type="number"
                min="0"
                value={newCampaign.discountValue}
                onChange={(e) => setNewCampaign({ ...newCampaign, discountValue: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Minimum Purchase (0 for none)</label>
            <input
              type="number"
              min="0"
              value={newCampaign.minimumPurchase}
              onChange={(e) => setNewCampaign({ ...newCampaign, minimumPurchase: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={newCampaign.startDate}
                onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">End Date</label>
              <input
                type="date"
                value={newCampaign.endDate}
                onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Promo Code</label>
            <div className="flex">
              <input
                type="text"
                value={newCampaign.promoCode}
                onChange={(e) => setNewCampaign({ ...newCampaign, promoCode: e.target.value.toUpperCase() })}
                className="w-full p-2 border rounded-l"
                placeholder="SUMMER20"
              />
              <button
                onClick={() => setNewCampaign({ ...newCampaign, promoCode: generateRandomPromoCode() })}
                className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-r"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              value={newCampaign.description}
              onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              className="w-full p-2 border rounded h-24"
              placeholder="Summer sale with 20% off all products"
            />
          </div>

          {newCampaign.type === 'site-wide' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Hero Banner Image</label>
              {newCampaign.heroImage && (
                <div className="mt-2 mb-3 border rounded p-2">
                  <img src={newCampaign.heroImage} alt="Hero Banner Preview" className="w-full h-auto" />
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={newCampaign.heroImage}
                  onChange={(e) => setNewCampaign({ ...newCampaign, heroImage: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Enter image URL or upload below"
                />

                <div>
                  <input
                    type="file"
                    ref={newImageFileInputRef}
                    onChange={handleNewHeroImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => newImageFileInputRef.current.click()}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Banner Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {newCampaign.type === 'individual' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Target Customers</label>
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {users.map(user => (
                  <label key={user.id} className="flex items-center p-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={newCampaign.targetUserIds.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewCampaign({
                            ...newCampaign,
                            targetUserIds: [...newCampaign.targetUserIds, user.id]
                          });
                        } else {
                          setNewCampaign({
                            ...newCampaign,
                            targetUserIds: newCampaign.targetUserIds.filter(id => id !== user.id)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border rounded text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCampaign}
              className={`px-4 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.dark}`}
            >
              Create Campaign
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Campaign Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Sales Campaign"
      >
        {selectedCampaign && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Campaign Name</label>
              <input
                type="text"
                value={selectedCampaign.name}
                onChange={(e) => setSelectedCampaign({ ...selectedCampaign, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Campaign Type</label>
              <select
                value={selectedCampaign.type}
                onChange={(e) => setSelectedCampaign({ ...selectedCampaign, type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="site-wide">Site-wide (All Customers)</option>
                <option value="individual">Individual (Specific Customers)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Discount Type</label>
                <select
                  value={selectedCampaign.discountType}
                  onChange={(e) => setSelectedCampaign({ ...selectedCampaign, discountType: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Discount Value</label>
                <input
                  type="number"
                  min="0"
                  value={selectedCampaign.discountValue}
                  onChange={(e) => setSelectedCampaign({ ...selectedCampaign, discountValue: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Minimum Purchase (0 for none)</label>
              <input
                type="number"
                min="0"
                value={selectedCampaign.minimumPurchase || 0}
                onChange={(e) => setSelectedCampaign({ ...selectedCampaign, minimumPurchase: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={selectedCampaign.startDate}
                  onChange={(e) => setSelectedCampaign({ ...selectedCampaign, startDate: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={selectedCampaign.endDate}
                  onChange={(e) => setSelectedCampaign({ ...selectedCampaign, endDate: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Promo Code</label>
              <div className="flex">
                <input
                  type="text"
                  value={selectedCampaign.promoCode}
                  onChange={(e) => setSelectedCampaign({ ...selectedCampaign, promoCode: e.target.value.toUpperCase() })}
                  className="w-full p-2 border rounded-l"
                />
                <button
                  onClick={() => setSelectedCampaign({ ...selectedCampaign, promoCode: generateRandomPromoCode() })}
                  className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-r"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                value={selectedCampaign.description}
                onChange={(e) => setSelectedCampaign({ ...selectedCampaign, description: e.target.value })}
                className="w-full p-2 border rounded h-24"
              />
            </div>

            {selectedCampaign.type === 'site-wide' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Hero Banner Image</label>
                {selectedCampaign.heroImage && (
                  <div className="mt-2 mb-3 border rounded p-2">
                    <img src={selectedCampaign.heroImage} alt="Hero Banner Preview" className="w-full h-auto" />
                  </div>
                )}

                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={selectedCampaign.heroImage || ''}
                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, heroImage: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Enter image URL or upload below"
                  />

                  <div>
                    <input
                      type="file"
                      ref={editImageFileInputRef}
                      onChange={handleEditHeroImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editImageFileInputRef.current.click()}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload Banner Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedCampaign.type === 'individual' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Target Customers</label>
                <div className="max-h-48 overflow-y-auto border rounded p-2">
                  {users.map(user => (
                    <label key={user.id} className="flex items-center p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={(selectedCampaign.targetUserIds || []).includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCampaign({
                              ...selectedCampaign,
                              targetUserIds: [...(selectedCampaign.targetUserIds || []), user.id]
                            });
                          } else {
                            setSelectedCampaign({
                              ...selectedCampaign,
                              targetUserIds: (selectedCampaign.targetUserIds || []).filter(id => id !== user.id)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCampaign}
                className={`px-4 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.dark}`}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Campaign Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        {selectedCampaign && (
          <div>
            <p className="mb-4">
              Are you sure you want to delete the campaign "{selectedCampaign.name}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCampaign}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalesCampaigns;
