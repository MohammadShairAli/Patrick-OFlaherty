import { createServer } from "http";
import { config } from "dotenv";
import { resolve } from "path";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler as createListing } from "./handlers/createListing";
import { handler as listListings } from "./handlers/listListings";

config({ path: resolve(process.cwd(), "../.env") });
config({ path: resolve(process.cwd(), ".env") });

const port = Number(process.env.PORT ?? 3001);

async function getRequestBody(
  request: import("http").IncomingMessage,
): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}

const server = createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/api/listings") {
    const result = await listListings();

    if (typeof result === "string") {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end(result);
      return;
    }

    response.writeHead(result.statusCode ?? 200, result.headers as Record<string, string>);
    response.end(result.body);
    return;
  }

  if (request.method !== "POST" || request.url !== "/api/listings/create") {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        success: false,
        message: "Route not found",
      }),
    );
    return;
  }

  const body = await getRequestBody(request);
  const result = await createListing({
    body,
    headers: request.headers as Record<string, string>,
    isBase64Encoded: false,
    rawPath: "/api/listings/create",
    rawQueryString: "",
    requestContext: {} as APIGatewayProxyEventV2["requestContext"],
    routeKey: "POST /api/listings/create",
    version: "2.0",
  });

  if (typeof result === "string") {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end(result);
    return;
  }

  response.writeHead(result.statusCode ?? 200, result.headers as Record<string, string>);
  response.end(result.body);
});

server.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});
