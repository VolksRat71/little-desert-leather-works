// Products microservice Lambda function
const mysql = require('mysql2/promise');
const { validate } = require('./validation');
const ProductModel = require('./models/product');

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

// Initialize the Product model
const productModel = new ProductModel(pool);

// Main handler function
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Extract HTTP method and path
    const httpMethod = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // Route the request to the appropriate handler
    let response;
    if (path === '/products') {
      switch (httpMethod) {
        case 'GET':
          response = await handleGetProducts(event);
          break;
        case 'POST':
          response = await handleCreateProduct(event);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path.match(/^\/products\/[\w-]+$/)) {
      // Extract the product ID from the path
      const productId = path.split('/').pop();

      switch (httpMethod) {
        case 'GET':
          response = await handleGetProductById(productId);
          break;
        case 'PUT':
          response = await handleUpdateProduct(productId, event);
          break;
        case 'DELETE':
          response = await handleDeleteProduct(productId);
          break;
        default:
          return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/products/search') {
      if (httpMethod === 'GET') {
        response = await handleSearchProducts(event);
      } else {
        return buildResponse(404, { message: 'Not Found' });
      }
    } else if (path === '/products/category') {
      if (httpMethod === 'GET') {
        response = await handleGetProductsByCategory(event);
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

// Handler for GET /products
async function handleGetProducts(event) {
  try {
    // Check if there are query parameters for pagination
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 1;

    // Get products from the database
    const products = await productModel.findAll(limit, page);

    return buildResponse(200, { products });
  } catch (error) {
    console.error('Error getting products:', error);
    return buildResponse(500, { message: 'Error retrieving products' });
  }
}

// Handler for GET /products/{productId}
async function handleGetProductById(productId) {
  try {
    // Get product from the database
    const product = await productModel.findById(productId);

    if (!product) {
      return buildResponse(404, { message: 'Product not found' });
    }

    return buildResponse(200, { product });
  } catch (error) {
    console.error(`Error getting product ${productId}:`, error);
    return buildResponse(500, { message: 'Error retrieving product' });
  }
}

// Handler for GET /products/category
async function handleGetProductsByCategory(event) {
  try {
    const queryParams = event.queryStringParameters || {};
    if (!queryParams.name) {
      return buildResponse(400, { message: 'Category name is required' });
    }

    const category = queryParams.name;
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 1;

    const products = await productModel.findByCategory(category, limit, page);

    return buildResponse(200, { products });
  } catch (error) {
    console.error('Error getting products by category:', error);
    return buildResponse(500, { message: 'Error retrieving products by category' });
  }
}

// Handler for GET /products/search
async function handleSearchProducts(event) {
  try {
    const queryParams = event.queryStringParameters || {};
    if (!queryParams.q) {
      return buildResponse(400, { message: 'Search query is required' });
    }

    const searchTerm = queryParams.q;
    const limit = parseInt(queryParams.limit) || 10;
    const page = parseInt(queryParams.page) || 1;

    const products = await productModel.search(searchTerm, limit, page);

    return buildResponse(200, { products, query: searchTerm });
  } catch (error) {
    console.error('Error searching products:', error);
    return buildResponse(500, { message: 'Error searching products' });
  }
}

// Handler for POST /products
async function handleCreateProduct(event) {
  try {
    // Parse the request body
    const productData = JSON.parse(event.body || '{}');

    // Validate the product data
    const validationResult = validate.createProduct(productData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Create the product in the database
    const newProduct = await productModel.create(productData);

    return buildResponse(201, { product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return buildResponse(500, { message: 'Error creating product' });
  }
}

// Handler for PUT /products/{productId}
async function handleUpdateProduct(productId, event) {
  try {
    // Parse the request body
    const productData = JSON.parse(event.body || '{}');

    // Validate the product data
    const validationResult = validate.updateProduct(productData);
    if (!validationResult.valid) {
      return buildResponse(400, { message: 'Validation error', errors: validationResult.errors });
    }

    // Check if the product exists
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return buildResponse(404, { message: 'Product not found' });
    }

    // Update the product in the database
    const updatedProduct = await productModel.update(productId, productData);

    return buildResponse(200, { product: updatedProduct });
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    return buildResponse(500, { message: 'Error updating product' });
  }
}

// Handler for DELETE /products/{productId}
async function handleDeleteProduct(productId) {
  try {
    // Check if the product exists
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return buildResponse(404, { message: 'Product not found' });
    }

    // Delete the product from the database
    await productModel.delete(productId);

    return buildResponse(204, null);
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    return buildResponse(500, { message: 'Error deleting product' });
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
