"use client";

import * as React from "react";

const ACCESS_TOKEN_STORAGE_KEY = "flowdesk.accessToken";
const AUTH_CHANGE_EVENT = "flowdesk-auth-change";

type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  completeSignIn: (accessToken: string) => void;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function getStoredAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

function subscribeToAuthChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  };
}

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/**
 * Client auth state backed by the access token returned from the login API.
 * The HTTP-only refresh-token cookie is intentionally never read here.
 * TODO: Move protected-route validation to a server-readable session when the
 * backend provides the corresponding contract.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = React.useState(false);
  const accessToken = React.useSyncExternalStore(
    subscribeToAuthChanges,
    getStoredAccessToken,
    () => null,
  );

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const value = React.useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isReady,
      completeSignIn: (token: string) => {
        window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
        notifyAuthChange();
      },
      signOut: () => {
        window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        notifyAuthChange();
        // TODO: Connect backend logout/refresh-token invalidation when endpoint exists.
      },
    }),
    [accessToken, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
