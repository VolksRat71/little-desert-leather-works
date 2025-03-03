import React, { useState, useEffect, useRef } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import Modal from '../Modal';

const TestimonialsSection = () => {
  const {
    testimonials,
    updateTestimonial,
    addTestimonial,
    deleteTestimonial,
    sectionsVisibility,
    updateSectionVisibility
  } = useWebsite();

  const [testimonialsList, setTestimonialsList] = useState(testimonials);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    location: '',
    testimonial: '',
    image: '',
    isVisible: true
  });
  const fileInputRef = useRef(null);
  const newFileInputRef = useRef(null);

  // Update local testimonials when context testimonials change
  useEffect(() => {
    setTestimonialsList(testimonials);
  }, [testimonials]);

  const handleEditClick = (testimonial) => {
    setEditingTestimonial({ ...testimonial });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsDeleteModalOpen(true);
  };

  const handleAddClick = () => {
    setNewTestimonial({
      name: '',
      location: '',
      testimonial: '',
      image: '',
      isVisible: true
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = () => {
    updateTestimonial(editingTestimonial);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteTestimonial(testimonialToDelete.id);
    setIsDeleteModalOpen(false);
  };

  const handleAddTestimonial = () => {
    addTestimonial(newTestimonial);
    setIsAddModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingTestimonial({ ...editingTestimonial, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleNewImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewTestimonial({ ...newTestimonial, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSectionVisibilityChange = (e) => {
    updateSectionVisibility('testimonials', e.target.checked);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer Testimonials</h2>
        <div className="flex items-center">
          <label className="flex items-center text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={sectionsVisibility.testimonials}
              onChange={handleSectionVisibilityChange}
              className="mr-2 h-5 w-5 text-blue-600"
            />
            <span>Section Visible on Website</span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonialsList.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`bg-white p-4 rounded shadow-sm border ${!testimonial.isVisible ? 'opacity-60 border-dashed' : ''}`}
          >
            <div className="flex items-center mb-3">
              {testimonial.image && (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              )}
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{testimonial.name}</h3>
                  {!testimonial.isVisible && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-3 text-sm">"{testimonial.testimonial}"</p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditClick(testimonial)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(testimonial)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Testimonial Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Testimonial">
        <div className="space-y-4">
          <div className="flex items-start mb-2">
            <label className="flex items-center text-gray-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={editingTestimonial?.isVisible === undefined ? true : editingTestimonial?.isVisible}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, isVisible: e.target.checked })}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span>Visible on Website</span>
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={editingTestimonial?.name || ''}
              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              value={editingTestimonial?.location || ''}
              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Testimonial</label>
            <textarea
              value={editingTestimonial?.testimonial || ''}
              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, testimonial: e.target.value })}
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Image</label>
            {editingTestimonial?.image && (
              <div className="mb-2">
                <img
                  src={editingTestimonial.image}
                  alt={editingTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={editingTestimonial?.image || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, image: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Enter image URL or upload below"
              />

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div>
          <p className="mb-4">Are you sure you want to delete the testimonial from {testimonialToDelete?.name}?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Testimonial Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Testimonial">
        <div className="space-y-4">
          <div className="flex items-start mb-2">
            <label className="flex items-center text-gray-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={newTestimonial.isVisible}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, isVisible: e.target.checked })}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span>Visible on Website</span>
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              value={newTestimonial.location}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Testimonial</label>
            <textarea
              value={newTestimonial.testimonial}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial: e.target.value })}
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Image</label>
            {newTestimonial.image && (
              <div className="mb-2">
                <img
                  src={newTestimonial.image}
                  alt="Customer"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={newTestimonial.image}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, image: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Enter image URL or upload below"
              />

              <div>
                <input
                  type="file"
                  ref={newFileInputRef}
                  onChange={handleNewImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => newFileInputRef.current.click()}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTestimonial}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Add Testimonial
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TestimonialsSection;
