# Server Documentation

## Overview

The server-side architecture is built on AWS serverless technologies, primarily using Lambda functions for microservices, API Gateway for routing, and RDS for the database. The infrastructure is defined and deployed using Terraform.

## Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│             │     │             │     │                     │
│   Client    │────▶│ CloudFront  │────▶│   S3 Static Site    │
│             │     │             │     │                     │
└─────────────┘     └─────────────┘     └─────────────────────┘
       │
       │
       ▼
┌─────────────┐     ┌─────────────────────────────────────────┐
│             │     │                                         │
│ API Gateway │────▶│              Lambda Functions           │
│             │     │                                         │
└─────────────┘     │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
                    │  │         │ │         │ │         │   │
                    │  │  Users  │ │ Products│ │ Orders  │   │
                    │  │         │ │         │ │         │   │
                    │  └─────────┘ └─────────┘ └─────────┘   │
                    │                                         │
                    │  ┌─────────┐ ┌─────────┐               │
                    │  │         │ │         │               │
                    │  │  Auth   │ │Marketing│               │
                    │  │         │ │         │               │
                    │  └─────────┘ └─────────┘               │
                    │                                         │
                    └─────────────────────────────────────────┘
                                    │
                                    │
                                    ▼
                    ┌─────────────────────────────────────────┐
                    │                                         │
                    │             RDS Database                │
                    │                                         │
                    └─────────────────────────────────────────┘
```

## Directory Structure

```
server/
├── docs/                # Documentation
├── lambda/              # Lambda function code
│   ├── users/           # Users microservice
│   │   ├── models/      # Database models
│   │   │   └── user.js  # User model
│   │   ├── index.js     # Lambda handler
│   │   ├── validation.js # Input validation
│   │   └── package.json # Dependencies
│   ├── products/        # Products microservice
│   ├── orders/          # Orders microservice
│   ├── auth/            # Authentication microservice
│   └── marketing/       # Marketing microservice
└── terraform/           # Infrastructure as Code
    ├── main.tf          # Main Terraform configuration
    ├── variables.tf     # Input variables
    ├── outputs.tf       # Output values
    ├── environments/    # Environment-specific configurations
    │   ├── dev/         # Development environment
    │   ├── staging/     # Staging environment
    │   └── prod/        # Production environment
    └── modules/         # Reusable Terraform modules
        ├── network/     # VPC, subnets, etc.
        ├── database/    # RDS database
        ├── lambda/      # Lambda functions
        └── api_gateway/ # API Gateway
```

## Microservices Architecture

The application follows a microservices architecture, with each domain having its own dedicated Lambda function:

1. **Users Microservice**: Manages user accounts, profiles, and permissions.
2. **Products Microservice**: Handles product catalog, inventory, and pricing.
3. **Orders Microservice**: Processes customer orders, payments, and fulfillment.
4. **Auth Microservice**: Handles authentication, authorization, and token management.
5. **Marketing Microservice**: Manages promotions, discounts, and marketing campaigns.

Each microservice follows the same internal structure:

- **Handler**: The main entry point for the Lambda function.
- **Models**: Database models for interacting with the RDS database.
- **Validation**: Input validation logic.
- **Services**: Business logic and external service integrations.

## Lambda Function Structure

Each Lambda function follows a similar pattern:

```javascript
// Main handler function
exports.handler = async (event) => {
  try {
    // Extract HTTP method and path
    const httpMethod = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // Route the request to the appropriate handler
    let response;
    if (path === '/resource') {
      switch (httpMethod) {
        case 'GET':
          response = await handleGetResources(event);
          break;
        case 'POST':
          response = await handleCreateResource(event);
          break;
        // ...
      }
    } else if (path.match(/^\/resource\/[\w-]+$/)) {
      // Extract the resource ID from the path
      const resourceId = path.split('/').pop();

      switch (httpMethod) {
        case 'GET':
          response = await handleGetResourceById(resourceId);
          break;
        case 'PUT':
          response = await handleUpdateResource(resourceId, event);
          break;
        case 'DELETE':
          response = await handleDeleteResource(resourceId);
          break;
        // ...
      }
    }

    return response;
  } catch (error) {
    console.error('Error processing request:', error);
    return buildResponse(500, { message: 'Internal Server Error' });
  }
};
```

## Database Models

Database models encapsulate all database operations for a specific entity:

```javascript
class UserModel {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  async findAll(limit = 10, page = 1) {
    // Implementation
  }

  async findById(id) {
    // Implementation
  }

  async create(userData) {
    // Implementation
  }

  async update(id, userData) {
    // Implementation
  }

  async delete(id) {
    // Implementation
  }
}
```

## Validation

Input validation is handled by dedicated validation modules:

```javascript
function validateCreateUser(userData) {
  const errors = [];

  // Validate required fields
  if (!userData.username) {
    errors.push('Username is required');
  } else if (!isValidUsername(userData.username)) {
    errors.push('Username format is invalid');
  }

  // More validation rules...

  return {
    valid: errors.length === 0,
    errors
  };
}
```

## Infrastructure

The infrastructure is defined using Terraform and organized into modules:

### Network Module

The network module creates the VPC, subnets, Internet Gateway, NAT Gateway, and routing tables.

### Database Module

The database module provisions an RDS instance with the appropriate security groups and subnet groups.

### Lambda Module

The Lambda module creates the Lambda functions for each microservice, with the necessary IAM roles and security groups.

### API Gateway Module

The API Gateway module creates the API Gateway, routes, and integrations with the Lambda functions.

## Deployment

The infrastructure and application are deployed using GitHub Actions. The workflow includes:

1. **Validation**: Linting and testing the code.
2. **Terraform**: Initializing, validating, planning, and applying the Terraform configuration.
3. **Lambda Deployment**: Packaging and deploying the Lambda functions.
4. **Client Deployment**: Building and deploying the client application to S3.

## Environment Variables

Lambda functions use environment variables for configuration:

- `DB_HOST`: The hostname of the RDS instance.
- `DB_PORT`: The port of the RDS instance.
- `DB_NAME`: The name of the database.
- `DB_USERNAME`: The username for database access.
- `DB_PASSWORD`: The password for database access.
- `ENVIRONMENT`: The deployment environment (dev, staging, prod).

## Security

The infrastructure includes several security measures:

- **VPC**: All resources are deployed within a VPC for network isolation.
- **Security Groups**: Restrict access to resources based on the principle of least privilege.
- **IAM Roles**: Lambda functions use IAM roles with the minimum required permissions.
- **Secrets Management**: Sensitive information like database credentials are managed securely.

## Monitoring and Logging

Lambda functions log to CloudWatch Logs, and API Gateway access logs are also sent to CloudWatch Logs. This enables monitoring and troubleshooting of the application.

## Scaling

The serverless architecture automatically scales based on demand:

- **Lambda**: Scales automatically based on the number of concurrent requests.
- **API Gateway**: Handles high traffic without manual scaling.
- **RDS**: Can be scaled vertically (instance size) or horizontally (read replicas) as needed.
