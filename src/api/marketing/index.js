import apiClient from '../client';
import { testimonials, marketingCampaigns } from './placeholder';

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
