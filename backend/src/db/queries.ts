import { randomUUID } from "crypto";
import { getPool } from "./connection";
import type { QueryClient } from "./connection";
import type { ListingAuditLogInput, ListingInput } from "../types/listing";

export async function insertListing(
  payload: ListingInput,
  client: QueryClient = getPool(),
) {
  const id = randomUUID();

  await client.query(
    `
      INSERT INTO listings (
        id,
        seller_name,
        seller_email,
        phone,
        property_address,
        city,
        state,
        zip,
        list_price,
        property_type,
        selected_package
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
    [
      id,
      payload.sellerName,
      payload.sellerEmail,
      payload.phone,
      payload.propertyAddress,
      payload.city,
      payload.state,
      payload.zip,
      payload.listPrice,
      payload.propertyType,
      payload.selectedPackage,
    ],
  );

  return id;
}

export async function insertListingAuditLog(
  payload: ListingAuditLogInput,
  client: QueryClient = getPool(),
) {
  await client.query(
    `
      INSERT INTO listing_audit_log (
        id,
        listing_id,
        event_type,
        actor_type,
        event_data
      )
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      randomUUID(),
      payload.listingId,
      payload.eventType,
      payload.actorType,
      JSON.stringify(payload.eventData),
    ],
  );
}
