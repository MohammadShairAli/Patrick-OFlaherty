import type { APIGatewayProxyResultV2 } from "aws-lambda";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export function created(body: Record<string, unknown>): APIGatewayProxyResultV2 {
  return {
    body: JSON.stringify(body),
    headers,
    statusCode: 201,
  };
}

export function ok(body: Record<string, unknown>): APIGatewayProxyResultV2 {
  return {
    body: JSON.stringify(body),
    headers,
    statusCode: 200,
  };
}

export function validationError(errors: unknown[]): APIGatewayProxyResultV2 {
  return {
    body: JSON.stringify({
      success: false,
      message: "Validation failed",
      errors,
    }),
    headers,
    statusCode: 400,
  };
}

export function serverError(): APIGatewayProxyResultV2 {
  return {
    body: JSON.stringify({
      success: false,
      message: "Internal server error",
    }),
    headers,
    statusCode: 500,
  };
}
