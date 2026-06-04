type SafeErrorDetails = {
  errorCode?: string;
  errorMessage?: string;
  errorName?: string;
};

function sanitizeMessage(message: string) {
  if (message.includes("DATABASE_URL is required")) {
    return message;
  }

  if (message.includes("relation") && message.includes("does not exist")) {
    return message;
  }

  if (message.includes("password authentication failed")) {
    return "Database authentication failed";
  }

  if (message.includes("connect")) {
    return "Database connection failed";
  }

  return "Unhandled backend error";
}

export function getSafeErrorDetails(error: unknown): SafeErrorDetails {
  if (!(error instanceof Error)) {
    return {
      errorMessage: "Unknown backend error",
    };
  }

  const errorWithCode = error as Error & { code?: string };

  return {
    errorCode: errorWithCode.code,
    errorMessage: sanitizeMessage(error.message),
    errorName: error.name,
  };
}
