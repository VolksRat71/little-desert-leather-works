import React, { useState, useEffect } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import Modal from '../Modal';
import EllipsisMenu from '../EllipsisMenu';

const UsersSection = () => {
  const { users, addUser, updateUser, deleteUser } = useWebsite();

  const [usersList, setUsersList] = useState(users || []);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User',
    marketingPreferences: {
      emailOffers: false,
      textOffers: false,
      orderUpdates: true
    }
  });

  // Update local state when context users change
  useEffect(() => {
    if (users) {
      setUsersList(users);
    }
  }, [users]);

  // Sample users if no users are provided in context
  const sampleUsers = usersList.length > 0 ? usersList : [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'Admin',
      lastLogin: '2023-03-15',
      marketingPreferences: {
        emailOffers: true,
        textOffers: false,
        orderUpdates: true
      }
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'User',
      lastLogin: '2023-03-10',
      marketingPreferences: {
        emailOffers: true,
        textOffers: true,
        orderUpdates: true
      }
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      lastLogin: '2023-03-12',
      marketingPreferences: {
        emailOffers: false,
        textOffers: false,
        orderUpdates: true
      }
    }
  ];

  const handleAddClick = () => {
    setNewUser({
      name: '',
      email: '',
      role: 'User',
      marketingPreferences: {
        emailOffers: false,
        textOffers: false,
        orderUpdates: true
      }
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser({...user});
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAddUser = () => {
    // Generate a new ID for the user in this example
    const newId = Math.max(...sampleUsers.map(u => u.id)) + 1;
    const userToAdd = {
      ...newUser,
      id: newId,
      lastLogin: 'Never'
    };

    if (addUser) {
      addUser(userToAdd);
    } else {
      // If the context function isn't available, update local state
      setUsersList([...sampleUsers, userToAdd]);
    }

    setIsAddModalOpen(false);
  };

  const handleUpdateUser = () => {
    if (updateUser) {
      updateUser(selectedUser.id, selectedUser);
    } else {
      // If the context function isn't available, update local state
      setUsersList(sampleUsers.map(user =>
        user.id === selectedUser.id ? selectedUser : user
      ));
    }

    setIsEditModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (deleteUser) {
      deleteUser(selectedUser.id);
    } else {
      // If the context function isn't available, update local state
      setUsersList(sampleUsers.filter(user => user.id !== selectedUser.id));
    }

    setIsDeleteModalOpen(false);
  };

  const handleMarketingPreferenceChange = (user, field, value) => {
    const updatedUser = {...user};
    updatedUser.marketingPreferences = {
      ...updatedUser.marketingPreferences,
      [field]: value
    };
    return updatedUser;
  };

  // Helper function to render marketing badge
  const renderMarketingStatus = (user) => {
    const prefs = user.marketingPreferences || {};
    const anyEnabled = prefs.emailOffers || prefs.textOffers || prefs.orderUpdates;

    if (!anyEnabled) {
      return (
        <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
          No Marketing
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {prefs.emailOffers && (
          <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            Email
          </span>
        )}
        {prefs.textOffers && (
          <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            Text
          </span>
        )}
        {prefs.orderUpdates && (
          <span className="inline-block px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
            Orders
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <p className="mb-6 text-gray-600">
        Manage user accounts, permissions, and marketing preferences.
      </p>

      <div className="mb-6">
        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200"
        >
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Role</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Marketing</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Last Login</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleUsers.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 0.3s ease-out forwards'
                }}
              >
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    user.role === 'Admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {renderMarketingStatus(user)}
                </td>
                <td className="py-3 px-4">{user.lastLogin}</td>
                <td className="py-3 px-4">
                  <EllipsisMenu
                    position="left"
                    actions={[
                      {
                        label: 'Edit',
                        onClick: () => handleEditClick(user),
                        className: 'text-blue-600 hover:text-blue-800'
                      },
                      {
                        label: 'Delete',
                        onClick: () => handleDeleteClick(user),
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

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Role</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Marketing Preferences</label>
            <div className="space-y-2 pl-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4"
                  checked={newUser.marketingPreferences.emailOffers}
                  onChange={(e) => setNewUser(handleMarketingPreferenceChange(newUser, 'emailOffers', e.target.checked))}
                />
                <span>Email Offers</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4"
                  checked={newUser.marketingPreferences.textOffers}
                  onChange={(e) => setNewUser(handleMarketingPreferenceChange(newUser, 'textOffers', e.target.checked))}
                />
                <span>Text Message Offers</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4"
                  checked={newUser.marketingPreferences.orderUpdates}
                  onChange={(e) => setNewUser(handleMarketingPreferenceChange(newUser, 'orderUpdates', e.target.checked))}
                />
                <span>Order Updates</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add User
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Role</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Marketing Preferences</label>
              <div className="space-y-2 pl-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4"
                    checked={selectedUser.marketingPreferences?.emailOffers || false}
                    onChange={(e) => setSelectedUser(handleMarketingPreferenceChange(selectedUser, 'emailOffers', e.target.checked))}
                  />
                  <span>Email Offers</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4"
                    checked={selectedUser.marketingPreferences?.textOffers || false}
                    onChange={(e) => setSelectedUser(handleMarketingPreferenceChange(selectedUser, 'textOffers', e.target.checked))}
                  />
                  <span>Text Message Offers</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4"
                    checked={selectedUser.marketingPreferences?.orderUpdates || false}
                    onChange={(e) => setSelectedUser(handleMarketingPreferenceChange(selectedUser, 'orderUpdates', e.target.checked))}
                  />
                  <span>Order Updates</span>
                </label>
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
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        {selectedUser && (
          <div>
            <p className="mb-4">Are you sure you want to delete the user "{selectedUser.name}"?</p>
            <p className="mb-6 text-red-600">This action cannot be undone.</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
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

export default UsersSection;
