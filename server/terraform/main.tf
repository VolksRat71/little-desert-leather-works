terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Configure your backend as needed
    bucket = "little-desert-leather-works-terraform"
    key    = "terraform.tfstate"
    region = "us-west-2"
    # For production, enable these features
    # encrypt        = true
    # dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "LittleDesertLeatherWorks"
      ManagedBy   = "Terraform"
    }
  }
}

# Network module
module "network" {
  source      = "./modules/network"
  environment = var.environment
  region      = var.region
  cidr_block  = var.vpc_cidr
}

# RDS module
module "database" {
  source               = "./modules/database"
  environment          = var.environment
  vpc_id               = module.network.vpc_id
  private_subnet_ids   = module.network.private_subnet_ids
  db_name              = var.db_name
  db_username          = var.db_username
  db_password          = var.db_password
  db_instance_class    = var.db_instance_class
  db_allocated_storage = var.db_allocated_storage
  db_engine            = var.db_engine
  db_engine_version    = var.db_engine_version
}

# Lambda functions
module "lambda_functions" {
  source             = "./modules/lambda"
  environment        = var.environment
  vpc_id             = module.network.vpc_id
  private_subnet_ids = module.network.private_subnet_ids
  db_host            = module.database.db_hostname
  db_port            = module.database.db_port
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
  services           = ["users", "products", "orders", "auth", "marketing"]
}

# API Gateway
module "api_gateway" {
  source            = "./modules/api_gateway"
  environment       = var.environment
  lambda_functions  = module.lambda_functions.lambda_functions
}

# Outputs
output "api_gateway_endpoint" {
  description = "API Gateway Invoke URL"
  value       = module.api_gateway.api_gateway_endpoint
}

output "db_connection_details" {
  description = "Database connection details"
  value = {
    hostname = module.database.db_hostname
    port     = module.database.db_port
    name     = var.db_name
    username = var.db_username
    password = "sensitive - not displayed"
  }
  sensitive = true
}
