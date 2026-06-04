import type { APIGatewayProxyResultV2 } from "aws-lambda";
import { selectListings } from "../db/queries";
import { getSafeErrorDetails } from "../utils/errorDetails";
import { logger } from "../utils/logger";
import { ok, serverError } from "../utils/response";

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const startedAt = Date.now();

  try {
    const listings = await selectListings();

    logger.info("Listings loaded", {
      listingCount: listings.length,
      requestDurationMs: Date.now() - startedAt,
      status: 200,
    });

    return ok({ success: true, listings });
  } catch (error) {
    logger.error("Listing load failed", {
      ...getSafeErrorDetails(error),
      requestDurationMs: Date.now() - startedAt,
      status: 500,
    });

    return serverError();
  }
}
