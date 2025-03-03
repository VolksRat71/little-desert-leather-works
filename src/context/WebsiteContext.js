import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Color palette as JSON for easy customization
export const colorPalette = {
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
    secondary: "desert-rust",   // Rust brown for secondary text
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

// Fake data for products
export const products = [
  {
    id: 1,
    name: "Handcrafted Leather Wallet",
    description: "Vegetable-tanned full-grain leather wallet with hand-stitched details and multiple card slots. Each piece is burnished by hand for a smooth finish.",
    shortDescription: "Vegetable-tanned full-grain leather wallet with hand-stitched details.",
    price: "$95",
    image: "https://placehold.co/600x400/8b5a2b/ffffff?text=Leather+Wallet",
    images: [
      "https://placehold.co/600x400/8b5a2b/ffffff?text=Leather+Wallet",
      "https://placehold.co/600x400/704820/ffffff?text=Wallet+Open",
      "https://placehold.co/600x400/5c4c35/ffffff?text=Wallet+Details"
    ],
    features: [
      "Full-grain vegetable-tanned leather",
      "Saddle-stitched with waxed thread",
      "Six card slots and two hidden pockets",
      "Dimensions: 4.5\" x 3.5\"",
      "Available in Whiskey, Dark Brown, and Natural"
    ],
    careInstructions: "Condition with leather balm every 3-6 months. Avoid excessive moisture.",
    isVisible: true
  },
  {
    id: 2,
    name: "Artisan Belt",
    description: "Custom-cut belt with solid brass buckle, handmade in Austin. Made from a single piece of 8-10oz leather for durability and longevity.",
    shortDescription: "Custom-cut belt with brass buckle, handmade in Austin.",
    price: "$120",
    image: "https://placehold.co/600x400/704820/ffffff?text=Leather+Belt",
    images: [
      "https://placehold.co/600x400/704820/ffffff?text=Leather+Belt",
      "https://placehold.co/600x400/8b5a2b/ffffff?text=Belt+Buckle",
      "https://placehold.co/600x400/5c4c35/ffffff?text=Belt+Detail"
    ],
    features: [
      "8-10oz full-grain leather",
      "Solid brass or nickel buckle",
      "Hand-beveled and burnished edges",
      "Width options: 1.25\" or 1.5\"",
      "Custom sizing available"
    ],
    careInstructions: "Clean with damp cloth and mild soap. Condition every 6 months.",
    isVisible: true
  },
  {
    id: 3,
    name: "Desert Messenger Bag",
    description: "Rugged messenger bag with adjustable strap and antique hardware. Featuring a spacious main compartment and multiple organization pockets.",
    shortDescription: "Rugged messenger bag with adjustable strap and antique hardware.",
    price: "$275",
    image: "https://placehold.co/600x400/8b5a2b/ffffff?text=Messenger+Bag",
    images: [
      "https://placehold.co/600x400/8b5a2b/ffffff?text=Messenger+Bag",
      "https://placehold.co/600x400/704820/ffffff?text=Bag+Interior",
      "https://placehold.co/600x400/5c4c35/ffffff?text=Bag+Hardware"
    ],
    features: [
      "5-6oz full-grain oil-tanned leather",
      "Antique brass hardware",
      "Adjustable shoulder strap",
      "Cotton canvas lining",
      "Fits 15\" laptop",
      "Dimensions: 15\" x 11\" x 4\""
    ],
    careInstructions: "Wipe with damp cloth. Apply leather conditioner yearly or as needed.",
    isVisible: true
  },
  {
    id: 4,
    name: "Leather Journal Cover",
    description: "Hand-tooled journal cover that will age beautifully with time. Designed to fit standard A5 notebooks with an easy replacement system.",
    shortDescription: "Hand-tooled journal cover that will age beautifully with time.",
    price: "$85",
    image: "https://placehold.co/600x400/704820/ffffff?text=Journal+Cover",
    images: [
      "https://placehold.co/600x400/704820/ffffff?text=Journal+Cover",
      "https://placehold.co/600x400/8b5a2b/ffffff?text=Journal+Open",
      "https://placehold.co/600x400/5c4c35/ffffff?text=Journal+Detail"
    ],
    features: [
      "4-5oz full-grain leather",
      "Fits standard A5 notebooks (5.8\" x 8.3\")",
      "Elastic band closure",
      "Bookmark ribbon",
      "Optional personalization available"
    ],
    careInstructions: "Keep dry. Apply leather conditioner when leather feels dry.",
    isVisible: true
  }
];

// Fake testimonials
export const testimonials = [
  {
    id: 1,
    name: "Michael R.",
    location: "Dallas, TX",
    testimonial: "The craftsmanship on my wallet is incredible. After two years of daily use, it's developing a beautiful patina and holding up perfectly. It's rare to find goods made with this level of care these days.",
    image: "https://placehold.co/64x64/8b5a2b/ffffff?text=MR",
    isVisible: true
  },
  {
    id: 2,
    name: "Sarah J.",
    location: "Austin, TX",
    testimonial: "I commissioned a custom bag as a gift for my husband. The attention to detail and the personal touches make it truly one of a kind. The entire experience working with Little Desert Leather Works was exceptional.",
    image: "https://placehold.co/64x64/704820/ffffff?text=SJ",
    isVisible: true
  },
  {
    id: 3,
    name: "David M.",
    location: "Houston, TX",
    testimonial: "The belt I purchased has become my everyday favorite. The quality of the leather is unmatched by anything I've found elsewhere. I've already ordered two more in different colors.",
    image: "https://placehold.co/64x64/5c4c35/ffffff?text=DM",
    isVisible: true
  }
];

// Artisan information
export const artisan = {
  name: "Morgan E Ludemann",
  title: "Master Leather Craftsman",
  image: "https://placehold.co/600x800/8b5a2b/ffffff?text=Morgan+Ludemann",
  bio: "With over 15 years of experience working with leather, I bring traditional techniques and modern design to every piece I create. My journey began in my grandfather's workshop, where I learned that quality craftsmanship requires patience, precision, and passion. Today, I handcraft each item in my Austin studio, selecting only the finest full-grain leathers.\n\nI was drawn to leatherworking after a trip through the American Southwest, where I was captivated by the rugged beauty of the desert and the generations of artisans who worked with natural materials. The textures, colors, and resilience of the desert landscape continue to inspire my work.\n\nEvery stitch, every cut, and every burnished edge represents my commitment to creating heirloom-quality goods that will age beautifully and tell a story with time. I believe in creating pieces that become more beautiful with age and use – developing a rich patina that reflects their journey with you.",
  philosophy: "I believe in slow craft – taking the time needed to do things right. No shortcuts, no mass production. Just honest materials, traditional techniques, and meticulous attention to detail.",
  skills: ["Hand-stitching", "Tooling & Carving", "Dyeing & Finishing", "Pattern Making", "Custom Design"],
  isVisible: true
};

// Create sample users data
export const users = [
  {
    id: 1,
    name: 'Morgan Ludemann',
    email: 'morgan@littledesertleatherworks.com',
    role: 'Admin',
    lastLogin: '2023-03-15',
    phone: '(555) 123-4567',
    address: '123 Admin St, Austin, TX 78701',
    profileImage: 'https://placehold.co/200x200/amber700/ffffff?text=Admin',
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
    phone: '(555) 987-6543',
    address: '456 Customer Ave, Austin, TX 78704',
    profileImage: 'https://placehold.co/200x200/amber700/ffffff?text=JD',
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
    phone: '(555) 456-7890',
    address: '789 Customer Blvd, Austin, TX 78745',
    profileImage: 'https://placehold.co/200x200/amber700/ffffff?text=JS',
    marketingPreferences: {
      emailOffers: false,
      textOffers: false,
      orderUpdates: true
    }
  }
];

// Sample marketing campaigns
export const marketingCampaigns = [
  {
    id: 1,
    name: "Summer Sale 2023",
    type: "site-wide",
    discountType: "percentage",
    discountValue: 20,
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    isActive: true,
    heroImage: "https://placehold.co/1200x400/8b5a2b/ffffff?text=Summer+Sale+20%+Off",
    description: "Summer sale with 20% off all products",
    promoCode: "SUMMER20"
  },
  {
    id: 2,
    name: "New Customer Discount",
    type: "individual",
    discountType: "percentage",
    discountValue: 15,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    isActive: true,
    targetUserIds: [2, 3],  // IDs of targeted users
    description: "15% off for new customers",
    promoCode: "WELCOME15"
  },
  {
    id: 3,
    name: "Black Friday",
    type: "site-wide",
    discountType: "fixed",
    discountValue: 50,
    startDate: "2023-11-24",
    endDate: "2023-11-27",
    isActive: false,
    heroImage: "https://placehold.co/1200x400/000000/ffffff?text=Black+Friday+$50+Off",
    description: "$50 off on purchases over $200",
    promoCode: "BLACKFRIDAY50",
    minimumPurchase: 200
  }
];

// Create website context
const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // Admin-related state
  const [productsData, setProductsData] = useState(products);
  const [testimonialsData, setTestimonialsData] = useState(testimonials);
  const [artisanInfo, setArtisanInfo] = useState(artisan);
  const [colors, setColors] = useState(colorPalette);
  // Track temporary color changes for preview
  const [temporaryColorPalette, setTemporaryColorPalette] = useState(null);
  const [orders, setOrders] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    email: "contact@littledesertleatherworks.com",
    phone: "(512) 555-1234",
    address: "123 Craftsman Way, Austin, TX 78701",
    hours: "Monday-Friday: 9am-5pm\nSaturday: 10am-4pm\nSunday: Closed",
    showMap: true,
    showAddress: true,
    showPhone: true
  });

  // Cart state
  const [cart, setCart] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Users state
  const [usersData, setUsersData] = useState(users);

  // Marketing campaigns state
  const [campaignsData, setCampaignsData] = useState(marketingCampaigns);
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

    // Change route after animation starts
    setTimeout(() => {
      navigateFunc(path);
      // End transition
      setTimeout(() => {
        setPageTransition(false);
      }, 300);
    }, 300);

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

  // Admin functions
  const updateProduct = (updatedProduct) => {
    // Make sure isVisible is set
    if (updatedProduct.isVisible === undefined) {
      updatedProduct.isVisible = true;
    }

    setProductsData(productsData.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const addProduct = (newProduct) => {
    // Add a new ID (max ID + 1)
    const nextId = Math.max(...productsData.map(p => p.id)) + 1;
    const productWithId = {
      ...newProduct,
      id: nextId,
      isVisible: newProduct.isVisible === undefined ? true : newProduct.isVisible // Ensure isVisible is set
    };
    setProductsData([...productsData, productWithId]);
  };

  const deleteProduct = (productId) => {
    setProductsData(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
  };

  const updateTestimonial = (updatedTestimonial) => {
    // Make sure isVisible is set
    if (updatedTestimonial.isVisible === undefined) {
      updatedTestimonial.isVisible = true;
    }

    setTestimonialsData(testimonialsData.map(testimonial =>
      testimonial.id === updatedTestimonial.id ? updatedTestimonial : testimonial
    ));
  };

  const addTestimonial = (newTestimonial) => {
    // Add a new ID (max ID + 1)
    const nextId = Math.max(...testimonialsData.map(t => t.id)) + 1;
    const testimonialWithId = {
      ...newTestimonial,
      id: nextId,
      isVisible: newTestimonial.isVisible === undefined ? true : newTestimonial.isVisible // Ensure isVisible is set
    };
    setTestimonialsData([...testimonialsData, testimonialWithId]);
  };

  const deleteTestimonial = (testimonialId) => {
    setTestimonialsData(prevTestimonials =>
      prevTestimonials.filter(testimonial => testimonial.id !== testimonialId)
    );
  };

  const updateArtisanInfo = (updatedInfo) => {
    // Make sure isVisible is set
    if (updatedInfo.isVisible === undefined) {
      updatedInfo.isVisible = true;
    }

    setArtisanInfo(updatedInfo);
  };

  const updateContactInfo = (updatedInfo) => {
    // Make sure visibility settings are preserved
    if (updatedInfo.showMap === undefined) {
      updatedInfo.showMap = contactInfo.showMap;
    }
    if (updatedInfo.showAddress === undefined) {
      updatedInfo.showAddress = contactInfo.showAddress;
    }
    if (updatedInfo.showPhone === undefined) {
      updatedInfo.showPhone = contactInfo.showPhone;
    }

    setContactInfo(prevInfo => ({ ...prevInfo, ...updatedInfo }));
  };

  const updateColorPalette = (updatedColors) => {
    setColors(updatedColors);
    setTemporaryColorPalette(null); // Clear temporary colors after saving
  };

  // User management functions
  const addUser = (newUser) => {
    setUsersData([...usersData, newUser]);
  };

  const updateUser = (userId, updatedUser) => {
    setUsersData(usersData.map(user =>
      user.id === userId ? updatedUser : user
    ));
  };

  const deleteUser = (userId) => {
    setUsersData(usersData.filter(user => user.id !== userId));
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
    return cart.reduce((total, item) => total + item.quantity * item.price.replace('$', ''), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Marketing campaign functions
  const addCampaign = (newCampaign) => {
    const nextId = Math.max(...campaignsData.map(c => c.id)) + 1;
    const campaignWithId = {
      ...newCampaign,
      id: nextId
    };
    setCampaignsData([...campaignsData, campaignWithId]);
  };

  const updateCampaign = (updatedCampaign) => {
    setCampaignsData(campaignsData.map(campaign =>
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
  };

  const deleteCampaign = (campaignId) => {
    setCampaignsData(campaignsData.filter(campaign => campaign.id !== campaignId));
  };

  const activateCampaign = (campaignId) => {
    setCampaignsData(campaignsData.map(campaign =>
      campaign.id === campaignId
        ? { ...campaign, isActive: true }
        : campaign
    ));
  };

  const deactivateCampaign = (campaignId) => {
    setCampaignsData(campaignsData.map(campaign =>
      campaign.id === campaignId
        ? { ...campaign, isActive: false }
        : campaign
    ));
  };

  const applyPromoCode = (code) => {
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
    const now = new Date();

    // Find active site-wide campaigns
    const activeSiteWideCampaigns = campaignsData.filter(c =>
      c.type === 'site-wide' &&
      c.isActive &&
      c.heroImage &&
      new Date(c.startDate) <= now &&
      new Date(c.endDate) >= now
    );

    // Return the hero image of the first active campaign, or null if none found
    return activeSiteWideCampaigns.length > 0 ? activeSiteWideCampaigns[0].heroImage : null;
  };

  const getApplicableCampaignsForUser = (userId) => {
    const now = new Date();

    // Get all active campaigns
    return campaignsData.filter(campaign => {
      // Must be active and within date range
      if (!campaign.isActive || new Date(campaign.startDate) > now || new Date(campaign.endDate) < now) {
        return false;
      }

      // Site-wide campaigns apply to everyone
      if (campaign.type === 'site-wide') {
        return true;
      }

      // Individual campaigns must include the user
      if (campaign.type === 'individual') {
        return campaign.targetUserIds?.includes(userId);
      }

      return false;
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
        colorPalette: temporaryColorPalette || colors,
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
        getApplicableCampaignsForUser
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => useContext(WebsiteContext);

export default WebsiteContext;
