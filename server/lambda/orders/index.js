// Orders microservice Lambda function
const mysql = require('mysql2/promise');
const { validate } = require('./validation');
const OrderModel = require('./models/order');

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

// Initialize the Order model
const orderModel = new OrderModel(pool);

// Main handler function
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Extract HTTP method and path
    const httpMethod = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // Route the request to the appropriate handler
    let response;
    if (path === '/orders') {
      switch (httpMethod) {
        case 'GET':
          response = await handleGetOrders(event);
          break;
        case 'POST':
          response = await handleCreateOrder(event);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/orders/me') {
      if (httpMethod === 'GET') {
        response = await handleGetCurrentUserOrders(event);
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path.match(/^\/orders\/[\w-]+$/)) {
      // Extract the order ID from the path
      const orderId = path.split('/').pop();

      switch (httpMethod) {
        case 'GET':
          response = await handleGetOrderById(orderId);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path.match(/^\/orders\/[\w-]+\/status$/)) {
      // Extract the order ID from the path
      const orderId = path.split('/')[2];

      if (httpMethod === 'PATCH') {
        response = await handleUpdateOrderStatus(orderId, event);
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path.match(/^\/orders\/[\w-]+\/cancel$/)) {
      // Extract the order ID from the path
      const orderId = path.split('/')[2];

      if (httpMethod === 'POST') {
        response = await handleCancelOrder(orderId, event);
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

// Handler for GET /orders (admin only)
async function handleGetOrders(event) {
  try {
    // In a real application, you would check if the user is an admin

    // Check if there are query parameters for pagination
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 1;

    // Get orders from the database
    const orders = await orderModel.findAll(limit, page);

    return buildResponse(200, { orders });
  } catch (error) {
    console.error('Error getting orders:', error);
    return buildResponse(500, { message: 'Error retrieving orders' });
  }
}

// Handler for GET /orders/me
async function handleGetCurrentUserOrders(event) {
  try {
    // In a real application, you would get the user ID from the authenticated user
    // For now, assume it's available in the request context or query parameters
    const userId = getUserIdFromEvent(event);

    if (!userId) {
      return buildResponse(401, { message: 'Unauthorized' });
    }

    // Check if there are query parameters for pagination
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 1;

    // Get user's orders from the database
    const orders = await orderModel.findByUserId(userId, limit, page);

    return buildResponse(200, { orders });
  } catch (error) {
    console.error('Error getting current user orders:', error);
    return buildResponse(500, { message: 'Error retrieving orders' });
  }
}

// Handler for GET /orders/{orderId}
async function handleGetOrderById(orderId) {
  try {
    // Get order from the database
    const order = await orderModel.findById(orderId);

    if (!order) {
      return buildResponse(404, { message: 'Order not found' });
    }

    // In a real application, you would check if the user is authorized to view this order
    // Either the order belongs to the user or the user is an admin

    return buildResponse(200, { order });
  } catch (error) {
    console.error(`Error getting order ${orderId}:`, error);
    return buildResponse(500, { message: 'Error retrieving order' });
  }
}

// Handler for POST /orders
async function handleCreateOrder(event) {
  try {
    // Parse the request body
    const orderData = JSON.parse(event.body || '{}');

    // In a real application, you would get the user ID from the authenticated user
    // For now, validate that it's included in the request
    if (!orderData.userId) {
      orderData.userId = getUserIdFromEvent(event);
    }

    // Validate the order data
    const validationResult = validate.createOrder(orderData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Create the order in the database
    const newOrder = await orderModel.create(orderData);

    return buildResponse(201, { order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return buildResponse(500, { message: 'Error creating order' });
  }
}

// Handler for PATCH /orders/{orderId}/status
async function handleUpdateOrderStatus(orderId, event) {
  try {
    // In a real application, you would check if the user is authorized
    // (i.e., is an admin or the order belongs to the user)

    // Check if the order exists
    const existingOrder = await orderModel.findById(orderId);
    if (!existingOrder) {
      return buildResponse(404, { message: 'Order not found' });
    }

    // Parse the request body
    const statusData = JSON.parse(event.body || '{}');

    // Validate the status data
    const validationResult = validate.updateStatus(statusData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Update the order status in the database
    const updatedOrder = await orderModel.updateStatus(orderId, statusData.status);

    return buildResponse(200, { order: updatedOrder });
  } catch (error) {
    console.error(`Error updating order status for order ${orderId}:`, error);
    return buildResponse(500, { message: 'Error updating order status' });
  }
}

// Handler for POST /orders/{orderId}/cancel
async function handleCancelOrder(orderId, event) {
  try {
    // Check if the order exists
    const existingOrder = await orderModel.findById(orderId);
    if (!existingOrder) {
      return buildResponse(404, { message: 'Order not found' });
    }

    // In a real application, you would check if the user is authorized to cancel this order
    // Either the order belongs to the user or the user is an admin

    // Check if the order is already cancelled
    if (existingOrder.status === 'cancelled') {
      return buildResponse(400, { message: 'Order is already cancelled' });
    }

    // Check if the order can be cancelled (e.g., not already shipped)
    if (['shipped', 'delivered'].includes(existingOrder.status)) {
      return buildResponse(400, { message: `Order cannot be cancelled because it is already ${existingOrder.status}` });
    }

    // Parse the request body
    const cancelData = JSON.parse(event.body || '{}');

    // Validate the cancel data
    const validationResult = validate.cancelOrder(cancelData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Cancel the order in the database
    const cancelledOrder = await orderModel.cancelOrder(orderId, cancelData.reason);

    return buildResponse(200, { order: cancelledOrder });
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    return buildResponse(500, { message: 'Error cancelling order' });
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
// In a real application, this would be extracted from the authenticated user context
function getUserIdFromEvent(event) {
  // For now, just attempt to get it from query parameters
  const queryParams = event.queryStringParameters || {};
  return queryParams.userId || null;
}
