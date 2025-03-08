variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the Lambda function"
  type        = list(string)
}

variable "lambda_security_group_ids" {
  description = "List of security group IDs for the Lambda function"
  type        = list(string)
}

variable "database_url" {
  description = "Connection string for the database"
  type        = string
  sensitive   = true
}
