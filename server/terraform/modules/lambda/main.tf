# IAM role for Lambda functions
resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.environment}-lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.environment}-lambda-execution-role"
  }
}

# Lambda basic execution policy attachment
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda VPC access execution policy attachment
resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Security group for Lambda functions
resource "aws_security_group" "lambda" {
  name        = "${var.environment}-lambda-sg"
  description = "Security group for Lambda functions"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-lambda-sg"
  }
}

# Lambda functions for each microservice
resource "aws_lambda_function" "microservices" {
  for_each      = toset(var.services)
  function_name = "${var.environment}-${each.key}-service"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_execution_role.arn
  runtime       = "nodejs18.x"

  # For simplicity, using a dummy zip file - in production,
  # this would be your actual function code packaged correctly
  filename      = "${path.module}/lambda_function_payload.zip"

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = var.db_host
      DB_PORT     = var.db_port
      DB_NAME     = var.db_name
      DB_USERNAME = var.db_username
      DB_PASSWORD = var.db_password
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name = "${var.environment}-${each.key}-service"
  }
}

# Placeholder zip file creation for Lambda functions
resource "local_file" "lambda_function_placeholder" {
  content  = "exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify({ message: 'Hello from ${var.environment} Lambda!' }) }; };"
  filename = "${path.module}/index.js"
}

data "archive_file" "lambda_zip" {
  depends_on  = [local_file.lambda_function_placeholder]
  type        = "zip"
  source_file = "${path.module}/index.js"
  output_path = "${path.module}/lambda_function_payload.zip"
}
