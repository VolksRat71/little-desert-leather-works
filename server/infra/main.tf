terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # These values will be set by environment-specific configuration
    # bucket         = "little-desert-leather-works-tfstate"
    # key            = "terraform.tfstate"
    # region         = "us-east-1"
    # dynamodb_table = "little-desert-leather-works-tfstate-lock"
    # encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "little-desert-leather-works"
      ManagedBy   = "terraform"
    }
  }
}

# VPC module for networking
module "vpc" {
  source = "./modules/vpc"

  environment        = var.environment
  project_name       = var.project_name
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
}

# RDS module for PostgreSQL database
module "rds" {
  source = "./modules/rds"

  environment             = var.environment
  project_name            = var.project_name
  subnet_ids              = module.vpc.database_subnet_ids
  vpc_security_group_ids  = [module.vpc.database_security_group_id]
  database_name           = var.database_name
  database_username       = var.database_username
  database_password       = var.database_password
  database_port           = var.database_port
  db_instance_class       = var.db_instance_class
  db_allocated_storage    = var.db_allocated_storage
  db_max_allocated_storage = var.db_max_allocated_storage
  multi_az               = var.environment == "prod" ? true : false
}

# Lambda module for serverless API
module "lambda" {
  source = "./modules/lambda"

  environment                = var.environment
  project_name               = var.project_name
  vpc_id                     = module.vpc.vpc_id
  subnet_ids                 = module.vpc.private_subnet_ids
  lambda_security_group_ids  = [module.vpc.lambda_security_group_id]
  database_url               = "postgresql://${var.database_username}:${var.database_password}@${module.rds.db_instance_endpoint}/${var.database_name}"
}

# API Gateway module for REST API
module "api_gateway" {
  source = "./modules/api_gateway"

  environment       = var.environment
  project_name      = var.project_name
  lambda_invoke_arn = module.lambda.lambda_invoke_arn
  lambda_name       = module.lambda.lambda_name
}

# S3 and CloudFront module for client hosting
module "client_hosting" {
  source = "./modules/s3_cloudfront"

  environment  = var.environment
  project_name = var.project_name
  api_url      = module.api_gateway.api_gateway_endpoint
}
