import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.status(200).json({
    service: "aws-listing-migration-backend",
    status: "ok",
    endpoints: {
      createListing: "POST /api/listings/create",
    },
  });
}
