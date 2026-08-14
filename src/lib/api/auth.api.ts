import { apiClient } from "@/lib/api/client";

type LoginPayload = { accessToken: string };

/** Exact role values returned by the backend current-user endpoint. */
export type BackendUserRole = "SYSTEM_ADMIN" | "ADMIN" | "USER";

/** Exact shape of the `data` member returned by `GET /api/v1/users/me`. */
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: BackendUserRole;
  status: string;
  avatar: string | null;
};

export function registerUser(input: { name: string; email: string; password: string }) {
  return apiClient<unknown>("/api/v1/auth/register", {
    method: "POST",
    body: input,
    expectedStatuses: 201,
  });
}

export async function loginUser(input: { email: string; password: string }) {
  const response = await apiClient<LoginPayload>("/api/v1/auth/login", {
    method: "POST",
    body: input,
    expectedStatuses: 200,
  });

  if (typeof response.data?.accessToken !== "string" || !response.data.accessToken) {
    throw new Error("We couldn't sign you in. Please try again.");
  }

  return response;
}

export function getCurrentUser(accessToken: string) {
  return apiClient<CurrentUser>("/api/v1/users/me", {
    method: "GET",
    accessToken,
    expectedStatuses: 200,
  });
}
