variable "environment" {
  description = "Environment name (dev, stage, prod)"
  type        = string
}

variable "region" {
  description = "AWS region to deploy resources"
  type        = string
}

variable "cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b", "us-west-2c"]
}
