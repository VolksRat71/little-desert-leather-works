import React, { useState, useRef, useEffect } from 'react';
import { useWebsite, colorPalette, useDocumentTitle } from '../context/WebsiteContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema, testimonialSchema } from '../validators/schema';

const UserPage = () => {
  const {
    colorPalette,
    updateUser,
    orders,
    campaigns,
    addTestimonial,
    cart
  } = useWebsite();

  const { currentUser: authUser, updateProfile } = useAuth();

  // Use the authenticated user from AuthContext instead of the first user from WebsiteContext
  const [currentUser, setCurrentUser] = useState(authUser || {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Austin, TX 78701',
    profileImage: 'https://placehold.co/200x200/amber700/ffffff?text=JD',
    role: 'User',
    marketingPreferences: {
      emailOffers: true,
      textOffers: false,
      orderUpdates: true
    }
  });

  // User edit state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({...currentUser});
  const profileImageRef = useRef(null);

  // Setup react-hook-form with yup resolver
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: currentUser
  });

  // Tab state
  const [activeCategory, setActiveCategory] = useState('account');
  const [activeTab, setActiveTab] = useState('profile');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  // Testimonial state
  const [isAddTestimonialOpen, setIsAddTestimonialOpen] = useState(false);

  // Setup react-hook-form for testimonials
  const {
    register: registerTestimonial,
    handleSubmit: handleTestimonialSubmit,
    formState: { errors: testimonialErrors },
    reset: resetTestimonialForm,
    watch
  } = useForm({
    resolver: yupResolver(testimonialSchema),
    defaultValues: {
      author: currentUser?.name || '',
      content: '',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      isVisible: true
    }
  });

  // Update user state when auth context changes
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
      setEditedUser(authUser);
    }
  }, [authUser]);

  // Update form values when user changes
  useEffect(() => {
    if (isEditProfileOpen) {
      reset(currentUser);
    }
  }, [isEditProfileOpen, currentUser, reset]);

  // Update testimonial form when user changes
  useEffect(() => {
    if (currentUser) {
      resetTestimonialForm(form => ({
        ...form,
        author: currentUser.name
      }));
    }
  }, [currentUser, resetTestimonialForm]);

  // Set document title
  useDocumentTitle('My Account');

  // Categories and tabs configuration
  const categories = [
    {
      id: 'account',
      label: 'Account',
      tabs: [
        { id: 'profile', label: 'Profile' },
        { id: 'testimonials', label: 'Testimonials' },
      ]
    },
    {
      id: 'shopping',
      label: 'Shopping',
      tabs: [
        { id: 'orders', label: 'Orders' },
        { id: 'cart', label: 'Shopping Cart' },
        { id: 'coupons', label: 'My Coupons' },
      ]
    }
  ];

  // Find current category based on active tab
  const getCurrentCategory = (tabId) => {
    for (const category of categories) {
      if (category.tabs.some(tab => tab.id === tabId)) {
        return category.id;
      }
    }
    return 'account'; // Default
  };

  // Handle tab changes with animation
  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;

    const newCategory = getCurrentCategory(tabId);
    setIsTabTransitioning(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setActiveTab(tabId);
      setActiveCategory(newCategory);
      // Wait a bit then start the entrance animation
      setTimeout(() => {
        setIsTabTransitioning(false);
      }, 50);
    }, 200);
  };

  // Sample orders for current user (would come from database in real app)
  const userOrders = orders?.length > 0
    ? orders.filter(order => order.customer.email === currentUser.email)
    : [
        {
          id: 'ORD-001',
          date: '2023-10-15',
          items: [
            { id: 1, name: 'Handcrafted Leather Wallet', quantity: 1, price: '$95' },
            { id: 2, name: 'Artisan Belt', quantity: 1, price: '$120' }
          ],
          status: 'Delivered',
          total: '$215'
        },
        {
          id: 'ORD-002',
          date: '2023-11-20',
          items: [
            { id: 3, name: 'Desert Messenger Bag', quantity: 1, price: '$275' }
          ],
          status: 'Shipped',
          total: '$275'
        }
      ];

  // Active coupons for this user
  const userCoupons = campaigns?.length > 0
    ? campaigns.filter(campaign =>
        campaign.isActive &&
        (campaign.type === 'site-wide' ||
         (campaign.type === 'targeted' && campaign.targetUserIds.includes(currentUser.id)))
      )
    : [
        {
          id: 1,
          name: 'Spring Sale',
          type: 'site-wide',
          discountType: 'percentage',
          discountValue: 15,
          startDate: '2023-03-01',
          endDate: '2023-04-15',
          isActive: true,
          promoCode: 'SPRING15',
          description: 'Get 15% off your entire purchase!'
        },
        {
          id: 2,
          name: 'Loyal Customer Discount',
          type: 'targeted',
          discountType: 'percentage',
          discountValue: 20,
          startDate: '2023-03-01',
          endDate: '2023-06-30',
          isActive: true,
          promoCode: 'LOYAL20',
          description: 'Special 20% discount for our loyal customers!'
        }
      ];

  // Update profile function that uses AuthContext
  const handleProfileUpdate = (formData) => {
    try {
      // Use the updateProfile function from AuthContext instead of updateUser from WebsiteContext
      updateProfile(formData);
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newProfileImage = event.target.result;
      setEditedUser({ ...editedUser, profileImage: newProfileImage });

      // When image is changed, update the user profile through AuthContext
      if (currentUser) {
        updateProfile({
          ...currentUser,
          profileImage: newProfileImage
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTestimonial = (data) => {
    addTestimonial(data);
    setIsAddTestimonialOpen(false);
    resetTestimonialForm();

    // Switch to testimonials tab to see the new testimonial
    handleTabChange('testimonials');
  };

  const handleMarketingPreferenceChange = (field, value) => {
    const updatedMarketingPreferences = {
      ...editedUser.marketingPreferences,
      [field]: value
    };

    setEditedUser({
      ...editedUser,
      marketingPreferences: updatedMarketingPreferences
    });

    // Update the user profile through AuthContext
    if (currentUser) {
      updateProfile({
        ...currentUser,
        marketingPreferences: updatedMarketingPreferences
      });
    }
  };

  // Function to get the status color for orders
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-16 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-${colorPalette.text.primary}`}>
            My Account
          </h1>
          <p className={`text-${colorPalette.text.secondary} mt-2`}>
            Manage your profile, orders, and more
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                if (category.id !== activeCategory) {
                  const firstTabInCategory = category.tabs[0].id;
                  handleTabChange(firstTabInCategory);
                }
              }}
              className={`px-5 py-2 mr-2 mb-2 rounded-t-lg transition-all duration-300 ease-in-out ${
                activeCategory === category.id
                  ? `bg-${colorPalette.primary.base} text-white font-medium`
                  : `bg-gray-100 text-${colorPalette.text.secondary} hover:bg-gray-200`
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Tab Navigation for current category */}
        <div className="flex flex-wrap mb-6 border-b border-gray-200">
          {categories
            .find(cat => cat.id === activeCategory)
            .tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 mr-2 transition-all duration-300 ease-in-out relative ${
                  activeTab === tab.id
                    ? `text-${colorPalette.primary.base} font-medium`
                    : `text-${colorPalette.text.secondary} hover:text-${colorPalette.primary.base}`
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-${colorPalette.primary.base} transform transition-transform duration-300 scale-x-100`}></span>
                )}
              </button>
            ))}
        </div>

        {/* Content Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className={`transition-all duration-200 ease-in-out ${isTabTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-fadeIn">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-6 md:mb-0 md:pr-4 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-amber-100">
                      <img
                        src={currentUser.profileImage || 'https://placehold.co/200x200/amber700/ffffff?text=User'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => setIsEditProfileOpen(true)}
                      className={`px-4 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.hover} transition-colors`}
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="md:w-2/3">
                    <h2 className="text-xl font-semibold mb-4">{currentUser.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 mb-1">Email</p>
                        <p className="font-medium">{currentUser.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Phone</p>
                        <p className="font-medium">{currentUser.phone || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600 mb-1">Address</p>
                        <p className="font-medium">{currentUser.address || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Communication Preferences</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailOffers"
                            checked={currentUser.marketingPreferences?.emailOffers}
                            readOnly
                            className="mr-2"
                          />
                          <label htmlFor="emailOffers">Email Offers</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="textOffers"
                            checked={currentUser.marketingPreferences?.textOffers}
                            readOnly
                            className="mr-2"
                          />
                          <label htmlFor="textOffers">Text Offers</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="orderUpdates"
                            checked={currentUser.marketingPreferences?.orderUpdates}
                            readOnly
                            className="mr-2"
                          />
                          <label htmlFor="orderUpdates">Order Updates</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                {userOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 text-left border-b">Order ID</th>
                          <th className="py-2 px-4 text-left border-b">Date</th>
                          <th className="py-2 px-4 text-left border-b">Status</th>
                          <th className="py-2 px-4 text-left border-b">Total</th>
                          <th className="py-2 px-4 text-left border-b">Items</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{order.id}</td>
                            <td className="py-3 px-4">{order.date}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">{order.total}</td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                {order.items.map((item, idx) => (
                                  <span key={idx} className="text-sm">
                                    {item.quantity}x {item.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    You haven't placed any orders yet.
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4">My Shopping Cart</h2>
                {cart && cart.length > 0 ? (
                  <div>
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center py-4 border-b">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.price} x {item.quantity}</p>
                        </div>
                        <div className="font-bold">
                          ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 text-right">
                      <p className="text-lg font-bold">
                        Total: ${cart.reduce((total, item) => total + parseFloat(item.price.replace('$', '')) * item.quantity, 0).toFixed(2)}
                      </p>
                      <button
                        className={`mt-4 px-6 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.hover} transition-colors`}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Your cart is empty.
                  </div>
                )}
              </div>
            )}

            {/* Coupons Tab */}
            {activeTab === 'coupons' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4">My Coupons</h2>
                {userCoupons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userCoupons.map((coupon) => (
                      <div key={coupon.id} className={`border border-${colorPalette.primary.lightest} bg-${colorPalette.primary.lightest} p-4 rounded-lg relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16">
                          <div className={`bg-${colorPalette.primary.base} text-white text-xs font-bold px-2 py-1 transform rotate-45 translate-x-2 translate-y-2 shadow`}>
                            {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '$'} OFF
                          </div>
                        </div>
                        <h3 className="text-lg font-bold">{coupon.name}</h3>
                        <p className="text-gray-700 mb-2">{coupon.description}</p>
                        <div className="bg-white px-3 py-2 rounded border border-gray-200 inline-block font-mono font-medium">
                          {coupon.promoCode}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          Valid until: {coupon.endDate}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    You don't have any active coupons.
                  </div>
                )}
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">My Testimonials</h2>
                  <button
                    onClick={() => setIsAddTestimonialOpen(true)}
                    className={`px-4 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.hover} transition-colors`}
                  >
                    Add Testimonial
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-2">Share Your Experience</h3>
                  <p className="text-gray-600">
                    Let us know what you think about our products and services. Your feedback helps us improve and inspires other customers.
                  </p>
                </div>
                <div className="text-center py-8 text-gray-500">
                  You haven't submitted any testimonials yet.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Profile">
          <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={editedUser.profileImage || 'https://placehold.co/200x200/amber700/ffffff?text=User'}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                <button
                  type="button"
                  onClick={() => profileImageRef.current?.click()}
                  className={`absolute bottom-0 right-0 bg-${colorPalette.primary.base} text-white p-1 rounded-full hover:bg-${colorPalette.primary.dark}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={profileImageRef}
                  onChange={handleProfileImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                {...register('name')}
                className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="(XXX) XXX-XXXX"
                className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Address</label>
              <textarea
                {...register('address')}
                className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded`}
                rows="3"
              ></textarea>
              {errors.address && <p className="mt-1 text-red-500 text-sm">{errors.address.message}</p>}
            </div>

            <div>
              <h3 className="font-medium mb-2">Marketing Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailOffers"
                    {...register('marketingPreferences.emailOffers')}
                    className="mr-2"
                  />
                  <label htmlFor="emailOffers">Email offers and promotions</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="textOffers"
                    {...register('marketingPreferences.textOffers')}
                    className="mr-2"
                  />
                  <label htmlFor="textOffers">Text message offers</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderUpdates"
                    {...register('marketingPreferences.orderUpdates')}
                    className="mr-2"
                  />
                  <label htmlFor="orderUpdates">Order updates and tracking</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded mr-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-${colorPalette.primary.base} text-white px-4 py-2 rounded hover:bg-${colorPalette.primary.dark}`}
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>

        {/* Add Testimonial Modal */}
        <Modal isOpen={isAddTestimonialOpen} onClose={() => setIsAddTestimonialOpen(false)} title="Add Testimonial">
          <form onSubmit={handleTestimonialSubmit(handleAddTestimonial)} className="space-y-4">
            <div>
              <label className={`block text-${colorPalette.text.secondary} mb-2`}>Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="cursor-pointer">
                    <input
                      type="radio"
                      value={star}
                      {...registerTestimonial('rating')}
                      className="sr-only"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-8 h-8 ${
                        star <= parseInt(watch('rating') || 5)
                          ? `text-${colorPalette.secondary.base}`
                          : 'text-gray-300'
                      }`}
                    >
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  </label>
                ))}
              </div>
              {testimonialErrors.rating && <p className="mt-1 text-red-500 text-sm">{testimonialErrors.rating.message}</p>}
            </div>

            <div>
              <label className={`block text-${colorPalette.text.secondary} mb-2`}>Your Feedback</label>
              <textarea
                rows="4"
                {...registerTestimonial('content')}
                className={`w-full px-4 py-2 border ${testimonialErrors.content ? 'border-red-500' : `border-${colorPalette.ui.border}`} rounded focus:outline-none focus:ring-2 focus:ring-${colorPalette.primary.base}`}
                placeholder="Share your experience with our products..."
              ></textarea>
              {testimonialErrors.content && <p className="mt-1 text-red-500 text-sm">{testimonialErrors.content.message}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="publicTestimonial"
                {...registerTestimonial('isVisible')}
                className="mr-2"
              />
              <label htmlFor="publicTestimonial" className={`text-${colorPalette.text.secondary}`}>
                Make my testimonial public
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAddTestimonialOpen(false)}
                className={`px-4 py-2 border border-${colorPalette.ui.border} rounded text-${colorPalette.text.secondary} hover:bg-gray-100`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.dark}`}
              >
                Submit Testimonial
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default UserPage;
