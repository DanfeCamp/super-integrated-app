/** Shared response helpers so every route returns the same JSON envelope. */

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return Response.json(data, { status: 200, ...init });
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

/**
 * Wraps a handler so an unexpected throw becomes a 500 with a generic message.
 * Internal error text is logged, never returned — it can leak paths and
 * upstream details.
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("[api]", error);
      return jsonError("Something went wrong. Please try again.", 500);
    }
  };
}

/** Reads and validates a JSON body, returning `null` on malformed input. */
export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
