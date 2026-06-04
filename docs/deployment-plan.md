# Deployment Plan

## Lambda

The backend is packaged as a Node.js 20 Lambda function. `serverless.yml` maps `POST /api/listings/create` to `src/handlers/createListing.handler`.

## API Gateway

API Gateway exposes the public HTTPS endpoint and forwards requests to Lambda. CORS should be restricted to the Vercel frontend domain in production.

## RDS PostgreSQL

RDS PostgreSQL stores listing and audit data. The Lambda should run in the same VPC as RDS, with security groups allowing Lambda-to-RDS traffic only on PostgreSQL port `5432`.

## CloudWatch

Lambda writes structured JSON logs to CloudWatch. Logs include request duration, status, listing ID, city, state, and property type. Logs do not include private seller contact data or secrets.

## GitHub Actions

The workflow installs dependencies, runs lint/build checks, and demonstrates deployment steps for both backend and frontend. AWS access should use GitHub OIDC with `aws-actions/configure-aws-credentials`.

## IAM Strategy

The Lambda execution role should follow least privilege:

- CloudWatch log write permissions.
- Read access to only the required Parameter Store paths or Secrets Manager secrets.
- Network access to RDS through VPC configuration and security groups.
- No broad S3, administrator, or wildcard service permissions.
