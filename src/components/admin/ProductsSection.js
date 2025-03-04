import React, { useState, useEffect } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import Modal from '../Modal';
import EllipsisMenu from '../EllipsisMenu';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from '../../validators/schema';

const ProductsSection = () => {
  const {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    isLoading,
    errors
  } = useWebsite();

  const [productsList, setProductsList] = useState(products);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productImages, setProductImages] = useState({ main: null, additional: [] });
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Setup react-hook-form for adding products
  const { register: registerAdd, handleSubmit: handleAddSubmit, formState: { errors: addErrors }, control: addControl, reset: resetAddForm } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      description: '',
      price: '',
      image: '',
      images: [''],
      features: [''],
      careInstructions: '',
      isVisible: true
    }
  });

  // Setup field arrays for adding products
  const { fields: addFeatureFields, append: appendAddFeature, remove: removeAddFeature } = useFieldArray({
    control: addControl,
    name: 'features'
  });

  const { fields: addImageFields, append: appendAddImage, remove: removeAddImage } = useFieldArray({
    control: addControl,
    name: 'images'
  });

  // Setup react-hook-form for editing products
  const { register: registerEdit, handleSubmit: handleEditSubmit, formState: { errors: editErrors }, control: editControl, reset: resetEditForm } = useForm({
    resolver: yupResolver(productSchema)
  });

  // Setup field arrays for editing products
  const { fields: editFeatureFields, append: appendEditFeature, remove: removeEditFeature } = useFieldArray({
    control: editControl,
    name: 'features'
  });

  const { fields: editImageFields, append: appendEditImage, remove: removeEditImage } = useFieldArray({
    control: editControl,
    name: 'images'
  });

  // Update local state when context products change
  useEffect(() => {
    setProductsList(products);
  }, [products]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
    // Set form default values for editing
    resetEditForm({
      ...product
    });
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
    resetAddForm();
  };

  const handleMainImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImages({ ...productImages, main: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageUpload = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...productImages.additional];
        newImages[index] = e.target.result;
        setProductImages({ ...productImages, additional: newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const onAddProduct = async (data) => {
    try {
      setLocalLoading(true);
      setLocalError(null);

      // Add image data from upload if available
      if (productImages.main) {
        data.image = productImages.main;
      }
      if (productImages.additional.length > 0) {
        data.images = productImages.additional.filter(img => img);
      }

      await addProduct(data);
      setIsAddModalOpen(false);
      resetAddForm();
      setProductImages({ main: null, additional: [] });
    } catch (error) {
      setLocalError('Failed to add product. Please try again.');
      console.error('Error adding product:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const onEditProduct = async (data) => {
    try {
      setLocalLoading(true);
      setLocalError(null);

      // Add image data from upload if available
      if (productImages.main) {
        data.image = productImages.main;
      }
      if (productImages.additional.length > 0 && productImages.additional.some(img => img)) {
        data.images = productImages.additional.filter(img => img);
      }

      const updatedProduct = {
        ...editingProduct,
        ...data,
        id: editingProduct.id
      };

      await updateProduct(updatedProduct);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setProductImages({ main: null, additional: [] });
    } catch (error) {
      setLocalError('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLocalLoading(true);
      setLocalError(null);

      await deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      setLocalError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', error);
    } finally {
      setLocalLoading(false);
    }
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
                  <EllipsisMenu
                    position="left"
                    actions={[
                      {
                        label: 'Edit',
                        onClick: () => handleEditClick(product),
                        className: 'text-blue-600 hover:text-blue-800'
                      },
                      {
                        label: 'Delete',
                        onClick: () => handleDeleteClick(product),
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

      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product">
        <form onSubmit={handleAddSubmit(onAddProduct)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              {...registerAdd('name')}
              className={`w-full p-2 border ${addErrors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {addErrors.name && <p className="mt-1 text-red-500 text-sm">{addErrors.name.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Short Description</label>
            <input
              type="text"
              {...registerAdd('shortDescription')}
              className={`w-full p-2 border ${addErrors.shortDescription ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {addErrors.shortDescription && <p className="mt-1 text-red-500 text-sm">{addErrors.shortDescription.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Full Description</label>
            <textarea
              {...registerAdd('description')}
              className={`w-full p-2 border ${addErrors.description ? 'border-red-500' : 'border-gray-300'} rounded h-32`}
            ></textarea>
            {addErrors.description && <p className="mt-1 text-red-500 text-sm">{addErrors.description.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="text"
              placeholder="$XX.XX"
              {...registerAdd('price')}
              className={`w-full p-2 border ${addErrors.price ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {addErrors.price && <p className="mt-1 text-red-500 text-sm">{addErrors.price.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Main Image</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Image URL or upload"
                {...registerAdd('image')}
                className={`flex-grow p-2 border ${addErrors.image ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              <input
                type="file"
                id="mainImage"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
              <label
                htmlFor="mainImage"
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors"
              >
                Upload
              </label>
            </div>
            {addErrors.image && <p className="mt-1 text-red-500 text-sm">{addErrors.image.message}</p>}
            {productImages.main && (
              <div className="mt-2">
                <img src={productImages.main} alt="Preview" className="h-16 w-16 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium">Additional Images</label>
              <button
                type="button"
                onClick={() => appendAddImage('')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Image
              </button>
            </div>

            {addImageFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  {...registerAdd(`images.${index}`)}
                  className="flex-grow p-2 border border-gray-300 rounded"
                />
                <input
                  type="file"
                  id={`additionalImage${index}`}
                  accept="image/*"
                  onChange={(e) => handleAdditionalImageUpload(index, e)}
                  className="hidden"
                />
                <label
                  htmlFor={`additionalImage${index}`}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors flex-shrink-0"
                >
                  Upload
                </label>
                <button
                  type="button"
                  onClick={() => removeAddImage(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium">Features</label>
              <button
                type="button"
                onClick={() => appendAddFeature('')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Feature
              </button>
            </div>

            {addFeatureFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Product feature"
                  {...registerAdd(`features.${index}`)}
                  className="flex-grow p-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeAddFeature(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-1 font-medium">Care Instructions</label>
            <textarea
              {...registerAdd('careInstructions')}
              className="w-full p-2 border border-gray-300 rounded h-24"
              placeholder="Care and cleaning instructions"
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVisible"
              {...registerAdd('isVisible')}
            />
            <label htmlFor="isVisible">Visible on site</label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal - similar structure with registerEdit, editErrors, etc. */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Product">
        <form onSubmit={handleEditSubmit(onEditProduct)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              {...registerEdit('name')}
              className={`w-full p-2 border ${editErrors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {editErrors.name && <p className="mt-1 text-red-500 text-sm">{editErrors.name.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Short Description</label>
            <input
              type="text"
              {...registerEdit('shortDescription')}
              className={`w-full p-2 border ${editErrors.shortDescription ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {editErrors.shortDescription && <p className="mt-1 text-red-500 text-sm">{editErrors.shortDescription.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Full Description</label>
            <textarea
              {...registerEdit('description')}
              className={`w-full p-2 border ${editErrors.description ? 'border-red-500' : 'border-gray-300'} rounded h-32`}
            ></textarea>
            {editErrors.description && <p className="mt-1 text-red-500 text-sm">{editErrors.description.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="text"
              placeholder="$XX.XX"
              {...registerEdit('price')}
              className={`w-full p-2 border ${editErrors.price ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {editErrors.price && <p className="mt-1 text-red-500 text-sm">{editErrors.price.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Main Image</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Image URL or upload"
                {...registerEdit('image')}
                className={`flex-grow p-2 border ${editErrors.image ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              <input
                type="file"
                id="editMainImage"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
              <label
                htmlFor="editMainImage"
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors"
              >
                Upload
              </label>
            </div>
            {editErrors.image && <p className="mt-1 text-red-500 text-sm">{editErrors.image.message}</p>}
            {productImages.main && (
              <div className="mt-2">
                <img src={productImages.main} alt="Preview" className="h-16 w-16 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium">Additional Images</label>
              <button
                type="button"
                onClick={() => appendEditImage('')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Image
              </button>
            </div>

            {editImageFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  {...registerEdit(`images.${index}`)}
                  className="flex-grow p-2 border border-gray-300 rounded"
                />
                <input
                  type="file"
                  id={`editAdditionalImage${index}`}
                  accept="image/*"
                  onChange={(e) => handleAdditionalImageUpload(index, e)}
                  className="hidden"
                />
                <label
                  htmlFor={`editAdditionalImage${index}`}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors flex-shrink-0"
                >
                  Upload
                </label>
                <button
                  type="button"
                  onClick={() => removeEditImage(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium">Features</label>
              <button
                type="button"
                onClick={() => appendEditFeature('')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Feature
              </button>
            </div>

            {editFeatureFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Product feature"
                  {...registerEdit(`features.${index}`)}
                  className="flex-grow p-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeEditFeature(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-1 font-medium">Care Instructions</label>
            <textarea
              {...registerEdit('careInstructions')}
              className="w-full p-2 border border-gray-300 rounded h-24"
              placeholder="Care and cleaning instructions"
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editIsVisible"
              {...registerEdit('isVisible')}
            />
            <label htmlFor="editIsVisible">Visible on site</label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
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
