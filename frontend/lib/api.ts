export type ListingPayload = {
  sellerName: string;
  sellerEmail: string;
  phone: string;
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  listPrice: number;
  propertyType: string;
  selectedPackage: string;
};

type CreateListingResponse =
  | {
      success: true;
      listingId: string;
    }
  | {
      success: false;
      message: string;
      errors?: unknown[];
    };

function isCreateListingError(
  data: CreateListingResponse,
): data is Extract<CreateListingResponse, { success: false }> {
  return data.success === false;
}

export async function createListing(payload: ListingPayload) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (isDemoMode || (!apiUrl && process.env.NODE_ENV !== "development")) {
    return {
      success: true,
      listingId: `demo-${Date.now()}`,
    } satisfies Extract<CreateListingResponse, { success: true }>;
  }

  const resolvedApiUrl = apiUrl ?? "http://localhost:3001";
  const endpoint = `${resolvedApiUrl.replace(/\/$/, "")}/api/listings/create`;

  let response: Response;

  try {
    response = await fetch(endpoint, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    throw new Error(`API is not reachable at ${endpoint}.`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "API did not return JSON. Check that NEXT_PUBLIC_API_URL points to the Lambda/API Gateway backend.",
    );
  }

  const data = (await response.json()) as CreateListingResponse;

  if (isCreateListingError(data)) {
    throw new Error(data.message);
  }

  if (!response.ok) {
    throw new Error("Unable to create listing.");
  }

  return data;
}
