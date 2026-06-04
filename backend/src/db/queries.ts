import { randomUUID } from "crypto";
import { getPool } from "./connection";
import type { QueryClient } from "./connection";
import type { Listing, ListingAuditLogInput, ListingInput } from "../types/listing";

type ListingRow = {
  id: string;
  seller_name: string;
  seller_email: string;
  phone: string;
  property_address: string;
  city: string;
  state: string;
  zip: string;
  list_price: string;
  property_type: string;
  selected_package: string;
  created_at: Date;
};

export async function selectListings(): Promise<Listing[]> {
  const result = await getPool().query<ListingRow>(`
    SELECT
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
      selected_package,
      created_at
    FROM listings
    ORDER BY created_at DESC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    sellerName: row.seller_name,
    sellerEmail: row.seller_email,
    phone: row.phone,
    propertyAddress: row.property_address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    listPrice: Number(row.list_price),
    propertyType: row.property_type,
    selectedPackage: row.selected_package,
    createdAt: row.created_at.toISOString(),
  }));
}

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
