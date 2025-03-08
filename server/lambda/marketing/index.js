// Marketing microservice Lambda function
const mysql = require('mysql2/promise');
const { validate } = require('./validation');
const MarketingModel = require('./models/marketing');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize the Marketing model
const marketingModel = new MarketingModel(pool);

// Main handler function
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Extract HTTP method and path
    const httpMethod = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // Route the request to the appropriate handler
    let response;

    // Testimonials endpoints
    if (path === '/testimonials') {
      switch (httpMethod) {
        case 'GET':
          response = await handleGetTestimonials(event);
          break;
        case 'POST':
          response = await handleCreateTestimonial(event);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path.match(/^\/testimonials\/[\w-]+$/)) {
      // Extract the testimonial ID from the path
      const testimonialId = path.split('/').pop();

      switch (httpMethod) {
        case 'GET':
          response = await handleGetTestimonialById(testimonialId);
          break;
        case 'PUT':
          response = await handleUpdateTestimonial(testimonialId, event);
          break;
        case 'DELETE':
          response = await handleDeleteTestimonial(testimonialId);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    }
    // Campaigns endpoints
    else if (path === '/campaigns') {
      switch (httpMethod) {
        case 'GET':
          response = await handleGetCampaigns(event);
          break;
        case 'POST':
          response = await handleCreateCampaign(event);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/campaigns/active') {
      if (httpMethod === 'GET') {
        response = await handleGetActiveCampaigns();
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path.match(/^\/campaigns\/[\w-]+$/)) {
      // Extract the campaign ID from the path
      const campaignId = path.split('/').pop();

      switch (httpMethod) {
        case 'GET':
          response = await handleGetCampaignById(campaignId);
          break;
        case 'PUT':
          response = await handleUpdateCampaign(campaignId, event);
          break;
        case 'DELETE':
          response = await handleDeleteCampaign(campaignId);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    }
    // Contact info endpoints
    else if (path === '/contact-info') {
      switch (httpMethod) {
        case 'GET':
          response = await handleGetContactInfo();
          break;
        case 'PUT':
          response = await handleUpdateContactInfo(event);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    }
    // Artisan info endpoints
    else if (path === '/artisan-info') {
      switch (httpMethod) {
        case 'GET':
          response = await handleGetArtisanInfo();
          break;
        case 'PUT':
          response = await handleUpdateArtisanInfo(event);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    } else {
      return buildResponse(404, { message: 'Not Found' });
    }

    return response;
  } catch (error) {
    console.error('Error processing request:', error);
    return buildResponse(500, { message: 'Internal Server Error' });
  }
};

// Testimonials Handlers

async function handleGetTestimonials(event) {
  try {
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 1;
    const isAdmin = queryParams.admin === 'true';

    // Get testimonials from the database
    let testimonials;
    if (isAdmin) {
      // Admin view includes unapproved testimonials
      testimonials = await marketingModel.getAllTestimonials(limit, page);
    } else {
      // Public view only shows approved testimonials
      testimonials = await marketingModel.getTestimonials(limit, page);
    }

    return buildResponse(200, { testimonials });
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return buildResponse(500, { message: 'Error retrieving testimonials' });
  }
}

async function handleGetTestimonialById(testimonialId) {
  try {
    const testimonial = await marketingModel.getTestimonialById(testimonialId);

    if (!testimonial) {
      return buildResponse(404, { message: 'Testimonial not found' });
    }

    return buildResponse(200, { testimonial });
  } catch (error) {
    console.error(`Error getting testimonial ${testimonialId}:`, error);
    return buildResponse(500, { message: 'Error retrieving testimonial' });
  }
}

async function handleCreateTestimonial(event) {
  try {
    const testimonialData = JSON.parse(event.body || '{}');

    // Validate the testimonial data
    const validationResult = validate.testimonial(testimonialData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Create the testimonial in the database
    const newTestimonial = await marketingModel.createTestimonial(testimonialData);

    return buildResponse(201, { testimonial: newTestimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return buildResponse(500, { message: 'Error creating testimonial' });
  }
}

async function handleUpdateTestimonial(testimonialId, event) {
  try {
    // Check if the testimonial exists
    const existingTestimonial = await marketingModel.getTestimonialById(testimonialId);
    if (!existingTestimonial) {
      return buildResponse(404, { message: 'Testimonial not found' });
    }

    const testimonialData = JSON.parse(event.body || '{}');

    // Validate the testimonial data
    const validationResult = validate.testimonial(testimonialData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Update the testimonial in the database
    const updatedTestimonial = await marketingModel.updateTestimonial(testimonialId, testimonialData);

    return buildResponse(200, { testimonial: updatedTestimonial });
  } catch (error) {
    console.error(`Error updating testimonial ${testimonialId}:`, error);
    return buildResponse(500, { message: 'Error updating testimonial' });
  }
}

async function handleDeleteTestimonial(testimonialId) {
  try {
    // Check if the testimonial exists
    const existingTestimonial = await marketingModel.getTestimonialById(testimonialId);
    if (!existingTestimonial) {
      return buildResponse(404, { message: 'Testimonial not found' });
    }

    // Delete the testimonial from the database
    await marketingModel.deleteTestimonial(testimonialId);

    return buildResponse(204, null);
  } catch (error) {
    console.error(`Error deleting testimonial ${testimonialId}:`, error);
    return buildResponse(500, { message: 'Error deleting testimonial' });
  }
}

// Campaigns Handlers

async function handleGetCampaigns(event) {
  try {
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 1;

    // Get campaigns from the database
    const campaigns = await marketingModel.getCampaigns(limit, page);

    return buildResponse(200, { campaigns });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    return buildResponse(500, { message: 'Error retrieving campaigns' });
  }
}

async function handleGetActiveCampaigns() {
  try {
    // Get active campaigns from the database
    const campaigns = await marketingModel.getActiveCampaigns();

    return buildResponse(200, { campaigns });
  } catch (error) {
    console.error('Error getting active campaigns:', error);
    return buildResponse(500, { message: 'Error retrieving active campaigns' });
  }
}

async function handleGetCampaignById(campaignId) {
  try {
    const campaign = await marketingModel.getCampaignById(campaignId);

    if (!campaign) {
      return buildResponse(404, { message: 'Campaign not found' });
    }

    return buildResponse(200, { campaign });
  } catch (error) {
    console.error(`Error getting campaign ${campaignId}:`, error);
    return buildResponse(500, { message: 'Error retrieving campaign' });
  }
}

async function handleCreateCampaign(event) {
  try {
    const campaignData = JSON.parse(event.body || '{}');

    // Validate the campaign data
    const validationResult = validate.campaign(campaignData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Create the campaign in the database
    const newCampaign = await marketingModel.createCampaign(campaignData);

    return buildResponse(201, { campaign: newCampaign });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return buildResponse(500, { message: 'Error creating campaign' });
  }
}

async function handleUpdateCampaign(campaignId, event) {
  try {
    // Check if the campaign exists
    const existingCampaign = await marketingModel.getCampaignById(campaignId);
    if (!existingCampaign) {
      return buildResponse(404, { message: 'Campaign not found' });
    }

    const campaignData = JSON.parse(event.body || '{}');

    // Validate the campaign data
    const validationResult = validate.campaign(campaignData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Update the campaign in the database
    const updatedCampaign = await marketingModel.updateCampaign(campaignId, campaignData);

    return buildResponse(200, { campaign: updatedCampaign });
  } catch (error) {
    console.error(`Error updating campaign ${campaignId}:`, error);
    return buildResponse(500, { message: 'Error updating campaign' });
  }
}

async function handleDeleteCampaign(campaignId) {
  try {
    // Check if the campaign exists
    const existingCampaign = await marketingModel.getCampaignById(campaignId);
    if (!existingCampaign) {
      return buildResponse(404, { message: 'Campaign not found' });
    }

    // Delete the campaign from the database
    await marketingModel.deleteCampaign(campaignId);

    return buildResponse(204, null);
  } catch (error) {
    console.error(`Error deleting campaign ${campaignId}:`, error);
    return buildResponse(500, { message: 'Error deleting campaign' });
  }
}

// Contact Info Handlers

async function handleGetContactInfo() {
  try {
    const contactInfo = await marketingModel.getContactInfo();
    return buildResponse(200, { contactInfo });
  } catch (error) {
    console.error('Error getting contact info:', error);
    return buildResponse(500, { message: 'Error retrieving contact info' });
  }
}

async function handleUpdateContactInfo(event) {
  try {
    const contactData = JSON.parse(event.body || '{}');

    // Validate the contact data
    const validationResult = validate.contactInfo(contactData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Update the contact info in the database
    const updatedContactInfo = await marketingModel.updateContactInfo(contactData);

    return buildResponse(200, { contactInfo: updatedContactInfo });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return buildResponse(500, { message: 'Error updating contact info' });
  }
}

// Artisan Info Handlers

async function handleGetArtisanInfo() {
  try {
    const artisanInfo = await marketingModel.getArtisanInfo();
    return buildResponse(200, { artisanInfo });
  } catch (error) {
    console.error('Error getting artisan info:', error);
    return buildResponse(500, { message: 'Error retrieving artisan info' });
  }
}

async function handleUpdateArtisanInfo(event) {
  try {
    const artisanData = JSON.parse(event.body || '{}');

    // Validate the artisan data
    const validationResult = validate.artisanInfo(artisanData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Update the artisan info in the database
    const updatedArtisanInfo = await marketingModel.updateArtisanInfo(artisanData);

    return buildResponse(200, { artisanInfo: updatedArtisanInfo });
  } catch (error) {
    console.error('Error updating artisan info:', error);
    return buildResponse(500, { message: 'Error updating artisan info' });
  }
}

// Helper function to build the response
function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: body ? JSON.stringify(body) : ''
  };
}
