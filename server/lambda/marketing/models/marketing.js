/**
 * Marketing Model
 * Handles all database operations related to marketing
 */
class MarketingModel {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  /**
   * Get all testimonials with pagination
   * @param {number} limit - Number of testimonials to return
   * @param {number} page - Page number for pagination
   * @returns {Promise<Array>} - Array of testimonial objects
   */
  async getTestimonials(limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, customer_name, content, rating, date, is_featured, is_approved
      FROM testimonials
      WHERE is_approved = 1
      ORDER BY is_featured DESC, date DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error in MarketingModel.getTestimonials:', error);
      throw error;
    }
  }

  /**
   * Get all testimonials (admin version, includes unapproved)
   * @param {number} limit - Number of testimonials to return
   * @param {number} page - Page number for pagination
   * @returns {Promise<Array>} - Array of testimonial objects
   */
  async getAllTestimonials(limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, customer_name, content, rating, date, is_featured, is_approved
      FROM testimonials
      ORDER BY date DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error in MarketingModel.getAllTestimonials:', error);
      throw error;
    }
  }

  /**
   * Create a new testimonial
   * @param {Object} testimonialData - Testimonial data
   * @returns {Promise<Object>} - Created testimonial
   */
  async createTestimonial(testimonialData) {
    const query = `
      INSERT INTO testimonials (customer_name, content, rating, is_approved)
      VALUES (?, ?, ?, ?)
    `;

    try {
      const [result] = await this.pool.execute(query, [
        testimonialData.customerName,
        testimonialData.content,
        testimonialData.rating,
        testimonialData.isApproved || 0 // Default to unapproved
      ]);

      return {
        id: result.insertId,
        customer_name: testimonialData.customerName,
        content: testimonialData.content,
        rating: testimonialData.rating,
        date: new Date().toISOString().split('T')[0],
        is_featured: 0,
        is_approved: testimonialData.isApproved || 0
      };
    } catch (error) {
      console.error('Error in MarketingModel.createTestimonial:', error);
      throw error;
    }
  }

  /**
   * Update a testimonial
   * @param {number} id - Testimonial ID
   * @param {Object} testimonialData - Testimonial data to update
   * @returns {Promise<Object>} - Updated testimonial
   */
  async updateTestimonial(id, testimonialData) {
    // Build the SET part of the query dynamically based on provided fields
    const setFields = [];
    const values = [];

    if (testimonialData.customerName) {
      setFields.push('customer_name = ?');
      values.push(testimonialData.customerName);
    }

    if (testimonialData.content) {
      setFields.push('content = ?');
      values.push(testimonialData.content);
    }

    if (testimonialData.rating !== undefined) {
      setFields.push('rating = ?');
      values.push(testimonialData.rating);
    }

    if (testimonialData.isFeatured !== undefined) {
      setFields.push('is_featured = ?');
      values.push(testimonialData.isFeatured ? 1 : 0);
    }

    if (testimonialData.isApproved !== undefined) {
      setFields.push('is_approved = ?');
      values.push(testimonialData.isApproved ? 1 : 0);
    }

    // If no fields to update, return the testimonial as is
    if (setFields.length === 0) {
      return this.getTestimonialById(id);
    }

    // Add the ID to the values array
    values.push(id);

    const query = `
      UPDATE testimonials
      SET ${setFields.join(', ')}
      WHERE id = ?
    `;

    try {
      await this.pool.execute(query, values);
      return this.getTestimonialById(id);
    } catch (error) {
      console.error(`Error in MarketingModel.updateTestimonial for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a testimonial by ID
   * @param {number} id - Testimonial ID
   * @returns {Promise<Object|null>} - Testimonial object or null if not found
   */
  async getTestimonialById(id) {
    const query = `
      SELECT id, customer_name, content, rating, date, is_featured, is_approved
      FROM testimonials
      WHERE id = ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error in MarketingModel.getTestimonialById for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a testimonial
   * @param {number} id - Testimonial ID
   * @returns {Promise<boolean>} - True if deleted, false otherwise
   */
  async deleteTestimonial(id) {
    const query = `
      DELETE FROM testimonials
      WHERE id = ?
    `;

    try {
      const [result] = await this.pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error in MarketingModel.deleteTestimonial for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all marketing campaigns
   * @param {number} limit - Number of campaigns to return
   * @param {number} page - Page number for pagination
   * @returns {Promise<Array>} - Array of campaign objects
   */
  async getCampaigns(limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, name, description, start_date, end_date, is_active, discount_code, discount_percentage
      FROM marketing_campaigns
      ORDER BY start_date DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error in MarketingModel.getCampaigns:', error);
      throw error;
    }
  }

  /**
   * Get active marketing campaigns
   * @returns {Promise<Array>} - Array of active campaign objects
   */
  async getActiveCampaigns() {
    const query = `
      SELECT id, name, description, start_date, end_date, is_active, discount_code, discount_percentage
      FROM marketing_campaigns
      WHERE is_active = 1 AND start_date <= CURDATE() AND (end_date IS NULL OR end_date >= CURDATE())
      ORDER BY start_date DESC
    `;

    try {
      const [rows] = await this.pool.execute(query);
      return rows;
    } catch (error) {
      console.error('Error in MarketingModel.getActiveCampaigns:', error);
      throw error;
    }
  }

  /**
   * Create a new marketing campaign
   * @param {Object} campaignData - Campaign data
   * @returns {Promise<Object>} - Created campaign
   */
  async createCampaign(campaignData) {
    const query = `
      INSERT INTO marketing_campaigns (name, description, start_date, end_date, is_active, discount_code, discount_percentage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await this.pool.execute(query, [
        campaignData.name,
        campaignData.description,
        campaignData.startDate,
        campaignData.endDate || null,
        campaignData.isActive ? 1 : 0,
        campaignData.discountCode,
        campaignData.discountPercentage
      ]);

      return {
        id: result.insertId,
        name: campaignData.name,
        description: campaignData.description,
        start_date: campaignData.startDate,
        end_date: campaignData.endDate || null,
        is_active: campaignData.isActive ? 1 : 0,
        discount_code: campaignData.discountCode,
        discount_percentage: campaignData.discountPercentage
      };
    } catch (error) {
      console.error('Error in MarketingModel.createCampaign:', error);
      throw error;
    }
  }

  /**
   * Update a marketing campaign
   * @param {number} id - Campaign ID
   * @param {Object} campaignData - Campaign data to update
   * @returns {Promise<Object>} - Updated campaign
   */
  async updateCampaign(id, campaignData) {
    // Build the SET part of the query dynamically based on provided fields
    const setFields = [];
    const values = [];

    if (campaignData.name) {
      setFields.push('name = ?');
      values.push(campaignData.name);
    }

    if (campaignData.description) {
      setFields.push('description = ?');
      values.push(campaignData.description);
    }

    if (campaignData.startDate) {
      setFields.push('start_date = ?');
      values.push(campaignData.startDate);
    }

    if (campaignData.endDate !== undefined) {
      setFields.push('end_date = ?');
      values.push(campaignData.endDate);
    }

    if (campaignData.isActive !== undefined) {
      setFields.push('is_active = ?');
      values.push(campaignData.isActive ? 1 : 0);
    }

    if (campaignData.discountCode) {
      setFields.push('discount_code = ?');
      values.push(campaignData.discountCode);
    }

    if (campaignData.discountPercentage !== undefined) {
      setFields.push('discount_percentage = ?');
      values.push(campaignData.discountPercentage);
    }

    // If no fields to update, return the campaign as is
    if (setFields.length === 0) {
      return this.getCampaignById(id);
    }

    // Add the ID to the values array
    values.push(id);

    const query = `
      UPDATE marketing_campaigns
      SET ${setFields.join(', ')}
      WHERE id = ?
    `;

    try {
      await this.pool.execute(query, values);
      return this.getCampaignById(id);
    } catch (error) {
      console.error(`Error in MarketingModel.updateCampaign for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a campaign by ID
   * @param {number} id - Campaign ID
   * @returns {Promise<Object|null>} - Campaign object or null if not found
   */
  async getCampaignById(id) {
    const query = `
      SELECT id, name, description, start_date, end_date, is_active, discount_code, discount_percentage
      FROM marketing_campaigns
      WHERE id = ?
    `;

    try {
      const [rows] = await this.pool.execute(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error in MarketingModel.getCampaignById for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a campaign
   * @param {number} id - Campaign ID
   * @returns {Promise<boolean>} - True if deleted, false otherwise
   */
  async deleteCampaign(id) {
    const query = `
      DELETE FROM marketing_campaigns
      WHERE id = ?
    `;

    try {
      const [result] = await this.pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error in MarketingModel.deleteCampaign for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get contact information
   * @returns {Promise<Object>} - Contact information
   */
  async getContactInfo() {
    const query = `
      SELECT email, phone, address, hours, show_map, show_address, show_phone
      FROM contact_info
      LIMIT 1
    `;

    try {
      const [rows] = await this.pool.execute(query);
      if (rows.length === 0) {
        // Return default values if no contact info is found
        return {
          email: 'contact@littledesertleatherworks.com',
          phone: '(512) 555-1234',
          address: '123 Craftsman Way, Austin, TX 78701',
          hours: 'Monday-Friday: 9am-5pm\nSaturday: 10am-4pm\nSunday: Closed',
          show_map: 1,
          show_address: 1,
          show_phone: 1
        };
      }
      return rows[0];
    } catch (error) {
      console.error('Error in MarketingModel.getContactInfo:', error);
      throw error;
    }
  }

  /**
   * Update contact information
   * @param {Object} contactData - Contact data to update
   * @returns {Promise<Object>} - Updated contact information
   */
  async updateContactInfo(contactData) {
    // Check if contact info exists
    const [existingInfo] = await this.pool.execute('SELECT 1 FROM contact_info LIMIT 1');

    if (existingInfo.length === 0) {
      // Insert new contact info
      const insertQuery = `
        INSERT INTO contact_info (email, phone, address, hours, show_map, show_address, show_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await this.pool.execute(insertQuery, [
        contactData.email,
        contactData.phone,
        contactData.address,
        contactData.hours,
        contactData.showMap ? 1 : 0,
        contactData.showAddress ? 1 : 0,
        contactData.showPhone ? 1 : 0
      ]);
    } else {
      // Update existing contact info
      const updateQuery = `
        UPDATE contact_info
        SET email = ?, phone = ?, address = ?, hours = ?, show_map = ?, show_address = ?, show_phone = ?
      `;

      await this.pool.execute(updateQuery, [
        contactData.email,
        contactData.phone,
        contactData.address,
        contactData.hours,
        contactData.showMap ? 1 : 0,
        contactData.showAddress ? 1 : 0,
        contactData.showPhone ? 1 : 0
      ]);
    }

    return this.getContactInfo();
  }

  /**
   * Get artisan information
   * @returns {Promise<Object>} - Artisan information
   */
  async getArtisanInfo() {
    const query = `
      SELECT name, title, image, bio, philosophy, skills, is_visible
      FROM artisan_info
      LIMIT 1
    `;

    try {
      const [rows] = await this.pool.execute(query);
      if (rows.length === 0) {
        // Return default values if no artisan info is found
        return {
          name: 'Morgan E Ludemann',
          title: 'Leather Craftsman',
          image: 'https://res.cloudinary.com/notsupreme/image/upload/v1741284098/a65mh1ahlaodo6antd5l.jpg',
          bio: 'As a leather artisan, I am dedicated to merging contemporary aesthetics with traditional craftsmanship...',
          philosophy: 'I am committed to the art of thoughtful craftsmanship, where creativity meets precision...',
          skills: JSON.stringify(['Hand-stitching', 'Tooling & Carving', 'Dyeing & Finishing', 'Pattern Making', 'Custom Design']),
          is_visible: 1
        };
      }

      // Parse skills JSON
      const artisanInfo = rows[0];
      if (artisanInfo.skills) {
        artisanInfo.skills = JSON.parse(artisanInfo.skills);
      }

      return artisanInfo;
    } catch (error) {
      console.error('Error in MarketingModel.getArtisanInfo:', error);
      throw error;
    }
  }

  /**
   * Update artisan information
   * @param {Object} artisanData - Artisan data to update
   * @returns {Promise<Object>} - Updated artisan information
   */
  async updateArtisanInfo(artisanData) {
    // Check if artisan info exists
    const [existingInfo] = await this.pool.execute('SELECT 1 FROM artisan_info LIMIT 1');

    // Convert skills array to JSON string if it's an array
    const skillsJson = Array.isArray(artisanData.skills)
      ? JSON.stringify(artisanData.skills)
      : artisanData.skills;

    if (existingInfo.length === 0) {
      // Insert new artisan info
      const insertQuery = `
        INSERT INTO artisan_info (name, title, image, bio, philosophy, skills, is_visible)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await this.pool.execute(insertQuery, [
        artisanData.name,
        artisanData.title,
        artisanData.image,
        artisanData.bio,
        artisanData.philosophy,
        skillsJson,
        artisanData.isVisible ? 1 : 0
      ]);
    } else {
      // Update existing artisan info
      const updateQuery = `
        UPDATE artisan_info
        SET name = ?, title = ?, image = ?, bio = ?, philosophy = ?, skills = ?, is_visible = ?
      `;

      await this.pool.execute(updateQuery, [
        artisanData.name,
        artisanData.title,
        artisanData.image,
        artisanData.bio,
        artisanData.philosophy,
        skillsJson,
        artisanData.isVisible ? 1 : 0
      ]);
    }

    return this.getArtisanInfo();
  }
}

module.exports = MarketingModel;
