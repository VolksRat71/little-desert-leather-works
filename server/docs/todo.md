# Pre-Deployment Checklist

This document outlines the tasks that should be completed before deploying the application to production.

## Infrastructure Preparation

- [ ] Create an S3 bucket for Terraform state storage
  ```
  aws s3 mb s3://little-desert-leather-works-terraform --region us-west-2
  ```

- [ ] Enable versioning on the Terraform state bucket
  ```
  aws s3api put-bucket-versioning --bucket little-desert-leather-works-terraform --versioning-configuration Status=Enabled
  ```

- [ ] Create a DynamoDB table for Terraform state locking (optional but recommended for production)
  ```
  aws dynamodb create-table \
    --table-name terraform-state-lock \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region us-west-2
  ```

- [ ] Create an S3 bucket for the client application
  ```
  aws s3 mb s3://little-desert-leather-works-website --region us-west-2
  ```

- [ ] Configure the client S3 bucket for static website hosting
  ```
  aws s3 website s3://little-desert-leather-works-website --index-document index.html --error-document index.html
  ```

## Environment Variables and Secrets

- [ ] Create a `.env` file for local development
- [ ] Set up GitHub repository secrets for CI/CD:
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `DB_PASSWORD`
  - [ ] `CLOUDFRONT_DISTRIBUTION_ID` (after CloudFront is set up)

## Database Preparation

- [ ] Create database schema SQL scripts
  - [ ] Users table
  - [ ] Products table
  - [ ] Orders table
  - [ ] Other required tables

- [ ] Test database connection from local environment
  ```
  mysql -h <db_hostname> -P <db_port> -u <db_username> -p<db_password> <db_name>
  ```

- [ ] Prepare database migration strategy
  - [ ] Consider using a tool like Flyway or Liquibase for production

## Lambda Functions

- [ ] Implement all required Lambda functions:
  - [ ] Users microservice
  - [ ] Products microservice
  - [ ] Orders microservice
  - [ ] Auth microservice
  - [ ] Marketing microservice

- [ ] Test Lambda functions locally
  ```
  npm test
  ```

- [ ] Package Lambda functions for deployment
  ```
  cd server/lambda/users
  npm ci --production
  zip -r function.zip .
  ```

## API Gateway

- [ ] Test API endpoints locally
  ```
  curl -X GET http://localhost:3001/users
  ```

- [ ] Prepare API documentation (e.g., Swagger/OpenAPI)

## Client Application

- [ ] Update API client configuration with the correct API Gateway URL
- [ ] Build and test the client application
  ```
  cd client
  npm run build
  ```

## Terraform Configuration

- [ ] Review Terraform configuration for all environments
  - [ ] Development
  - [ ] Staging
  - [ ] Production

- [ ] Validate Terraform configuration
  ```
  cd server/terraform
  terraform validate
  ```

- [ ] Run Terraform plan and review the output
  ```
  cd server/terraform
  terraform plan -var="db_password=<password>" -out=tfplan
  ```

## Security

- [ ] Review IAM roles and permissions
- [ ] Ensure all security groups follow the principle of least privilege
- [ ] Configure CORS settings for API Gateway
- [ ] Set up CloudFront with HTTPS
- [ ] Implement proper authentication and authorization

## Monitoring and Logging

- [ ] Set up CloudWatch alarms for critical metrics
- [ ] Configure log retention policies
- [ ] Set up error notifications (e.g., SNS topics)

## Backup and Disaster Recovery

- [ ] Configure RDS automated backups
- [ ] Test database restore procedure
- [ ] Document disaster recovery procedures

## Performance Testing

- [ ] Conduct load testing on API endpoints
- [ ] Optimize Lambda function performance
- [ ] Configure appropriate Lambda function memory and timeout settings

## Documentation

- [ ] Update all documentation with final deployment details
- [ ] Document API endpoints
- [ ] Document database schema
- [ ] Create user guides

## Final Checks

- [ ] Run all tests one final time
- [ ] Verify all environment variables are correctly set
- [ ] Review Terraform plan output one final time
- [ ] Ensure all team members are aware of the deployment schedule
- [ ] Prepare rollback plan in case of deployment issues
