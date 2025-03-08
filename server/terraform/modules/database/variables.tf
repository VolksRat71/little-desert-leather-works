variable "environment" {
  description = "Environment name (dev, stage, prod)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs of the private subnets"
  type        = list(string)
}

variable "db_name" {
  description = "Name of the database"
  type        = string
}

variable "db_username" {
  description = "Username for database access"
  type        = string
}

variable "db_password" {
  description = "Password for database access"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
}

variable "db_allocated_storage" {
  description = "Allocated storage for the database (GB)"
  type        = number
}

variable "db_engine" {
  description = "Database engine to use"
  type        = string
}

variable "db_engine_version" {
  description = "Database engine version"
  type        = string
}
