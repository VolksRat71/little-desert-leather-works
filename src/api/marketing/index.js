import apiClient from '../client';
import { testimonials, marketingCampaigns } from './placeholder';

// Contact info default object
const contactInfoDefault = {
  email: "contact@littledesertleatherworks.com",
  phone: "(512) 555-1234",
  address: "123 Craftsman Way, Austin, TX 78701",
  hours: "Monday-Friday: 9am-5pm\nSaturday: 10am-4pm\nSunday: Closed",
  showMap: true,
  showAddress: true,
  showPhone: true
};

// Testimonials API
export const getTestimonials = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/testimonials');
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

export const createTestimonial = async (testimonialData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/testimonials', testimonialData);
    // return response.data;

    // Return placeholder data instead
    const newTestimonial = {
      ...testimonialData,
      id: Math.max(...testimonials.map(t => t.id)) + 1,
      date: testimonialData.date || new Date().toISOString().split('T')[0]
    };
    return Promise.resolve(newTestimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

export const updateTestimonial = async (testimonialId, testimonialData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.put(`/testimonials/${testimonialId}`, testimonialData);
    // return response.data;

    // Return placeholder data instead
    const updatedTestimonial = { ...testimonialData, id: testimonialId };
    return Promise.resolve(updatedTestimonial);
  } catch (error) {
    console.error(`Error updating testimonial ${testimonialId}:`, error);
    throw error;
  }
};

export const deleteTestimonial = async (testimonialId) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.delete(`/testimonials/${testimonialId}`);
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve({ success: true, message: `Testimonial ${testimonialId} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting testimonial ${testimonialId}:`, error);
    throw error;
  }
};

// Campaigns API
export const getCampaigns = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/campaigns');
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve(marketingCampaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const createCampaign = async (campaignData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post('/campaigns', campaignData);
    // return response.data;

    // Return placeholder data instead
    const newCampaign = {
      ...campaignData,
      id: Math.max(...marketingCampaigns.map(c => c.id)) + 1
    };
    return Promise.resolve(newCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

export const updateCampaign = async (campaignId, campaignData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.put(`/campaigns/${campaignId}`, campaignData);
    // return response.data;

    // Return placeholder data instead
    const updatedCampaign = { ...campaignData, id: campaignId };
    return Promise.resolve(updatedCampaign);
  } catch (error) {
    console.error(`Error updating campaign ${campaignId}:`, error);
    throw error;
  }
};

export const deleteCampaign = async (campaignId) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.delete(`/campaigns/${campaignId}`);
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve({ success: true, message: `Campaign ${campaignId} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting campaign ${campaignId}:`, error);
    throw error;
  }
};

export const activateCampaign = async (campaignId) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post(`/campaigns/${campaignId}/activate`);
    // return response.data;

    // Return placeholder data instead
    const campaign = marketingCampaigns.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }
    const updatedCampaign = { ...campaign, isActive: true };
    return Promise.resolve(updatedCampaign);
  } catch (error) {
    console.error(`Error activating campaign ${campaignId}:`, error);
    throw error;
  }
};

export const deactivateCampaign = async (campaignId) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.post(`/campaigns/${campaignId}/deactivate`);
    // return response.data;

    // Return placeholder data instead
    const campaign = marketingCampaigns.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }
    const updatedCampaign = { ...campaign, isActive: false };
    return Promise.resolve(updatedCampaign);
  } catch (error) {
    console.error(`Error deactivating campaign ${campaignId}:`, error);
    throw error;
  }
};

// Get contact info
export const getContactInfo = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/contact-info');
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve(contactInfoDefault);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    throw error;
  }
};

// Update contact info
export const updateContactInfo = async (contactData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.put('/contact-info', contactData);
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve({
      ...contactInfoDefault,
      ...contactData
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    throw error;
  }
};

// Get artisan info
export const getArtisanInfo = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/artisan-info');
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve({
      name: "Morgan E Ludemann",
      title: "Leather Craftsman",
      image: "https://res.cloudinary.com/notsupreme/image/upload/v1741109019/oocibvenzn1til5pscgd.jpg",
      bio: "As a leather artisan, I am dedicated to merging contemporary aesthetics with traditional craftsmanship. My journey began in a vibrant my personal Austin workshop, where I immersed myself in the art of leather crafting. This experience ignited a passion for creating unique, high-quality pieces that reflect both innovation and heritage.\n\nDrawing inspiration from the dynamic energy of urban life and the rich history of leather artisans, I aim to craft items that are both functional and stylish. The diverse textures and colors of cityscapes inspire my designs, encouraging me to push boundaries and explore new creative avenues.\n\nEach piece I create is a reflection of my commitment to excellence and my belief in the beauty of well-crafted goods. I strive to produce items that not only serve a purpose but also tell a story, evolving with you over time and gaining character with every use.",
      philosophy: "I am committed to the art of thoughtful craftsmanship, where creativity meets precision. By focusing on intentional design and meticulous attention to detail, I ensure that each piece is crafted with integrity and a modern touch.",
      skills: ["Hand-stitching", "Tooling & Carving", "Dyeing & Finishing", "Pattern Making", "Custom Design"],
      isVisible: true
    });
  } catch (error) {
    console.error('Error fetching artisan info:', error);
    throw error;
  }
};

// Update artisan info
export const updateArtisanInfo = async (artisanData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.put('/artisan-info', artisanData);
    // return response.data;

    // Return placeholder data instead
    return Promise.resolve(artisanData);
  } catch (error) {
    console.error('Error updating artisan info:', error);
    throw error;
  }
};

// Get color palette
export const getColorPalette = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/color-palette');
    // return response.data;

    // Return placeholder data (defaults will be in WebsiteContext)
    // This would come from a database in a real implementation
    return Promise.resolve(null); // Return null to use defaults
  } catch (error) {
    console.error('Error fetching color palette:', error);
    throw error;
  }
};

// Update color palette
export const updateColorPalette = async (colorData) => {
  try {
    // Comment out the real API call
    // const response = await apiClient.put('/color-palette', colorData);
    // return response.data;

    // Simply return the data we would save
    // In a real implementation, this would save to a database
    return Promise.resolve(colorData);
  } catch (error) {
    console.error('Error updating color palette:', error);
    throw error;
  }
};

// Get theme presets
export const getThemePresets = async () => {
  try {
    // Comment out the real API call
    // const response = await apiClient.get('/theme-presets');
    // return response.data;

    // Return placeholder theme presets
    const presets = [
      {
        id: 'desert',
        name: 'Desert Theme',
        description: 'The default theme with warm desert tones',
        palette: {
          primary: {
            base: "desert-orange",
            light: "desert-terracotta",
            dark: "desert-rust",
            hover: "desert-rust",
            lightest: "desert-tan",
            background: "white"
          },
          secondary: {
            base: "desert-olive",
            light: "desert-green",
            dark: "desert-black",
            background: "white",
            lightest: "white"
          },
          text: {
            primary: "desert-black",
            secondary: "gray-700",
            light: "white",
            accent: "desert-rust",
            medium: "desert-black",
            dark: "desert-black",
            lightest: "white"
          },
          ui: {
            border: "desert-terracotta",
            shadow: "desert-rust",
            background: "white",
            darkBackground: "desert-black",
            lightBackground: "white",
            accent: "desert-orange",
            earthGreen: "desert-olive"
          }
        }
      },
      {
        id: 'ocean',
        name: 'Ocean Theme',
        description: 'Cool blue tones inspired by the ocean',
        palette: {
          primary: {
            base: "blue-600",
            light: "blue-500",
            dark: "blue-700",
            hover: "blue-700",
            lightest: "blue-100",
            background: "white"
          },
          secondary: {
            base: "teal-600",
            light: "teal-500",
            dark: "teal-700",
            background: "white",
            lightest: "white"
          },
          text: {
            primary: "gray-900",
            secondary: "slate-700",
            light: "white",
            accent: "blue-700",
            medium: "slate-800",
            dark: "slate-900",
            lightest: "white"
          },
          ui: {
            border: "blue-500",
            shadow: "blue-700",
            background: "white",
            darkBackground: "slate-900",
            lightBackground: "white",
            accent: "blue-600",
            earthGreen: "teal-600"
          }
        }
      },
      {
        id: 'forest',
        name: 'Forest Theme',
        description: 'Natural green tones inspired by forests',
        palette: {
          primary: {
            base: "green-600",
            light: "green-500",
            dark: "green-700",
            hover: "green-700",
            lightest: "green-100",
            background: "white"
          },
          secondary: {
            base: "emerald-700",
            light: "emerald-600",
            dark: "emerald-800",
            background: "white",
            lightest: "white"
          },
          text: {
            primary: "gray-900",
            secondary: "gray-700",
            light: "white",
            accent: "emerald-700",
            medium: "gray-800",
            dark: "gray-900",
            lightest: "white"
          },
          ui: {
            border: "green-500",
            shadow: "green-700",
            background: "white",
            darkBackground: "gray-900",
            lightBackground: "white",
            accent: "green-600",
            earthGreen: "emerald-700"
          }
        }
      },
      // Holiday Themes
      {
        id: 'july4th',
        name: '4th of July',
        description: 'Patriotic red, white, and blue theme for Independence Day',
        category: 'holiday',
        palette: {
          primary: {
            base: "blue-600",
            light: "blue-500",
            dark: "blue-700",
            hover: "blue-700",
            lightest: "blue-100",
            background: "white"
          },
          secondary: {
            base: "red-600",
            light: "red-500",
            dark: "red-700",
            background: "white",
            lightest: "white"
          },
          text: {
            primary: "gray-900",
            secondary: "gray-700",
            light: "white",
            accent: "red-600",
            medium: "blue-800",
            dark: "gray-900",
            lightest: "white"
          },
          ui: {
            border: "blue-600",
            shadow: "blue-800",
            background: "white",
            darkBackground: "blue-900",
            lightBackground: "white",
            accent: "red-600",
            earthGreen: "green-700"
          }
        }
      },
      {
        id: 'mothersday',
        name: "Mother's Day",
        description: 'Soft pinks and floral tones for celebrating moms',
        category: 'holiday',
        palette: {
          primary: {
            base: "pink-500",
            light: "pink-400",
            dark: "pink-600",
            hover: "pink-600",
            lightest: "pink-100",
            background: "white"
          },
          secondary: {
            base: "purple-600",
            light: "purple-500",
            dark: "purple-700",
            background: "white",
            lightest: "white"
          },
          text: {
            primary: "gray-900",
            secondary: "purple-800",
            light: "white",
            accent: "pink-600",
            medium: "purple-700",
            dark: "gray-900",
            lightest: "white"
          },
          ui: {
            border: "pink-400",
            shadow: "pink-600",
            background: "white",
            darkBackground: "purple-900",
            lightBackground: "white",
            accent: "pink-500",
            earthGreen: "green-600"
          }
        }
      },
      {
        id: 'blackfriday',
        name: 'Black Friday',
        description: 'Bold black and vibrant accents for sales and promotions',
        category: 'holiday',
        palette: {
          primary: {
            base: "gray-900",
            light: "gray-800",
            dark: "black",
            hover: "black",
            lightest: "gray-200",
            background: "white"
          },
          secondary: {
            base: "red-600",
            light: "red-500",
            dark: "red-700",
            background: "white",
            lightest: "white"
          },
          text: {
            primary: "gray-900",
            secondary: "gray-700",
            light: "white",
            accent: "red-600",
            medium: "gray-800",
            dark: "black",
            lightest: "white"
          },
          ui: {
            border: "gray-400",
            shadow: "gray-800",
            background: "white",
            darkBackground: "black",
            lightBackground: "white",
            accent: "red-600",
            earthGreen: "green-600"
          }
        }
      },
      {
        id: 'christmas',
        name: 'Christmas',
        description: 'Festive red and green with snow white accents',
        category: 'holiday',
        palette: {
          primary: {
            base: "red-600",
            light: "red-500",
            dark: "red-700",
            hover: "red-700",
            lightest: "red-100",
            background: "white"
          },
          secondary: {
            base: "green-700",
            light: "green-600",
            dark: "green-800",
            background: "white",
            lightest: "white"
          },
          text: {
            primary: "gray-900",
            secondary: "green-800",
            light: "white",
            accent: "red-600",
            medium: "green-800",
            dark: "gray-900",
            lightest: "white"
          },
          ui: {
            border: "red-500",
            shadow: "green-700",
            background: "white",
            darkBackground: "green-900",
            lightBackground: "white",
            accent: "red-600",
            earthGreen: "green-700"
          }
        }
      },
      {
        id: 'halloween',
        name: 'Halloween',
        description: 'Spooky orange and black tones for Halloween',
        category: 'holiday',
        palette: {
          primary: {
            base: "orange-600",
            light: "orange-500",
            dark: "orange-700",
            hover: "orange-700",
            lightest: "orange-100",
            background: "white"
          },
          secondary: {
            base: "gray-900",
            light: "gray-800",
            dark: "black",
            background: "white",
            lightest: "white"
          },
          text: {
            primary: "gray-900",
            secondary: "gray-800",
            light: "white",
            accent: "orange-600",
            medium: "gray-800",
            dark: "black",
            lightest: "white"
          },
          ui: {
            border: "orange-500",
            shadow: "gray-900",
            background: "white",
            darkBackground: "black",
            lightBackground: "white",
            accent: "orange-600",
            earthGreen: "green-600"
          }
        }
      },
      {
        id: 'thanksgiving',
        name: 'Thanksgiving',
        description: 'Warm autumn colors for Thanksgiving celebrations',
        category: 'holiday',
        palette: {
          primary: {
            base: "amber-600",
            light: "amber-500",
            dark: "amber-700",
            hover: "amber-700",
            lightest: "amber-100",
            background: "white"
          },
          secondary: {
            base: "yellow-800",
            light: "yellow-700",
            dark: "yellow-900",
            background: "white",
            lightest: "white"
          },
          text: {
            primary: "gray-900",
            secondary: "yellow-900",
            light: "white",
            accent: "amber-700",
            medium: "brown-700",
            dark: "gray-900",
            lightest: "white"
          },
          ui: {
            border: "amber-500",
            shadow: "yellow-800",
            background: "white",
            darkBackground: "yellow-900",
            lightBackground: "white",
            accent: "amber-600",
            earthGreen: "green-700"
          }
        }
      }
    ];

    return Promise.resolve(presets);
  } catch (error) {
    console.error('Error fetching theme presets:', error);
    throw error;
  }
};
