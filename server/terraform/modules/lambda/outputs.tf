output "lambda_functions" {
  description = "Map of Lambda functions by service name"
  value = {
    for service, lambda in aws_lambda_function.microservices : service => {
      function_name = lambda.function_name
      arn           = lambda.arn
      invoke_arn    = lambda.invoke_arn
    }
  }
}

output "lambda_execution_role_arn" {
  description = "ARN of the Lambda execution role"
  value       = aws_iam_role.lambda_execution_role.arn
}

output "lambda_security_group_id" {
  description = "ID of the Lambda security group"
  value       = aws_security_group.lambda.id
}
