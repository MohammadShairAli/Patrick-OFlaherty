import { z } from "zod";

export const listingSchema = z.object({
  sellerName: z.string().trim().min(1, "sellerName is required"),
  sellerEmail: z.string().trim().email("sellerEmail must be a valid email"),
  phone: z.string().trim().min(1, "phone is required"),
  propertyAddress: z.string().trim().min(1, "propertyAddress is required"),
  city: z.string().trim().min(1, "city is required"),
  state: z.string().trim().min(1, "state is required"),
  zip: z.string().trim().min(1, "zip is required"),
  listPrice: z.coerce.number().positive("listPrice must be greater than 0"),
  propertyType: z.string().trim().min(1, "propertyType is required"),
  selectedPackage: z.string().trim().min(1, "selectedPackage is required"),
});
