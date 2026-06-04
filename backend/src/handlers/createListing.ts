import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ZodError } from "zod";
import { createListingWithAudit } from "../services/listingService";
import { getSafeErrorDetails } from "../utils/errorDetails";
import { logger } from "../utils/logger";
import { created, serverError, validationError } from "../utils/response";
import { listingSchema } from "../validation/listingSchema";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const startedAt = Date.now();

  try {
    let body: unknown = {};

    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch {
      logger.warn("Listing request contained invalid JSON", {
        requestDurationMs: Date.now() - startedAt,
        status: 400,
      });

      return validationError([{ message: "Request body must be valid JSON" }]);
    }

    const payload = listingSchema.parse(body);
    const listingId = await createListingWithAudit(payload);

    logger.info("Listing created", {
      city: payload.city,
      listingId,
      propertyType: payload.propertyType,
      requestDurationMs: Date.now() - startedAt,
      state: payload.state,
      status: 201,
    });

    return created({ success: true, listingId });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Listing validation failed", {
        requestDurationMs: Date.now() - startedAt,
        status: 400,
      });

      return validationError(error.issues);
    }

    logger.error("Listing creation failed", {
      ...getSafeErrorDetails(error),
      requestDurationMs: Date.now() - startedAt,
      status: 500,
    });

    return serverError();
  }
}
