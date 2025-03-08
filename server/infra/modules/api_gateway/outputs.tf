output "api_gateway_id" {
  description = "ID of the API Gateway"
  value       = aws_apigatewayv2_api.api.id
}

output "api_gateway_arn" {
  description = "ARN of the API Gateway"
  value       = aws_apigatewayv2_api.api.arn
}

output "api_gateway_execution_arn" {
  description = "Execution ARN of the API Gateway"
  value       = aws_apigatewayv2_api.api.execution_arn
}

output "api_gateway_endpoint" {
  description = "Endpoint of the API Gateway"
  value       = aws_apigatewayv2_stage.api.invoke_url
}
