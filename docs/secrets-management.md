# Secrets Management

## Local Secrets

Local development uses `.env` files that are never committed. `.env.example` documents the required variable names without real values.

## Production Secrets

Production secrets should live in AWS Secrets Manager or AWS Systems Manager Parameter Store. Lambda retrieves secrets at runtime through its execution role.

## Required Today

- `DATABASE_URL`: PostgreSQL connection string for local PostgreSQL or RDS.
- `API_URL`: Frontend API base URL for the demo.

## Future Secrets

- `STRIPE_SECRET_KEY`: Future billing integration.
- `DOCUSIGN_API_KEY`: Future document workflow integration.
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: Avoid for CI/CD when possible. Prefer GitHub OIDC and temporary AWS credentials.

## Security Recommendations

- Never commit `.env` files or credentials.
- Never log connection strings, tokens, API keys, or environment variables.
- Scope Lambda secret reads to one application and stage path.
- Rotate credentials regularly.
- Use separate secrets for development, staging, and production.
