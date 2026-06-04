import { config } from "dotenv";
import { resolve } from "path";
import { getPool } from "./db/connection";
import { createListingAuditLog } from "./services/auditService";
import { insertListing } from "./db/queries";
import { listingSchema } from "./validation/listingSchema";

config({ path: resolve(process.cwd(), "../.env") });
config({ path: resolve(process.cwd(), ".env") });

const dummyListings = [
  {
    sellerName: "Avery Johnson",
    sellerEmail: "seed.avery.johnson@example.com",
    phone: "555-0142",
    propertyAddress: "1842 Maple Ridge Drive",
    city: "Austin",
    state: "TX",
    zip: "78703",
    listPrice: 625000,
    propertyType: "Single family",
    selectedPackage: "Premium",
  },
  {
    sellerName: "Morgan Lee",
    sellerEmail: "seed.morgan.lee@example.com",
    phone: "555-0188",
    propertyAddress: "92 Harbor View Lane",
    city: "Tampa",
    state: "FL",
    zip: "33602",
    listPrice: 410000,
    propertyType: "Townhouse",
    selectedPackage: "Standard",
  },
  {
    sellerName: "Jordan Smith",
    sellerEmail: "seed.jordan.smith@example.com",
    phone: "555-0129",
    propertyAddress: "730 Pine Street",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    listPrice: 895000,
    propertyType: "Condo",
    selectedPackage: "Premium",
  },
  {
    sellerName: "Taylor Williams",
    sellerEmail: "seed.taylor.williams@example.com",
    phone: "555-0165",
    propertyAddress: "451 Desert Bloom Road",
    city: "Phoenix",
    state: "AZ",
    zip: "85004",
    listPrice: 535000,
    propertyType: "Single family",
    selectedPackage: "Basic",
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const client = await getPool().connect();
  let inserted = 0;

  try {
    await client.query("BEGIN");

    for (const listing of dummyListings) {
      const payload = listingSchema.parse(listing);
      const existing = await client.query(
        "SELECT id FROM listings WHERE seller_email = $1 LIMIT 1",
        [payload.sellerEmail],
      );

      if (existing.rowCount) {
        console.log(`Skipped existing seed listing: ${payload.sellerEmail}`);
        continue;
      }

      const listingId = await insertListing(payload, client);
      await createListingAuditLog({ client, listingId, payload });
      inserted += 1;
      console.log(`Inserted seed listing: ${payload.propertyAddress}`);
    }

    await client.query("COMMIT");
    console.log(`Seed complete. Inserted ${inserted} listing(s).`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await getPool().end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
