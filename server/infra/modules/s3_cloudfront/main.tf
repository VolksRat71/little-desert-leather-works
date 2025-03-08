resource "aws_s3_bucket" "client" {
  bucket = "${var.project_name}-${var.environment}-client"

  tags = {
    Name = "${var.project_name}-${var.environment}-client"
  }
}

resource "aws_s3_bucket_public_access_block" "client" {
  bucket = aws_s3_bucket.client.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "client" {
  bucket = aws_s3_bucket.client.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_versioning" "client" {
  bucket = aws_s3_bucket.client.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_cloudfront_origin_access_identity" "client" {
  comment = "Origin Access Identity for ${var.project_name}-${var.environment}-client"
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.client.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.client.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "client" {
  bucket = aws_s3_bucket.client.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_cloudfront_distribution" "client" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # Use only North America and Europe edge locations

  origin {
    domain_name = aws_s3_bucket.client.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.client.bucket}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.client.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.client.bucket}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # SPA handling for client-side routing
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-distribution"
  }
}

# CloudFront invalidation resource (placeholder) - actual invalidations will be done via CI/CD
resource "null_resource" "invalidate_cache" {
  triggers = {
    distribution_id = aws_cloudfront_distribution.client.id
  }

  provisioner "local-exec" {
    command = "echo 'CloudFront distribution created: ${aws_cloudfront_distribution.client.id}'"
  }
}
