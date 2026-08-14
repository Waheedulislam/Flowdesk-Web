/**
 * Shared browser-safe HTTP client for FlowDesk API services.
 *
 * Successful requests return the backend envelope intact. Failed requests throw
 * ApiClientError, so feature services and UI do not repeat response parsing or
 * status-to-message handling. Pass the current access token explicitly to avoid
 * coupling this module to React context or local storage.
 */
export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  meta?: unknown;
  data: T;
};

type ApiErrorBody = {
  message?: unknown;
};

export class ApiClientError extends Error {
  readonly status: number | null;
  readonly code: "bad_request" | "unauthorized" | "forbidden" | "not_found" | "conflict" | "validation" | "server" | "network" | "unknown";

  constructor(message: string, status: number | null, code: ApiClientError["code"]) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

export type ApiClientOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: HeadersInit;
  accessToken?: string | null;
  /**
   * Limit a request to the status codes promised by a specific backend
   * endpoint. Most services can rely on any 2xx response.
   */
  expectedStatuses?: number | readonly number[];
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const fallbackMessages: Record<number, string> = {
  400: "The request could not be processed.",
  401: "Your session is no longer valid. Please sign in again.",
  403: "You do not have permission to do that.",
  404: "The requested resource was not found.",
  409: "This conflicts with existing data.",
  422: "Please check the submitted information and try again.",
  500: "The server could not complete the request. Please try again later.",
};

function getErrorCode(status: number): ApiClientError["code"] {
  if (status === 400) return "bad_request";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";
  if (status >= 500) return "server";
  return "unknown";
}

function getBackendMessage(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("message" in body)) return null;
  const message = (body as ApiErrorBody).message;
  return typeof message === "string" && message.trim() ? message : null;
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  return response.json().catch(() => null);
}

export async function apiClient<T>(path: string, options: ApiClientOptions = {}): Promise<ApiResponse<T>> {
  const { accessToken, body, headers: suppliedHeaders, expectedStatuses, ...requestOptions } = options;
  const headers = new Headers(suppliedHeaders);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers,
      credentials: requestOptions.credentials ?? "include",
      body: body === undefined || isFormData ? (body as BodyInit | undefined) : JSON.stringify(body),
    });
    const responseBody = await parseResponse(response);

    const acceptedStatuses = expectedStatuses === undefined
      ? null
      : Array.isArray(expectedStatuses) ? expectedStatuses : [expectedStatuses];

    if (!response.ok || (acceptedStatuses !== null && !acceptedStatuses.includes(response.status))) {
      const message = getBackendMessage(responseBody) ?? fallbackMessages[response.status] ?? "Something went wrong. Please try again.";
      throw new ApiClientError(message, response.status, getErrorCode(response.status));
    }

    return responseBody as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    throw new ApiClientError("We couldn't reach the server. Please check your connection and try again.", null, "network");
  }
}
