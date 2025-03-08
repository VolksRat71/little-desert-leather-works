variable "environment" {
  description = "Environment name (dev, stage, prod)"
  type        = string
}

variable "lambda_functions" {
  description = "Map of Lambda functions by service name"
  type = map(object({
    function_name = string
    arn           = string
    invoke_arn    = string
  }))
}
