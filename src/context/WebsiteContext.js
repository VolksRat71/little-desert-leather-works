import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Import API functions
import { api } from '../api';

// Create the context
const WebsiteContext = createContext();

// Document title hook
export const useDocumentTitle = (title) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title ? `${title} | Little Desert Leather Works` : 'Little Desert Leather Works';
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export const WebsiteProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // Admin-related state
  const [productsData, setProductsData] = useState([]);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [artisanInfo, setArtisanInfo] = useState(null);
  const [colors, setColors] = useState(null);
  // Track temporary color changes for preview
  const [temporaryColorPalette, setTemporaryColorPalette] = useState(null);
  const [orders, setOrders] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);

  // Cart state
  const [cart, setCart] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Users state
  const [usersData, setUsersData] = useState([]);

  // Marketing campaigns state
  const [campaignsData, setCampaignsData] = useState([]);
  const [activePromoCode, setActivePromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const location = useLocation();
  const navigateFunc = useNavigate();

  // Section visibility settings
  const [sectionsVisibility, setSectionsVisibility] = useState({
    testimonials: true,
    about: true,
    products: true,
    contact: true
  });

  // Add loading and error states
  const [isLoading, setIsLoading] = useState({
    products: false,
    testimonials: false,
    artisan: false,
    users: false,
    campaigns: false,
    contactInfo: false,
    colorPalette: false
  });

  const [errors, setErrors] = useState({
    products: null,
    testimonials: null,
    artisan: null,
    users: null,
    campaigns: null,
    contactInfo: null,
    colorPalette: null
  });

  const updateSectionVisibility = (section, isVisible) => {
    setSectionsVisibility({
      ...sectionsVisibility,
      [section]: isVisible
    });
  };

  // Custom navigate function that includes transition effects
  const navigate = (path) => {
    if (path === location.pathname) return;

    // Scroll to top when navigating
    window.scrollTo(0, 0);

    // Trigger page transition animation
    setPageTransition(true);

    // Wait for the fade-out animation to complete before changing route
    setTimeout(() => {
      // Change route after fade-out is complete
      navigateFunc(path);

      // Allow time for new content to render before fading back in
      setTimeout(() => {
        setPageTransition(false);
      }, 150); // Reduced from 300ms to 150ms for quicker fade-in
    }, 300); // Reduced from 500ms to 300ms for quicker page change

    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Handle scroll for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.pageYOffset;

      // Show/hide navbar based on scroll direction
      if (previousScrollPosition > currentScrollPosition || currentScrollPosition < 50) {
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(false);
      }

      setPreviousScrollPosition(currentScrollPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [previousScrollPosition]);

  // Update state for specific data loading
  const setLoadingState = (key, value) => {
    setIsLoading(prev => ({ ...prev, [key]: value }));
  };

  // Update state for specific data error
  const setErrorState = (key, error) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  // Fetch products data on initial load
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingState('products', true);
      try {
        const data = await api.products.getProducts();
        setProductsData(data);
        setErrorState('products', null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorState('products', 'Failed to load products data');
      } finally {
        setLoadingState('products', false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch testimonials data on initial load
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoadingState('testimonials', true);
      try {
        const data = await api.marketing.getTestimonials();
        setTestimonialsData(data);
        setErrorState('testimonials', null);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setErrorState('testimonials', 'Failed to load testimonials data');
      } finally {
        setLoadingState('testimonials', false);
      }
    };

    fetchTestimonials();
  }, []);

  // Fetch artisan data on initial load
  useEffect(() => {
    const fetchArtisanInfo = async () => {
      setLoadingState('artisan', true);
      try {
        const data = await api.marketing.getArtisanInfo();
        setArtisanInfo(data);
        setErrorState('artisan', null);
      } catch (error) {
        console.error('Error fetching artisan info:', error);
        setErrorState('artisan', 'Failed to load artisan information');
      } finally {
        setLoadingState('artisan', false);
      }
    };

    fetchArtisanInfo();
  }, []);

  // Fetch contact info on initial load
  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoadingState('contactInfo', true);
      try {
        const data = await api.marketing.getContactInfo();
        setContactInfo(data);
        setErrorState('contactInfo', null);
      } catch (error) {
        console.error('Error fetching contact info:', error);
        setErrorState('contactInfo', 'Failed to load contact information');
      } finally {
        setLoadingState('contactInfo', false);
      }
    };

    fetchContactInfo();
  }, []);

  // Fetch color palette on initial load (this should come from an API eventually)
  useEffect(() => {
    const fetchColorPalette = async () => {
      setLoadingState('colorPalette', true);
      try {
        // This would be an API call in the future
        const defaultPalette = {
          primary: {
            base: "desert-orange",      // Bright terracotta/orange from the logo
            light: "desert-terracotta", // Lighter terracotta shade
            dark: "desert-rust",        // Darker terracotta/rust color
            hover: "desert-rust",       // Hover state
            lightest: "desert-tan",     // Tan background from the logo
            background: "stone-50"      // White background for better contrast
          },
          secondary: {
            base: "desert-olive",       // Olive green from the logo
            light: "desert-green",      // Lighter olive green
            dark: "desert-black",       // Very dark color for emphasis
            background: "stone-50",     // White background for better contrast
            lightest: "stone-50"        // Lightest cream color
          },
          text: {
            primary: "desert-black",    // Black text for primary (dark for contrast)
            secondary: "gray-600",   // Gray color for secondary text
            light: "stone-50",          // White text for dark backgrounds (better contrast)
            accent: "desert-rust",      // Darker terracotta for accent text (better contrast)
            medium: "desert-black",     // Black for medium text (better contrast)
            dark: "desert-black",       // Black for strong emphasis
            lightest: "stone-50"        // White text color
          },
          ui: {
            border: "desert-terracotta", // Terracotta border
            shadow: "desert-rust",     // Rust shadow color
            background: "stone-50",    // White background for better contrast
            darkBackground: "desert-black", // Black background for better contrast
            lightBackground: "stone-50", // White background for better contrast
            accent: "desert-orange",   // Bright orange accent
            earthGreen: "desert-olive" // Olive green accent
          }
        };
        setColors(defaultPalette);
        setErrorState('colorPalette', null);
      } catch (error) {
        console.error('Error fetching color palette:', error);
        setErrorState('colorPalette', 'Failed to load color palette');
      } finally {
        setLoadingState('colorPalette', false);
      }
    };

    fetchColorPalette();
  }, []);

  // Admin functions updated to use API
  const updateProduct = async (updatedProduct) => {
    setLoadingState('products', true);
    try {
      // Make sure isVisible is set
      if (updatedProduct.isVisible === undefined) {
        updatedProduct.isVisible = true;
      }

      // Call API to update product
      const result = await api.products.updateProduct(updatedProduct.id, updatedProduct);

      // Update local state with the result from API
      setProductsData(productsData.map(product =>
        product.id === result.id ? result : product
      ));

      setErrorState('products', null);
      return result;
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorState('products', 'Failed to update product');
      throw error;
    } finally {
      setLoadingState('products', false);
    }
  };

  const addProduct = async (newProduct) => {
    setLoadingState('products', true);
    try {
      // Ensure isVisible is set
      if (newProduct.isVisible === undefined) {
        newProduct.isVisible = true;
      }

      // Call API to create product
      const createdProduct = await api.products.createProduct(newProduct);

      // Update local state with the new product
      setProductsData(prev => [...prev, createdProduct]);

      setErrorState('products', null);
      return createdProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorState('products', 'Failed to add product');
      throw error;
    } finally {
      setLoadingState('products', false);
    }
  };

  const deleteProduct = async (productId) => {
    setLoadingState('products', true);
    try {
      // Call API to delete product
      await api.products.deleteProduct(productId);

      // Update local state
      setProductsData(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );

      setErrorState('products', null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorState('products', 'Failed to delete product');
      throw error;
    } finally {
      setLoadingState('products', false);
    }
  };

  const updateTestimonial = async (updatedTestimonial) => {
    setLoadingState('testimonials', true);
    try {
      // Make sure isVisible is set
      if (updatedTestimonial.isVisible === undefined) {
        updatedTestimonial.isVisible = true;
      }

      // Call API to update testimonial
      const result = await api.marketing.updateTestimonial(updatedTestimonial.id, updatedTestimonial);

      // Update local state with the result from API
      setTestimonialsData(testimonialsData.map(testimonial =>
        testimonial.id === result.id ? result : testimonial
      ));

      setErrorState('testimonials', null);
      return result;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      setErrorState('testimonials', 'Failed to update testimonial');
      throw error;
    } finally {
      setLoadingState('testimonials', false);
    }
  };

  const addTestimonial = async (newTestimonial) => {
    setLoadingState('testimonials', true);
    try {
      // Ensure isVisible is set
      if (newTestimonial.isVisible === undefined) {
        newTestimonial.isVisible = true;
      }

      // Call API to create testimonial
      const createdTestimonial = await api.marketing.createTestimonial(newTestimonial);

      // Update local state with the new testimonial
      setTestimonialsData(prev => [...prev, createdTestimonial]);

      setErrorState('testimonials', null);
      return createdTestimonial;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      setErrorState('testimonials', 'Failed to add testimonial');
      throw error;
    } finally {
      setLoadingState('testimonials', false);
    }
  };

  const deleteTestimonial = async (testimonialId) => {
    setLoadingState('testimonials', true);
    try {
      // Call API to delete testimonial
      await api.marketing.deleteTestimonial(testimonialId);

      // Update local state
      setTestimonialsData(prevTestimonials =>
        prevTestimonials.filter(testimonial => testimonial.id !== testimonialId)
      );

      setErrorState('testimonials', null);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      setErrorState('testimonials', 'Failed to delete testimonial');
      throw error;
    } finally {
      setLoadingState('testimonials', false);
    }
  };

  const updateArtisanInfo = async (updatedInfo) => {
    setLoadingState('artisan', true);
    try {
      // Make sure isVisible is set
      if (updatedInfo.isVisible === undefined) {
        updatedInfo.isVisible = true;
      }

      // Call API to update artisan info
      const result = await api.marketing.updateArtisanInfo(updatedInfo);

      // Update local state with the result from API
      setArtisanInfo(result);

      setErrorState('artisan', null);
      return result;
    } catch (error) {
      console.error('Error updating artisan info:', error);
      setErrorState('artisan', 'Failed to update artisan information');
      throw error;
    } finally {
      setLoadingState('artisan', false);
    }
  };

  const updateContactInfo = async (updatedInfo) => {
    setLoadingState('contactInfo', true);
    try {
      // Make sure visibility settings are preserved
      if (!contactInfo) return;

      if (updatedInfo.showMap === undefined) {
        updatedInfo.showMap = contactInfo.showMap;
      }
      if (updatedInfo.showAddress === undefined) {
        updatedInfo.showAddress = contactInfo.showAddress;
      }
      if (updatedInfo.showPhone === undefined) {
        updatedInfo.showPhone = contactInfo.showPhone;
      }

      // Call API to update contact info
      const result = await api.marketing.updateContactInfo(updatedInfo);

      // Update local state with the result from API
      setContactInfo(result);

      setErrorState('contactInfo', null);
      return result;
    } catch (error) {
      console.error('Error updating contact info:', error);
      setErrorState('contactInfo', 'Failed to update contact information');
      throw error;
    } finally {
      setLoadingState('contactInfo', false);
    }
  };

  const updateColorPalette = (updatedColors) => {
    setColors(updatedColors);
    setTemporaryColorPalette(null); // Clear temporary colors after saving
  };

  // Fetch users data on initial load
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingState('users', true);
      try {
        const data = await api.users.getUsers();
        setUsersData(data);
        setErrorState('users', null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setErrorState('users', 'Failed to load users data');
      } finally {
        setLoadingState('users', false);
      }
    };

    fetchUsers();
  }, []);

  // User management functions
  const addUser = async (newUser) => {
    setLoadingState('users', true);
    try {
      // Call API to create user
      const createdUser = await api.users.createUser(newUser);

      // Update local state with the new user
      setUsersData(prev => [...prev, createdUser]);

      setErrorState('users', null);
      return createdUser;
    } catch (error) {
      console.error('Error adding user:', error);
      setErrorState('users', 'Failed to add user');
      throw error;
    } finally {
      setLoadingState('users', false);
    }
  };

  const updateUser = async (userId, updatedUser) => {
    setLoadingState('users', true);
    try {
      // Call API to update user
      const result = await api.users.updateUser(userId, updatedUser);

      // Update local state with the result from API
      setUsersData(usersData.map(user =>
        user.id === result.id ? result : user
      ));

      setErrorState('users', null);
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorState('users', 'Failed to update user');
      throw error;
    } finally {
      setLoadingState('users', false);
    }
  };

  const deleteUser = async (userId) => {
    setLoadingState('users', true);
    try {
      // Call API to delete user
      await api.users.deleteUser(userId);

      // Update local state
      setUsersData(usersData.filter(user => user.id !== userId));

      setErrorState('users', null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorState('users', 'Failed to delete user');
      throw error;
    } finally {
      setLoadingState('users', false);
    }
  };

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    // Check if the product is already in the cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);

      setNotificationMessage(`Updated quantity for ${product.name}`);
    } else {
      // Add new product to cart
      setCart([...cart, { ...product, quantity }]);

      setNotificationMessage(`Added ${product.name} to your cart`);
    }

    // Show notification
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (item.quantity * price);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Fetch campaigns data on initial load
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingState('campaigns', true);
      try {
        const data = await api.marketing.getCampaigns();
        setCampaignsData(data);
        setErrorState('campaigns', null);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setErrorState('campaigns', 'Failed to load campaigns data');
      } finally {
        setLoadingState('campaigns', false);
      }
    };

    fetchCampaigns();
  }, []);

  // Marketing campaign functions
  const addCampaign = async (newCampaign) => {
    setLoadingState('campaigns', true);
    try {
      // Call API to create campaign
      const createdCampaign = await api.marketing.createCampaign(newCampaign);

      // Update local state with the new campaign
      setCampaignsData(prev => [...prev, createdCampaign]);

      setErrorState('campaigns', null);
      return createdCampaign;
    } catch (error) {
      console.error('Error adding campaign:', error);
      setErrorState('campaigns', 'Failed to add campaign');
      throw error;
    } finally {
      setLoadingState('campaigns', false);
    }
  };

  const updateCampaign = async (updatedCampaign) => {
    setLoadingState('campaigns', true);
    try {
      // Call API to update campaign
      const result = await api.marketing.updateCampaign(updatedCampaign.id, updatedCampaign);

      // Update local state with the result from API
      setCampaignsData(campaignsData.map(campaign =>
        campaign.id === result.id ? result : campaign
      ));

      setErrorState('campaigns', null);
      return result;
    } catch (error) {
      console.error('Error updating campaign:', error);
      setErrorState('campaigns', 'Failed to update campaign');
      throw error;
    } finally {
      setLoadingState('campaigns', false);
    }
  };

  const deleteCampaign = async (campaignId) => {
    setLoadingState('campaigns', true);
    try {
      // Call API to delete campaign
      await api.marketing.deleteCampaign(campaignId);

      // Update local state
      setCampaignsData(campaignsData.filter(campaign => campaign.id !== campaignId));

      setErrorState('campaigns', null);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setErrorState('campaigns', 'Failed to delete campaign');
      throw error;
    } finally {
      setLoadingState('campaigns', false);
    }
  };

  const activateCampaign = async (campaignId) => {
    setLoadingState('campaigns', true);
    try {
      // Call API to activate campaign
      const result = await api.marketing.activateCampaign(campaignId);

      // Update local state
      setCampaignsData(campaignsData.map(campaign =>
        campaign.id === campaignId ? { ...campaign, isActive: true } : campaign
      ));

      setErrorState('campaigns', null);
      return result;
    } catch (error) {
      console.error('Error activating campaign:', error);
      setErrorState('campaigns', 'Failed to activate campaign');
      throw error;
    } finally {
      setLoadingState('campaigns', false);
    }
  };

  const deactivateCampaign = async (campaignId) => {
    setLoadingState('campaigns', true);
    try {
      // Call API to deactivate campaign
      const result = await api.marketing.deactivateCampaign(campaignId);

      // Update local state
      setCampaignsData(campaignsData.map(campaign =>
        campaign.id === campaignId ? { ...campaign, isActive: false } : campaign
      ));

      setErrorState('campaigns', null);
      return result;
    } catch (error) {
      console.error('Error deactivating campaign:', error);
      setErrorState('campaigns', 'Failed to deactivate campaign');
      throw error;
    } finally {
      setLoadingState('campaigns', false);
    }
  };

  const applyPromoCode = (code) => {
    if (!code || !campaignsData.length) return false;

    const campaign = campaignsData.find(c =>
      c.promoCode === code &&
      c.isActive &&
      new Date(c.startDate) <= new Date() &&
      new Date(c.endDate) >= new Date()
    );

    if (campaign) {
      setActivePromoCode(code);
      setAppliedDiscount({
        type: campaign.discountType,
        value: campaign.discountValue,
        minimumPurchase: campaign.minimumPurchase || 0
      });
      return true;
    }

    return false;
  };

  const clearPromoCode = () => {
    setActivePromoCode('');
    setAppliedDiscount(null);
  };

  const getActiveHeroImage = () => {
    // Find active campaign with earliest end date
    const activeCampaigns = campaignsData.filter(c =>
      c.isActive &&
      new Date(c.startDate) <= new Date() &&
      new Date(c.endDate) >= new Date() &&
      c.heroImage
    );

    if (activeCampaigns.length === 0) return null;

    // Sort by end date (ascending) and return the first one
    const sortedCampaigns = [...activeCampaigns].sort((a, b) =>
      new Date(a.endDate) - new Date(b.endDate)
    );

    return sortedCampaigns[0].heroImage;
  };

  const getApplicableCampaignsForUser = (userId) => {
    if (!campaignsData) return [];

    return campaignsData.filter(campaign => {
      const isActive = campaign.isActive;
      const isDateValid = new Date(campaign.startDate) <= new Date() && new Date(campaign.endDate) >= new Date();
      const isApplicableToUser = campaign.type === 'site-wide' ||
        (campaign.type === 'individual' && campaign.targetUserIds?.includes(userId));

      return isActive && isDateValid && isApplicableToUser;
    });
  };

  return (
    <WebsiteContext.Provider
      value={{
        currentRoute: location.pathname,
        navigate,
        isMenuOpen,
        setIsMenuOpen,
        pageTransition,
        isNavbarVisible,
        products: productsData,
        testimonials: testimonialsData,
        artisan: artisanInfo,
        colorPalette: temporaryColorPalette || colors || {
          primary: { background: "stone-50", base: "desert-orange" },
          text: { primary: "desert-black", light: "stone-50" },
          ui: { background: "stone-50" }
        },
        temporaryColorPalette,
        contactInfo,
        orders,
        users: usersData,
        // Admin functions
        updateProduct,
        addProduct,
        deleteProduct,
        updateTestimonial,
        addTestimonial,
        deleteTestimonial,
        updateArtisanInfo,
        updateContactInfo,
        updateColorPalette,
        setTemporaryColorPalette,
        addUser,
        updateUser,
        deleteUser,
        // Cart functions
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        showCartNotification,
        setShowCartNotification,
        notificationMessage,
        setNotificationMessage,
        sectionsVisibility,
        updateSectionVisibility,
        // Marketing campaigns
        campaigns: campaignsData,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        activateCampaign,
        deactivateCampaign,
        applyPromoCode,
        clearPromoCode,
        activePromoCode,
        appliedDiscount,
        getActiveHeroImage,
        getApplicableCampaignsForUser,
        // Add loading and error states to the context
        isLoading,
        errors
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => useContext(WebsiteContext);

export default WebsiteContext;
