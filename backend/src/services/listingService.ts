import { createListingAuditLog } from "./auditService";
import { getPool } from "../db/connection";
import { insertListing } from "../db/queries";
import type { ListingInput } from "../types/listing";

export async function createListingWithAudit(payload: ListingInput) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const listingId = await insertListing(payload, client);

    await createListingAuditLog({
      client,
      listingId,
      payload,
    });

    await client.query("COMMIT");

    return listingId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
