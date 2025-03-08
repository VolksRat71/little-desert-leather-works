variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "little-desert-leather-works"
}

# VPC Variables
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

# RDS Variables
variable "database_name" {
  description = "Name of the database"
  type        = string
  default     = "little_desert_leather_works_dev"
}

variable "database_username" {
  description = "Username for the database"
  type        = string
  sensitive   = true
}

variable "database_password" {
  description = "Password for the database"
  type        = string
  sensitive   = true
}

variable "database_port" {
  description = "Port for the database"
  type        = number
  default     = 5432
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage in GiB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage in GiB"
  type        = number
  default     = 100
}
