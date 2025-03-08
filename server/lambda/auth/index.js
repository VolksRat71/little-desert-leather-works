// Auth microservice Lambda function
const mysql = require('mysql2/promise');
const { validate } = require('./validation');
const AuthModel = require('./models/auth');

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

// Initialize the Auth model
const authModel = new AuthModel(pool);

// Main handler function
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Extract HTTP method and path
    const httpMethod = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // Route the request to the appropriate handler
    let response;
    if (path === '/auth/register') {
      if (httpMethod === 'POST') {
        response = await handleRegister(event);
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/auth/login') {
      if (httpMethod === 'POST') {
        response = await handleLogin(event);
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/auth/forgot-password') {
      if (httpMethod === 'POST') {
        response = await handleForgotPassword(event);
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/auth/reset-password') {
      if (httpMethod === 'POST') {
        response = await handleResetPassword(event);
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/auth/verify-email') {
      if (httpMethod === 'POST') {
        response = await handleVerifyEmail(event);
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/auth/marketing-preferences') {
      if (httpMethod === 'PUT') {
        response = await handleUpdateMarketingPreferences(event);
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/auth/token/validate') {
      if (httpMethod === 'POST') {
        response = await handleValidateToken(event);
      } else {
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

// Handler for POST /auth/register
async function handleRegister(event) {
  try {
    // Parse the request body
    const userData = JSON.parse(event.body || '{}');

    // Validate the user data
    const validationResult = validate.register(userData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Register the user
    const result = await authModel.register(userData);

    // In a real application, you would send an email verification link here
    // For now, just return the verification token (this is not secure for production)

    return buildResponse(201, {
      message: 'User registered successfully',
      user: result.user,
      token: result.token,
      verificationToken: result.verificationToken // In production, remove this from the response
    });
  } catch (error) {
    if (error.message === 'Email already registered') {
      return buildResponse(409, { message: error.message });
    }
    console.error('Error registering user:', error);
    return buildResponse(500, { message: 'Error registering user' });
  }
}

// Handler for POST /auth/login
async function handleLogin(event) {
  try {
    // Parse the request body
    const userData = JSON.parse(event.body || '{}');

    // Validate the user data
    const validationResult = validate.login(userData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Login the user
    const result = await authModel.login(userData.email, userData.password);

    return buildResponse(200, {
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return buildResponse(401, { message: 'Invalid email or password' });
    }
    console.error('Error logging in:', error);
    return buildResponse(500, { message: 'Error during login' });
  }
}

// Handler for POST /auth/forgot-password
async function handleForgotPassword(event) {
  try {
    // Parse the request body
    const userData = JSON.parse(event.body || '{}');

    // Validate the user data
    const validationResult = validate.passwordResetRequest(userData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Request password reset
    const resetToken = await authModel.requestPasswordReset(userData.email);

    // Don't reveal if the email exists or not (security best practice)
    // For development purposes, return the token (in production, send email instead)
    return buildResponse(200, {
      message: 'If your email is in our system, you will receive a password reset link shortly',
      resetToken: resetToken // In production, remove this from the response
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return buildResponse(500, { message: 'Error requesting password reset' });
  }
}

// Handler for POST /auth/reset-password
async function handleResetPassword(event) {
  try {
    // Parse the request body
    const resetData = JSON.parse(event.body || '{}');

    // Validate the reset data
    const validationResult = validate.passwordReset(resetData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Reset the password
    await authModel.resetPassword(resetData.token, resetData.newPassword);

    return buildResponse(200, {
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    if (error.message === 'Invalid or expired token' || error.message === 'Token has expired') {
      return buildResponse(400, { message: error.message });
    }
    console.error('Error resetting password:', error);
    return buildResponse(500, { message: 'Error resetting password' });
  }
}

// Handler for POST /auth/verify-email
async function handleVerifyEmail(event) {
  try {
    // Parse the request body
    const verifyData = JSON.parse(event.body || '{}');

    // Validate the verify data
    const validationResult = validate.emailVerification(verifyData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Verify the email
    await authModel.verifyEmail(verifyData.token);

    return buildResponse(200, {
      message: 'Email has been verified successfully'
    });
  } catch (error) {
    if (error.message === 'Invalid or expired token' || error.message === 'Token has expired') {
      return buildResponse(400, { message: error.message });
    }
    console.error('Error verifying email:', error);
    return buildResponse(500, { message: 'Error verifying email' });
  }
}

// Handler for PUT /auth/marketing-preferences
async function handleUpdateMarketingPreferences(event) {
  try {
    // Get the user ID from the authenticated user
    const userId = getUserIdFromEvent(event);
    if (!userId) {
      return buildResponse(401, { message: 'Unauthorized' });
    }

    // Parse the request body
    const preferencesData = JSON.parse(event.body || '{}');

    // Validate the preferences data
    const validationResult = validate.marketingPreferences(preferencesData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Update the marketing preferences
    const updatedUser = await authModel.updateMarketingPreferences(userId, preferencesData);

    return buildResponse(200, {
      message: 'Marketing preferences updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating marketing preferences:', error);
    return buildResponse(500, { message: 'Error updating marketing preferences' });
  }
}

// Handler for POST /auth/token/validate
async function handleValidateToken(event) {
  try {
    // Parse the request body
    const tokenData = JSON.parse(event.body || '{}');

    if (!tokenData.token) {
      return buildResponse(400, { message: 'Token is required' });
    }

    // Verify the token
    const decodedToken = authModel.verifyToken(tokenData.token);

    // Get the user data
    const user = await authModel.getUserById(decodedToken.userId);
    if (!user) {
      return buildResponse(404, { message: 'User not found' });
    }

    return buildResponse(200, {
      valid: true,
      user
    });
  } catch (error) {
    return buildResponse(401, { valid: false, message: 'Invalid token' });
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

// Helper function to get the user ID from the event
// In a real application, this would be extracted from the JWT token
function getUserIdFromEvent(event) {
  try {
    // Get the authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    const decoded = authModel.verifyToken(token);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
