import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handler as lambdaHandler } from "../../src/handlers/listListings";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "GET") {
    response.status(405).json({
      success: false,
      message: "Method not allowed",
    });
    return;
  }

  const result = await lambdaHandler();

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
