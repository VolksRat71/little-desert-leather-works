// Users microservice Lambda function
const mysql = require('mysql2/promise');
const { validate } = require('./validation');
const UserModel = require('./models/user');

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

// Initialize the User model
const userModel = new UserModel(pool);

// Main handler function
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Extract HTTP method and path
    const httpMethod = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // Route the request to the appropriate handler
    let response;
    if (path === '/users') {
      switch (httpMethod) {
        case 'GET':
          response = await handleGetUsers(event);
          break;
        case 'POST':
          response = await handleCreateUser(event);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path.match(/^\/users\/[\w-]+$/)) {
      // Extract the user ID from the path
      const userId = path.split('/').pop();

      switch (httpMethod) {
        case 'GET':
          response = await handleGetUserById(userId);
          break;
        case 'PUT':
          response = await handleUpdateUser(userId, event);
          break;
        case 'DELETE':
          response = await handleDeleteUser(userId);
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

// Handler for GET /users
async function handleGetUsers(event) {
  try {
    // Check if there are query parameters for pagination
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 1;

    // Get users from the database
    const users = await userModel.findAll(limit, page);

    return buildResponse(200, { users });
  } catch (error) {
    console.error('Error getting users:', error);
    return buildResponse(500, { message: 'Error retrieving users' });
  }
}

// Handler for GET /users/{userId}
async function handleGetUserById(userId) {
  try {
    // Get user from the database
    const user = await userModel.findById(userId);

    if (!user) {
      return buildResponse(404, { message: 'User not found' });
    }

    return buildResponse(200, { user });
  } catch (error) {
    console.error(`Error getting user ${userId}:`, error);
    return buildResponse(500, { message: 'Error retrieving user' });
  }
}

// Handler for POST /users
async function handleCreateUser(event) {
  try {
    // Parse the request body
    const userData = JSON.parse(event.body || '{}');

    // Validate the user data
    const validationResult = validate.createUser(userData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Create the user in the database
    const newUser = await userModel.create(userData);

    return buildResponse(201, { user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return buildResponse(500, { message: 'Error creating user' });
  }
}

// Handler for PUT /users/{userId}
async function handleUpdateUser(userId, event) {
  try {
    // Parse the request body
    const userData = JSON.parse(event.body || '{}');

    // Validate the user data
    const validationResult = validate.updateUser(userData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Check if the user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return buildResponse(404, { message: 'User not found' });
    }

    // Update the user in the database
    const updatedUser = await userModel.update(userId, userData);

    return buildResponse(200, { user: updatedUser });
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    return buildResponse(500, { message: 'Error updating user' });
  }
}

// Handler for DELETE /users/{userId}
async function handleDeleteUser(userId) {
  try {
    // Check if the user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return buildResponse(404, { message: 'User not found' });
    }

    // Delete the user from the database
    await userModel.delete(userId);

    return buildResponse(204, null);
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    return buildResponse(500, { message: 'Error deleting user' });
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
