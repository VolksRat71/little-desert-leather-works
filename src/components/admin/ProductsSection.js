import React, { useState, useEffect } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import Modal from '../Modal';

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
    images: [''],
    features: [''],
    careInstructions: '',
    isVisible: true
  });

  // Update local state when context products change
  useEffect(() => {
    setProductsList(products);
  }, [products]);

  const handleEditClick = (product) => {
    setEditingProduct({...product, isVisible: product.isVisible !== false});
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
      careInstructions: '',
      isVisible: true
    });
    setIsAddModalOpen(true);
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditingProduct({
        ...editingProduct,
        image: imageUrl,
        imageFile: file
      });
    }
  };

  const handleNewMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({
        ...newProduct,
        image: imageUrl,
        imageFile: file
      });
    }
  };

  const handleAdditionalImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedImages = [...editingProduct.images];
      updatedImages[index] = imageUrl;
      setEditingProduct({...editingProduct, images: updatedImages});
    }
  };

  const handleNewAdditionalImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedImages = [...newProduct.images];
      updatedImages[index] = imageUrl;
      setNewProduct({...newProduct, images: updatedImages});
    }
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
      <h2 className="text-xl font-semibold mb-4">Product Management</h2>
      <div className="mb-6">
        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300"
        >
          Add New Product
        </button>
      </div>

      <div className="overflow-x-auto shadow-sm rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Visibility</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.shortDescription}</div>
                  </div>
                </td>
                <td className="py-3 px-4">{product.price}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.isVisible === false
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.isVisible === false ? 'Hidden' : 'Visible'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
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
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Product">
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={editingProduct?.name || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Short Description</label>
            <input
              type="text"
              value={editingProduct?.shortDescription || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Full Description</label>
            <textarea
              value={editingProduct?.description || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="w-full p-2 border rounded h-32"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="text"
              value={editingProduct?.price || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={editingProduct?.isVisible !== false}
                onChange={(e) => setEditingProduct({ ...editingProduct, isVisible: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">
                {editingProduct?.isVisible !== false ? 'Product is visible' : 'Product is hidden'}
              </span>
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Main Image</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                id="main-image-upload"
                className="hidden"
                onChange={handleMainImageUpload}
              />
              <label
                htmlFor="main-image-upload"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
              >
                Choose Image
              </label>
              <input
                type="text"
                value={editingProduct?.image || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                placeholder="Or enter image URL"
                className="flex-grow p-2 border rounded"
              />
            </div>
            {editingProduct?.image && (
              <div className="mt-2 relative inline-block">
                <img
                  src={editingProduct.image}
                  alt="Main product"
                  className="h-20 w-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Features</label>
            {editingProduct?.features.map((feature, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-grow p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="ml-2 bg-red-500 text-white px-3 rounded"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Feature
            </button>
          </div>

          <div>
            <label className="block mb-1 font-medium">Image URLs</label>
            {editingProduct?.images.map((image, index) => (
              <div key={index} className="flex items-center mb-3">
                <div className="flex-grow flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    id={`image-upload-${index}`}
                    className="hidden"
                    onChange={(e) => handleAdditionalImageUpload(index, e)}
                  />
                  <label
                    htmlFor={`image-upload-${index}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm cursor-pointer"
                  >
                    Upload
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-grow p-2 border rounded"
                    placeholder="Image URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="ml-2 bg-red-500 text-white px-3 rounded"
                >
                  -
                </button>
                {image && (
                  <div className="ml-2 relative">
                    <img
                      src={image}
                      alt={`Product ${index}`}
                      className="h-10 w-10 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Image
            </button>
          </div>

          <div>
            <label className="block mb-1 font-medium">Care Instructions</label>
            <textarea
              value={editingProduct?.careInstructions || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, careInstructions: e.target.value })}
              className="w-full p-2 border rounded h-20"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
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
      </Modal>

      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product">
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Short Description</label>
            <input
              type="text"
              value={newProduct.shortDescription}
              onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Full Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full p-2 border rounded h-32"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="text"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={newProduct.isVisible !== false}
                onChange={(e) => setNewProduct({ ...newProduct, isVisible: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">
                {newProduct.isVisible !== false ? 'Product is visible' : 'Product is hidden'}
              </span>
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Main Image</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                id="new-main-image-upload"
                className="hidden"
                onChange={handleNewMainImageUpload}
              />
              <label
                htmlFor="new-main-image-upload"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
              >
                Choose Image
              </label>
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                placeholder="Or enter image URL"
                className="flex-grow p-2 border rounded"
              />
            </div>
            {newProduct.image && (
              <div className="mt-2 relative inline-block">
                <img
                  src={newProduct.image}
                  alt="Main product"
                  className="h-20 w-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => setNewProduct({ ...newProduct, image: '' })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Features</label>
            {newProduct.features.map((feature, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleNewFeatureChange(index, e.target.value)}
                  className="flex-grow p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeNewFeature(index)}
                  className="ml-2 bg-red-500 text-white px-3 rounded"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNewFeature}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Feature
            </button>
          </div>

          <div>
            <label className="block mb-1 font-medium">Image URLs</label>
            {newProduct.images.map((image, index) => (
              <div key={index} className="flex items-center mb-3">
                <div className="flex-grow flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    id={`new-image-upload-${index}`}
                    className="hidden"
                    onChange={(e) => handleNewAdditionalImageUpload(index, e)}
                  />
                  <label
                    htmlFor={`new-image-upload-${index}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm cursor-pointer"
                  >
                    Upload
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleNewImageChange(index, e.target.value)}
                    className="flex-grow p-2 border rounded"
                    placeholder="Image URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="ml-2 bg-red-500 text-white px-3 rounded"
                >
                  -
                </button>
                {image && (
                  <div className="ml-2 relative">
                    <img
                      src={image}
                      alt={`Product ${index}`}
                      className="h-10 w-10 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addNewImage}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Image
            </button>
          </div>

          <div>
            <label className="block mb-1 font-medium">Care Instructions</label>
            <textarea
              value={newProduct.careInstructions}
              onChange={(e) => setNewProduct({ ...newProduct, careInstructions: e.target.value })}
              className="w-full p-2 border rounded h-20"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
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

      {/* Delete Product Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        {productToDelete && (
          <div>
            <p className="mb-4">Are you sure you want to delete the product "{productToDelete.name}"?</p>
            <p className="text-red-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Product
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductsSection;
