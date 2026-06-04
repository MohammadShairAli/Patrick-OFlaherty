import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handler as lambdaHandler } from "../../src/handlers/createListing";

function normalizeHeaders(headers: VercelRequest["headers"]) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(",") : value ?? "",
    ]),
  );
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({
      success: false,
      message: "Method not allowed",
    });
    return;
  }

  const result = await lambdaHandler({
    body:
      typeof request.body === "string"
        ? request.body
        : JSON.stringify(request.body ?? {}),
    headers: normalizeHeaders(request.headers),
    isBase64Encoded: false,
    rawPath: "/api/listings/create",
    rawQueryString: "",
    requestContext: {} as APIGatewayProxyEventV2["requestContext"],
    routeKey: "POST /api/listings/create",
    version: "2.0",
  });

  if (typeof result === "string") {
    response.status(200).send(result);
    return;
  }

  for (const [key, value] of Object.entries(result.headers ?? {})) {
    if (value !== undefined) {
      response.setHeader(key, typeof value === "boolean" ? String(value) : value);
    }
  }

  response.status(result.statusCode ?? 200).send(result.body ?? "");
}
