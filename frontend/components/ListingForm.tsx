"use client";

import { FormEvent, useState } from "react";
import { createListing, ListingPayload } from "../lib/api";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";

const initialForm: ListingPayload = {
  sellerName: "",
  sellerEmail: "",
  phone: "",
  propertyAddress: "",
  city: "",
  state: "",
  zip: "",
  listPrice: 0,
  propertyType: "",
  selectedPackage: "",
};

type UploadedListing = ListingPayload & {
  createdAt: string;
};

const dummyUploadedListings: UploadedListing[] = [
  {
    sellerName: "Avery Johnson",
    sellerEmail: "avery.johnson@example.com",
    phone: "555-0142",
    propertyAddress: "1842 Maple Ridge Drive",
    city: "Austin",
    state: "TX",
    zip: "78703",
    listPrice: 625000,
    propertyType: "Single family",
    selectedPackage: "Premium",
    createdAt: "Demo data",
  },
  {
    sellerName: "Morgan Lee",
    sellerEmail: "morgan.lee@example.com",
    phone: "555-0188",
    propertyAddress: "92 Harbor View Lane",
    city: "Tampa",
    state: "FL",
    zip: "33602",
    listPrice: 410000,
    propertyType: "Townhouse",
    selectedPackage: "Standard",
    createdAt: "Demo data",
  },
];

export function ListingForm() {
  const [activeTab, setActiveTab] = useState<"form" | "uploaded">("form");
  const [form, setForm] = useState<ListingPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedListings, setUploadedListings] = useState<UploadedListing[]>(
    dummyUploadedListings,
  );

  function updateField(name: keyof ListingPayload, value: string) {
    setForm((current) => ({
      ...current,
      [name]: name === "listPrice" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setError(null);

    try {
      await createListing(form);
      setUploadedListings((current) => [
        {
          ...form,
          createdAt: new Date().toLocaleString(),
        },
        ...current,
      ]);
      setIsSuccess(true);
      setActiveTab("uploaded");
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create listing.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 pt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Listing workflow
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Submit listing data and review uploaded records.
            </p>
          </div>
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            {uploadedListings.length} records loaded
          </div>
        </div>

        <div className="mt-5 flex gap-6">
          <button
            className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
              activeTab === "form"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("form")}
            type="button"
          >
            Create Listing
          </button>
          <button
            className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
              activeTab === "uploaded"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("uploaded")}
            type="button"
          >
            Uploaded Data
          </button>
        </div>
      </div>

      <div className="p-5">
        {isSuccess ? (
          <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <p className="font-semibold">Listing successfully created.</p>
          </div>
        ) : null}

        {error ? (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {activeTab === "form" ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-950">
                  Seller details
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Contact information is stored in PostgreSQL but excluded from
                  logs.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormInput
                  label="Seller Name"
                  name="sellerName"
                  value={form.sellerName}
                  onChange={updateField}
                  required
                />
                <FormInput
                  label="Seller Email"
                  name="sellerEmail"
                  type="email"
                  value={form.sellerEmail}
                  onChange={updateField}
                  required
                />
                <FormInput
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  required
                />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-950">
                  Property details
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Required fields are validated by the Lambda handler before
                  database writes.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-3">
                  <FormInput
                    label="Property Address"
                    name="propertyAddress"
                    value={form.propertyAddress}
                    onChange={updateField}
                    required
                  />
                </div>
                <FormInput
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  required
                />
                <FormInput
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={updateField}
                  required
                />
                <FormInput
                  label="Zip"
                  name="zip"
                  value={form.zip}
                  onChange={updateField}
                  required
                />
                <FormInput
                  label="List Price"
                  name="listPrice"
                  type="number"
                  min="1"
                  value={form.listPrice || ""}
                  onChange={updateField}
                  required
                />
                <FormInput
                  label="Property Type"
                  name="propertyType"
                  value={form.propertyType}
                  onChange={updateField}
                  placeholder="Single family"
                  required
                />
                <FormInput
                  label="Selected Package"
                  name="selectedPackage"
                  value={form.selectedPackage}
                  onChange={updateField}
                  placeholder="Premium"
                  required
                />
              </div>
            </div>

            <SubmitButton isLoading={isSubmitting} />
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-950">
                  Uploaded listing data
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Demo records and successfully submitted listings appear here.
                </p>
              </div>
            </div>

            {uploadedListings.length === 0 ? (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                No listing data has been uploaded yet.
              </div>
            ) : (
              uploadedListings.map((listing, index) => (
                <article
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                  key={`${listing.sellerEmail}-${listing.createdAt}-${index}`}
                >
                  <div className="border-l-4 border-blue-700 px-4 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold text-slate-950">
                            {listing.propertyAddress}
                          </h2>
                          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                            {listing.createdAt}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {listing.city}, {listing.state} {listing.zip}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          List Price
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-950">
                          {new Intl.NumberFormat("en-US", {
                            currency: "USD",
                            style: "currency",
                          }).format(listing.listPrice)}
                        </p>
                      </div>
                    </div>

                    <dl className="mt-4 grid gap-3 border-t border-slate-200 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="font-medium text-slate-500">Seller</dt>
                        <dd className="mt-1 text-slate-950">
                          {listing.sellerName}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">Email</dt>
                        <dd className="mt-1 break-all text-slate-950">
                          {listing.sellerEmail}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">Phone</dt>
                        <dd className="mt-1 text-slate-950">{listing.phone}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">Package</dt>
                        <dd className="mt-1 text-slate-950">
                          {listing.selectedPackage}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">
                          Property Type
                        </dt>
                        <dd className="mt-1 text-slate-950">
                          {listing.propertyType}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
