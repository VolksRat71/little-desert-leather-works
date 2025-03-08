resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-${var.environment}-lambda-role"

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
    Name = "${var.project_name}-${var.environment}-lambda-role"
  }
}

resource "aws_iam_policy" "lambda_policy" {
  name = "${var.project_name}-${var.environment}-lambda-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "rds:*"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-lambda-policy"
  }
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# Basic example for Lambda function - to be triggered by serverless deploy
resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-${var.environment}-api"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 1024

  # This will be a placeholder initially, as we'll use Serverless Framework to deploy
  filename         = "${path.module}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.module}/placeholder.zip")

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.lambda_security_group_ids
  }

  environment {
    variables = {
      NODE_ENV     = var.environment
      DATABASE_URL = var.database_url
    }
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-api"
  }

  # Workaround to be able to create a placeholder Lambda that will be updated by Serverless Framework
  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
      handler,
      runtime,
      layers,
      environment
    ]
  }
}

# Create empty placeholder.zip file for initial Lambda deployment
resource "local_file" "placeholder" {
  filename = "${path.module}/placeholder.js"
  content  = "exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify({ message: 'Placeholder Lambda function' }) }; };"
}

data "archive_file" "placeholder" {
  type        = "zip"
  output_path = "${path.module}/placeholder.zip"
  source {
    content  = local_file.placeholder.content
    filename = "index.js"
  }
  depends_on = [local_file.placeholder]
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.api.function_name}"
  retention_in_days = 30

  tags = {
    Name = "${var.project_name}-${var.environment}-lambda-logs"
  }
}
