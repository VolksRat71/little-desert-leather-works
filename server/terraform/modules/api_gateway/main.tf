# API Gateway
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.environment}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token"]
    max_age      = 300
  }

  tags = {
    Name = "${var.environment}-api"
  }
}

# API Gateway stage
resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = var.environment
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }

  tags = {
    Name = "${var.environment}-stage"
  }
}

# CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.environment}-api"
  retention_in_days = 30

  tags = {
    Name = "${var.environment}-api-logs"
  }
}

# API routes and integrations for each microservice
locals {
  # Define common routes for each service
  common_routes = {
    "GET"    = "get"
    "POST"   = "create"
    "PUT"    = "update"
    "DELETE" = "delete"
  }

  # Generate all route combinations
  routes = flatten([
    for service, lambda in var.lambda_functions : [
      for method, operation in local.common_routes : {
        service   = service
        method    = method
        path      = "/${service}"
        operation = operation
        lambda    = lambda
      }
    ]
  ])
}

# Create routes and integrations
resource "aws_apigatewayv2_integration" "lambda_integration" {
  for_each = { for idx, route in local.routes : "${route.service}-${route.method}" => route }

  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"
  integration_uri  = each.value.lambda.invoke_arn

  payload_format_version = "2.0"
  timeout_milliseconds   = 30000
}

resource "aws_apigatewayv2_route" "lambda_route" {
  for_each = { for idx, route in local.routes : "${route.service}-${route.method}" => route }

  api_id    = aws_apigatewayv2_api.main.id
  route_key = "${each.value.method} ${each.value.path}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration[each.key].id}"
}

# Lambda permissions for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  for_each = { for idx, route in local.routes : "${route.service}-${route.method}" => route }

  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*${each.value.path}"
}
