import { insertListingAuditLog } from "../db/queries";
import type { QueryClient } from "../db/connection";
import type { ListingInput } from "../types/listing";

type CreateListingAuditLogInput = {
  listingId: string;
  payload: ListingInput;
  client?: QueryClient;
};

export async function createListingAuditLog({
  client,
  listingId,
  payload,
}: CreateListingAuditLogInput) {
  await insertListingAuditLog(
    {
      actorType: "SELLER",
      eventData: {
        city: payload.city,
        listPrice: payload.listPrice,
        propertyType: payload.propertyType,
        selectedPackage: payload.selectedPackage,
        state: payload.state,
        zip: payload.zip,
      },
      eventType: "LISTING_CREATED",
      listingId,
    },
    client,
  );
}
