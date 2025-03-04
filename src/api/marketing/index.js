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
