# Security group for RDS
resource "aws_security_group" "rds" {
  name        = "${var.environment}-rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = var.vpc_id

  # Allow MySQL/MariaDB traffic from Lambda security group
  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    description     = "MySQL/MariaDB access from Lambda functions"
    security_groups = [aws_security_group.lambda_rds_access.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-rds-sg"
  }
}

# Security group for Lambda to access RDS
resource "aws_security_group" "lambda_rds_access" {
  name        = "${var.environment}-lambda-rds-sg"
  description = "Security group for Lambda functions to access RDS"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-lambda-rds-sg"
  }
}

# DB subnet group
resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${var.environment}-db-subnet-group"
  }
}

# RDS instance
resource "aws_db_instance" "main" {
  allocated_storage      = var.db_allocated_storage
  storage_type           = "gp2"
  engine                 = var.db_engine
  engine_version         = var.db_engine_version
  instance_class         = var.db_instance_class
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  parameter_group_name   = "default.${var.db_engine}${var.db_engine_version}"
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true

  # For production, set these parameters accordingly
  # backup_retention_period = 7
  # maintenance_window      = "Mon:00:00-Mon:03:00"
  # backup_window           = "03:00-06:00"
  # multi_az                = true

  tags = {
    Name = "${var.environment}-rds"
  }
}
