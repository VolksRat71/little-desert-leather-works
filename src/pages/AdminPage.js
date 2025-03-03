import React, { useState, Fragment, useEffect } from 'react';
import { useWebsite } from '../context/WebsiteContext';
import Modal from '../components/Modal';
import TailwindColorPicker from '../components/TailwindColorPicker';

const AdminPage = () => {
  const { navigate, colorPalette } = useWebsite();
  const [activeTab, setActiveTab] = useState('products');
  const [previousTab, setPreviousTab] = useState('');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  // Admin sections
  const tabs = [
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'colors', label: 'Theme Colors' },
    { id: 'orders', label: 'Orders' },
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
    <div className="container mx-auto px-4 py-8 min-h-screen animate-fadeIn">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold text-${colorPalette.text.primary}`}>
          Website Administration
        </h1>
        <p className={`text-${colorPalette.text.secondary} mt-2`}>
          Manage your website content, products, and settings
        </p>
      </div>

      {/* Admin Navigation */}
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

      {/* Content Sections with Animation */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
        <div className={`transition-all duration-200 ease-in-out ${isTabTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          {activeTab === 'products' && <ProductsSection />}
          {activeTab === 'about' && <AboutSection />}
          {activeTab === 'contact' && <ContactSection />}
          {activeTab === 'testimonials' && <TestimonialsSection />}
          {activeTab === 'colors' && <ColorsSection />}
          {activeTab === 'orders' && <OrdersSection />}
        </div>
      </div>
    </div>
  );
};

// Products Management Section
const ProductsSection = () => {
  const {
    products,
    updateProduct,
    addProduct,
    deleteProduct
  } = useWebsite();

  const [productsList, setProductsList] = useState(products);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    image: '',
    images: [],
    features: [],
    careInstructions: ''
  });

  // Update local state when context products change
  React.useEffect(() => {
    setProductsList(products);
  }, [products]);

  const handleEditClick = (product) => {
    setEditingProduct({...product});
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleAddClick = () => {
    setNewProduct({
      name: '',
      shortDescription: '',
      description: '',
      price: '',
      image: '',
      images: [''],
      features: [''],
      careInstructions: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = () => {
    updateProduct(editingProduct.id, editingProduct);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteProduct(productToDelete.id);
    setIsDeleteModalOpen(false);
  };

  const handleAddProduct = () => {
    // Filter out empty features
    const cleanedProduct = {
      ...newProduct,
      features: newProduct.features.filter(feature => feature.trim() !== ''),
      images: newProduct.images.filter(image => image.trim() !== '')
    };

    addProduct(cleanedProduct);
    setIsAddModalOpen(false);
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...editingProduct.features];
    updatedFeatures[index] = value;
    setEditingProduct({...editingProduct, features: updatedFeatures});
  };

  const addFeature = () => {
    setEditingProduct({
      ...editingProduct,
      features: [...editingProduct.features, '']
    });
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...editingProduct.features];
    updatedFeatures.splice(index, 1);
    setEditingProduct({...editingProduct, features: updatedFeatures});
  };

  const handleNewFeatureChange = (index, value) => {
    const updatedFeatures = [...newProduct.features];
    updatedFeatures[index] = value;
    setNewProduct({...newProduct, features: updatedFeatures});
  };

  const addNewFeature = () => {
    setNewProduct({
      ...newProduct,
      features: [...newProduct.features, '']
    });
  };

  const removeNewFeature = (index) => {
    const updatedFeatures = [...newProduct.features];
    updatedFeatures.splice(index, 1);
    setNewProduct({...newProduct, features: updatedFeatures});
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...editingProduct.images];
    updatedImages[index] = value;
    setEditingProduct({...editingProduct, images: updatedImages});
  };

  const addImage = () => {
    setEditingProduct({
      ...editingProduct,
      images: [...editingProduct.images, '']
    });
  };

  const removeImage = (index) => {
    const updatedImages = [...editingProduct.images];
    updatedImages.splice(index, 1);
    setEditingProduct({...editingProduct, images: updatedImages});
  };

  const handleNewImageChange = (index, value) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = value;
    setNewProduct({...newProduct, images: updatedImages});
  };

  const addNewImage = () => {
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, '']
    });
  };

  const removeNewImage = (index) => {
    const updatedImages = [...newProduct.images];
    updatedImages.splice(index, 1);
    setNewProduct({...newProduct, images: updatedImages});
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Manage Products</h2>

      <div className="mb-4">
        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Visibility</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((product) => (
              <tr key={product.id} className="border-b border-gray-200">
                <td className="py-2 px-4">{product.id}</td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.price}</td>
                <td className="py-2 px-4">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-blue-600 mr-2 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
      >
        {editingProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Short Description</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={editingProduct.shortDescription}
                onChange={(e) => setEditingProduct({...editingProduct, shortDescription: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Full Description</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Main Image URL</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={editingProduct.image}
                onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-gray-700 mb-1">Product Images</label>
                <button
                  type="button"
                  onClick={addImage}
                  className="text-blue-600 text-sm"
                >
                  + Add Image
                </button>
              </div>

              {editingProduct.images.map((image, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="ml-2 text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-gray-700 mb-1">Product Features</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-600 text-sm"
                >
                  + Add Feature
                </button>
              </div>

              {editingProduct.features.map((feature, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Care Instructions</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                value={editingProduct.careInstructions}
                onChange={(e) => setEditingProduct({...editingProduct, careInstructions: e.target.value})}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Product Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        {productToDelete && (
          <div>
            <p className="mb-4">Are you sure you want to delete the product "{productToDelete.name}"?</p>
            <p className="mb-6 text-red-600">This action cannot be undone.</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Price</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Short Description</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={newProduct.shortDescription}
              onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Full Description</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 h-24"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Main Image URL</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={newProduct.image}
              onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-gray-700 mb-1">Product Images</label>
              <button
                type="button"
                onClick={addNewImage}
                className="text-blue-600 text-sm"
              >
                + Add Image
              </button>
            </div>

            {newProduct.images.map((image, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={image}
                  onChange={(e) => handleNewImageChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="ml-2 text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-gray-700 mb-1">Product Features</label>
              <button
                type="button"
                onClick={addNewFeature}
                className="text-blue-600 text-sm"
              >
                + Add Feature
              </button>
            </div>

            {newProduct.features.map((feature, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={feature}
                  onChange={(e) => handleNewFeatureChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeNewFeature(index)}
                  className="ml-2 text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Care Instructions</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 h-20"
              value={newProduct.careInstructions}
              onChange={(e) => setNewProduct({...newProduct, careInstructions: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Product
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// About Page Management
const AboutSection = () => {
  const { artisan, updateArtisanInfo } = useWebsite();
  const [artisanInfo, setArtisanInfo] = useState(artisan);

  const handleSaveArtisanInfo = () => {
    updateArtisanInfo(artisanInfo);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Manage About Page</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Artisan Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={artisanInfo.name}
              onChange={(e) => setArtisanInfo({...artisanInfo, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={artisanInfo.title}
              onChange={(e) => setArtisanInfo({...artisanInfo, title: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Bio</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 h-32"
            value={artisanInfo.bio}
            onChange={(e) => setArtisanInfo({...artisanInfo, bio: e.target.value})}
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Philosophy</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 h-20"
            value={artisanInfo.philosophy}
            onChange={(e) => setArtisanInfo({...artisanInfo, philosophy: e.target.value})}
          ></textarea>
        </div>

        <button
          onClick={handleSaveArtisanInfo}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Contact Page Management
const ContactSection = () => {
  const { contactInfo, updateContactInfo } = useWebsite();
  const [contactData, setContactData] = useState(contactInfo);

  const handleSaveContact = () => {
    updateContactInfo(contactData);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Manage Contact Page</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={contactData.email}
              onChange={(e) => setContactData({...contactData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={contactData.phone}
              onChange={(e) => setContactData({...contactData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Business Address</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 h-20"
            value={contactData.address}
            onChange={(e) => setContactData({...contactData, address: e.target.value})}
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1">Business Hours</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 h-20"
            value={contactData.hours}
            onChange={(e) => setContactData({...contactData, hours: e.target.value})}
          ></textarea>
        </div>

        <button
          onClick={handleSaveContact}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Testimonials Management
const TestimonialsSection = () => {
  const {
    testimonials,
    updateTestimonial,
    addTestimonial,
    deleteTestimonial
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
    image: ''
  });

  // Update local state when context testimonials change
  React.useEffect(() => {
    setTestimonialsList(testimonials);
  }, [testimonials]);

  const handleEditClick = (testimonial) => {
    setEditingTestimonial({...testimonial});
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
      image: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = () => {
    updateTestimonial(editingTestimonial.id, editingTestimonial);
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

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Manage Testimonials</h2>

      <div className="mb-4">
        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200"
        >
          Add New Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonialsList.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeIn 0.5s ease-out forwards'
            }}
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{testimonial.testimonial}</p>
            <div className="flex justify-end">
              <button
                onClick={() => handleEditClick(testimonial)}
                className="text-blue-600 mr-2 hover:text-blue-800 transition-colors duration-150"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(testimonial)}
                className="text-red-600 hover:text-red-800 transition-colors duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Testimonial Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Testimonial"
      >
        {editingTestimonial && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                  value={editingTestimonial.location}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, location: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                value={editingTestimonial.image}
                onChange={(e) => setEditingTestimonial({...editingTestimonial, image: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Testimonial</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 h-32 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                value={editingTestimonial.testimonial}
                onChange={(e) => setEditingTestimonial({...editingTestimonial, testimonial: e.target.value})}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-150"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Testimonial Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        {testimonialToDelete && (
          <div>
            <p className="mb-4">Are you sure you want to delete the testimonial from "{testimonialToDelete.name}"?</p>
            <p className="mb-6 text-red-600">This action cannot be undone.</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Testimonial Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Testimonial"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Location</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                value={newTestimonial.location}
                onChange={(e) => setNewTestimonial({...newTestimonial, location: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              value={newTestimonial.image}
              onChange={(e) => setNewTestimonial({...newTestimonial, image: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Testimonial</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 h-32 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              value={newTestimonial.testimonial}
              onChange={(e) => setNewTestimonial({...newTestimonial, testimonial: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTestimonial}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-150"
            >
              Add Testimonial
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Theme Colors Management
const ColorsSection = () => {
  const { colorPalette, updateColorPalette } = useWebsite();
  const [colors, setColors] = useState(colorPalette);

  const handleSaveColors = () => {
    updateColorPalette(colors);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Manage Theme Colors</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md">
          <h3 className="font-medium mb-3">Primary Colors</h3>

          <TailwindColorPicker
            label="Base Color"
            value={colors.primary.base}
            onChange={(value) => setColors({
              ...colors,
              primary: {...colors.primary, base: value}
            })}
          />

          <TailwindColorPicker
            label="Light Color"
            value={colors.primary.light}
            onChange={(value) => setColors({
              ...colors,
              primary: {...colors.primary, light: value}
            })}
          />

          <TailwindColorPicker
            label="Dark Color"
            value={colors.primary.dark}
            onChange={(value) => setColors({
              ...colors,
              primary: {...colors.primary, dark: value}
            })}
          />

          <TailwindColorPicker
            label="Hover Color"
            value={colors.primary.hover}
            onChange={(value) => setColors({
              ...colors,
              primary: {...colors.primary, hover: value}
            })}
          />

          <TailwindColorPicker
            label="Lightest Color"
            value={colors.primary.lightest}
            onChange={(value) => setColors({
              ...colors,
              primary: {...colors.primary, lightest: value}
            })}
          />

          <TailwindColorPicker
            label="Background Color"
            value={colors.primary.background}
            onChange={(value) => setColors({
              ...colors,
              primary: {...colors.primary, background: value}
            })}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md">
          <h3 className="font-medium mb-3">Secondary Colors</h3>

          <TailwindColorPicker
            label="Base Color"
            value={colors.secondary.base}
            onChange={(value) => setColors({
              ...colors,
              secondary: {...colors.secondary, base: value}
            })}
          />

          <TailwindColorPicker
            label="Light Color"
            value={colors.secondary.light}
            onChange={(value) => setColors({
              ...colors,
              secondary: {...colors.secondary, light: value}
            })}
          />

          <TailwindColorPicker
            label="Dark Color"
            value={colors.secondary.dark}
            onChange={(value) => setColors({
              ...colors,
              secondary: {...colors.secondary, dark: value}
            })}
          />

          <TailwindColorPicker
            label="Background Color"
            value={colors.secondary.background}
            onChange={(value) => setColors({
              ...colors,
              secondary: {...colors.secondary, background: value}
            })}
          />

          <TailwindColorPicker
            label="Lightest Color"
            value={colors.secondary.lightest}
            onChange={(value) => setColors({
              ...colors,
              secondary: {...colors.secondary, lightest: value}
            })}
          />
        </div>
      </div>

      <div className="mt-6 border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md">
        <h3 className="font-medium mb-3">Text Colors</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TailwindColorPicker
            label="Primary Text"
            value={colors.text.primary}
            onChange={(value) => setColors({
              ...colors,
              text: {...colors.text, primary: value}
            })}
          />

          <TailwindColorPicker
            label="Secondary Text"
            value={colors.text.secondary}
            onChange={(value) => setColors({
              ...colors,
              text: {...colors.text, secondary: value}
            })}
          />

          <TailwindColorPicker
            label="Light Text"
            value={colors.text.light}
            onChange={(value) => setColors({
              ...colors,
              text: {...colors.text, light: value}
            })}
          />

          <TailwindColorPicker
            label="Accent Text"
            value={colors.text.accent}
            onChange={(value) => setColors({
              ...colors,
              text: {...colors.text, accent: value}
            })}
          />

          <TailwindColorPicker
            label="Medium Text"
            value={colors.text.medium}
            onChange={(value) => setColors({
              ...colors,
              text: {...colors.text, medium: value}
            })}
          />

          <TailwindColorPicker
            label="Dark Text"
            value={colors.text.dark}
            onChange={(value) => setColors({
              ...colors,
              text: {...colors.text, dark: value}
            })}
          />
        </div>
      </div>

      <div className="mt-6 border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md">
        <h3 className="font-medium mb-3">UI Colors</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TailwindColorPicker
            label="Border Color"
            value={colors.ui.border}
            onChange={(value) => setColors({
              ...colors,
              ui: {...colors.ui, border: value}
            })}
          />

          <TailwindColorPicker
            label="Shadow Color"
            value={colors.ui.shadow}
            onChange={(value) => setColors({
              ...colors,
              ui: {...colors.ui, shadow: value}
            })}
          />

          <TailwindColorPicker
            label="Background"
            value={colors.ui.background}
            onChange={(value) => setColors({
              ...colors,
              ui: {...colors.ui, background: value}
            })}
          />

          <TailwindColorPicker
            label="Dark Background"
            value={colors.ui.darkBackground}
            onChange={(value) => setColors({
              ...colors,
              ui: {...colors.ui, darkBackground: value}
            })}
          />

          <TailwindColorPicker
            label="Light Background"
            value={colors.ui.lightBackground}
            onChange={(value) => setColors({
              ...colors,
              ui: {...colors.ui, lightBackground: value}
            })}
          />
        </div>
      </div>

      <button
        onClick={handleSaveColors}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
      >
        Save Color Changes
      </button>
    </div>
  );
};

// Orders Management
const OrdersSection = () => {
  const { orders } = useWebsite();
  const [ordersList, setOrdersList] = useState(orders.length ? orders : [
    { id: 1001, customer: "John Smith", date: "2023-03-01", status: "Completed", total: "$215.00" },
    { id: 1002, customer: "Emily Johnson", date: "2023-03-02", status: "Processing", total: "$95.00" },
    { id: 1003, customer: "Michael Brown", date: "2023-03-03", status: "Shipped", total: "$120.00" },
  ]);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // Update local state when context orders change
  React.useEffect(() => {
    if (orders.length) {
      setOrdersList(orders);
    }
  }, [orders]);

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setIsViewModalOpen(true);
  };

  const handleUpdateClick = (order) => {
    setUpdatingOrder({...order});
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = () => {
    // Update order in our local state since we don't have a context function for this yet
    const updatedOrders = ordersList.map(order =>
      order.id === updatingOrder.id ? updatingOrder : order
    );
    setOrdersList(updatedOrders);
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>

      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Customer</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.map((order, index) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 transition-colors duration-150 hover:bg-gray-50"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 0.3s ease-out forwards',
                  opacity: 0
                }}
              >
                <td className="py-2 px-4">#{order.id}</td>
                <td className="py-2 px-4">{order.customer}</td>
                <td className="py-2 px-4">{order.date}</td>
                <td className="py-2 px-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-4">{order.total}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-blue-600 mr-2 hover:text-blue-800 transition-colors duration-150"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUpdateClick(order)}
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-150"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Order Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Order #${viewingOrder?.id}`}
      >
        {viewingOrder && (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <p><span className="font-medium">Name:</span> {viewingOrder.customer}</p>
              <p><span className="font-medium">Date:</span> {viewingOrder.date}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Order Details</h3>
              <p><span className="font-medium">Status:</span> {viewingOrder.status}</p>
              <p><span className="font-medium">Total:</span> {viewingOrder.total}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Items</h3>
              <p className="text-gray-600 italic">Mock order items would be displayed here</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-150"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Order Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Order Status"
      >
        {updatingOrder && (
          <div className="space-y-4">
            <p>Update status for order #{updatingOrder.id} from {updatingOrder.customer}</p>

            <div>
              <label className="block text-gray-700 mb-1">Order Status</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                value={updatingOrder.status}
                onChange={(e) => setUpdatingOrder({...updatingOrder, status: e.target.value})}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-150"
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPage;
