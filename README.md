# AWS Migration Real Estate Listing PoC

This proof of concept demonstrates how a Netlify Function-style backend can move toward an AWS-ready Lambda/API Gateway architecture for a real estate SaaS workflow.

It is intentionally small. The focus is architecture, validation, PostgreSQL readiness, audit logging, error handling, safe logging, and secure environment planning.

## Architecture

```text
Next.js frontend
  -> API Gateway
  -> AWS Lambda TypeScript handler
  -> RDS PostgreSQL
  -> CloudWatch Logs
```

## Project Structure

- `frontend`: Next.js 15 App Router demo UI.
- `backend`: AWS Lambda-compatible TypeScript API.
- `migrations`: PostgreSQL schema files for listings and audit logs.
- `docs`: Architecture, deployment, and secrets documentation.

## Setup

Install dependencies separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create local environment files from `.env.example`.

This demo is intended to run locally. The frontend is not deployed live for this submission. The backend is written to be deployable to AWS Lambda/API Gateway, but actual AWS deployment is documented only.

If the frontend is deployed to Vercel for demo purposes, set the Vercel project `Root Directory` to `frontend`. Deploying from the repository root will produce a Vercel `404: NOT_FOUND` because the Next.js app is not located at the root.

Vercel settings for this repo:

- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave empty/default

Do not set the Output Directory to `public`. This is a Next.js app, not a static site. If Vercel shows `No Output Directory named "public" found after the Build completed`, remove `public` from the Output Directory setting and redeploy. The frontend also includes `frontend/vercel.json`, which sets the Vercel output directory to `.next`.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string used by the backend.
- `PORT`: Local backend port. Use `3001`.
- `NEXT_PUBLIC_API_URL`: Browser-safe frontend API base URL. Use `http://localhost:3001`.

Future Stripe, DocuSign, and AWS secrets should be stored in AWS Secrets Manager or Parameter Store, not in source control.

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-SUPABASE-HOST]:5432/postgres
PORT=3001
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Do not commit real `.env` files or database credentials.

## Supabase PostgreSQL Migrations

This project uses Supabase only as a PostgreSQL database for the local demo. The target production database is AWS RDS PostgreSQL.

To get the Supabase connection string:

1. Open the Supabase project dashboard.
2. Go to `Project Settings` -> `Database`.
3. Copy the PostgreSQL connection string.
4. Replace `[YOUR-PASSWORD]` with the database password.
5. Put that value into `backend/.env` as `DATABASE_URL`.

Run the migrations:

```bash
cd backend
npm install
npm run migrate
```

Expected output:

```text
Applied 001_create_listings.sql
Applied 002_create_listing_audit_log.sql
```

The migration command applies:

- `migrations/001_create_listings.sql`
- `migrations/002_create_listing_audit_log.sql`

Alternative: paste those SQL files into the Supabase SQL Editor and run them in order.

## Running Locally

Start the backend API:

```bash
cd backend
npm run dev
```

The local backend listens on:

```text
http://localhost:3001/api/listings/create
```

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

Local run order:

1. Add `backend/.env`.
2. Add `frontend/.env.local`.
3. Run `npm run migrate` from `backend`.
4. Run `npm run dev` from `backend`.
5. Run `npm run dev` from `frontend`.
6. Open `http://localhost:3000`.

## Testing The Endpoint

Example request:

```bash
curl -X POST "http://localhost:3001/api/listings/create" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerName": "Pat Seller",
    "sellerEmail": "pat@example.com",
    "phone": "555-0100",
    "propertyAddress": "123 Market Street",
    "city": "Austin",
    "state": "TX",
    "zip": "78701",
    "listPrice": 450000,
    "propertyType": "Single family",
    "selectedPackage": "Premium"
  }'
```

Success response:

```json
{
  "success": true,
  "listingId": "uuid"
}
```

Validation response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Future AWS Deployment

The backend can be packaged as a Lambda function behind API Gateway. RDS PostgreSQL stores listing and audit data. CloudWatch receives structured logs. GitHub Actions should use OIDC to assume a limited AWS deployment role instead of static AWS credentials.

See `docs/deployment-plan.md` and `docs/secrets-management.md` for the full plan.

## Loom Talking Points

1. Project structure.
2. Frontend listing form.
3. Zod validation and API responses.
4. PostgreSQL listing and audit schema.
5. Audit logging without sensitive seller data.
6. Lambda/API Gateway deployment shape.
7. Secrets Manager or Parameter Store strategy.
8. Logging strategy.
9. Improvements: unit tests, integration tests, Terraform or CDK, OpenTelemetry, rate limiting, authentication, dashboards, structured logging, and migration tooling.
