terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "little-desert-leather-works-tfstate-dev"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "little-desert-leather-works-tfstate-lock-dev"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "terraform"
    }
  }
}

module "little_desert_leather_works" {
  source = "../../"

  environment              = var.environment
  project_name             = var.project_name
  aws_region               = var.aws_region
  vpc_cidr                 = var.vpc_cidr
  availability_zones       = var.availability_zones
  database_name            = var.database_name
  database_username        = var.database_username
  database_password        = var.database_password
  database_port            = var.database_port
  db_instance_class        = var.db_instance_class
  db_allocated_storage     = var.db_allocated_storage
  db_max_allocated_storage = var.db_max_allocated_storage
}
