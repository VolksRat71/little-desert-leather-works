# Little Desert Leather Works - Server

This is the server component of the Little Desert Leather Works e-commerce application. It's built using Node.js, Express, Prisma, and deployed to AWS Lambda.

## Architecture

The server is designed using a serverless architecture:

- **API**: Express.js adapted for AWS Lambda using the serverless-http package
- **Database**: PostgreSQL on AWS RDS
- **ORM**: Prisma for database interactions
- **Infrastructure**: Defined with Terraform
- **Deployment**: Serverless Framework + GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20.x
- npm or yarn
- PostgreSQL (local development)
- AWS CLI configured with appropriate credentials
- Terraform (for infrastructure deployment)
- Serverless Framework (for Lambda deployment)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/your-username/little-desert-leather-works.git
cd little-desert-leather-works/server
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file example and update it with your values:

```bash
cp .env.example .env
```

4. Run Prisma migrations and generate the client:

```bash
npm run prisma:migrate
npm run prisma:generate
```

5. Start the development server:

```bash
npm run dev
```

The server will be available at http://localhost:3001

### Testing

Run the tests with:

```bash
npm test
```

## Deployment

### Infrastructure Setup (First Time)

1. Navigate to the infrastructure directory:

```bash
cd infra/environments/dev
```

2. Copy the Terraform variables example file and update with your values:

```bash
cp terraform.tfvars.example terraform.tfvars
```

3. Initialize and deploy the infrastructure:

```bash
terraform init
terraform apply
```

### API Deployment

The API can be deployed using the Serverless Framework:

```bash
npm run deploy
```

Alternatively, pushing to the main branch will trigger the GitHub Actions workflow to deploy automatically.

## Project Structure

```
server/
├── infra/               # Terraform infrastructure as code
│   ├── modules/         # Reusable Terraform modules
│   └── environments/    # Environment-specific configurations
├── prisma/              # Prisma schema and migrations
├── src/                 # Source code
│   ├── routes/          # API routes
│   └── index.ts         # Main application entry point
├── .env                 # Environment variables
├── serverless.yml       # Serverless Framework configuration
└── package.json         # Node.js dependencies
```

## API Endpoints

The API provides the following endpoints:

- `GET /api/health` - Health check
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create a product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create a user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create an order
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order
