output "db_hostname" {
  description = "The hostname of the RDS instance"
  value       = aws_db_instance.main.address
}

output "db_port" {
  description = "The port of the RDS instance"
  value       = aws_db_instance.main.port
}

output "db_name" {
  description = "The name of the database"
  value       = aws_db_instance.main.db_name
}

output "lambda_rds_sg_id" {
  description = "ID of the security group for Lambda to access RDS"
  value       = aws_security_group.lambda_rds_access.id
}
