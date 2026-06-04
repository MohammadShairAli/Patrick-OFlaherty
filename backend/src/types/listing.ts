import { z } from "zod";
import { listingSchema } from "../validation/listingSchema";

export type ListingInput = z.infer<typeof listingSchema>;

export type Listing = ListingInput & {
  id: string;
  createdAt: string;
};

export type ListingAuditLogInput = {
  listingId: string;
  eventType: "LISTING_CREATED";
  actorType: "SELLER";
  eventData: Record<string, string | number>;
};
