# Architecture

## Diagram

```text
User
  |
  v
Next.js Frontend
  |
  v
API Gateway
  |
  v
AWS Lambda createListing handler
  |
  v
RDS PostgreSQL
  |
  v
CloudWatch Logs
```

## Request Flow

1. The seller submits the listing form from the Next.js frontend.
2. The frontend sends a `POST /api/listings/create` request to API Gateway.
3. API Gateway invokes the Lambda handler.
4. The handler parses JSON and validates the payload with Zod.
5. The service layer creates the listing and audit log.
6. The handler returns `201` with the generated `listingId`.

## Database Flow

The Lambda does not contain inline SQL. It calls the listing service, which calls the database query module. The query module uses `pg` and a reusable connection pool configured from `DATABASE_URL`.

## Audit Logging Flow

After a listing is inserted, the service creates a `LISTING_CREATED` audit event with `actor_type` set to `SELLER`. The audit payload intentionally excludes seller email, phone, full address, credentials, and tokens.
