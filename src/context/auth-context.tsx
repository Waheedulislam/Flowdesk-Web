"use client";

import * as React from "react";

import { ApiClientError } from "@/lib/api/client";
import { getCurrentUser, type CurrentUser } from "@/lib/api/auth.api";

const ACCESS_TOKEN_STORAGE_KEY = "flowdesk.accessToken";
const AUTH_CHANGE_EVENT = "flowdesk-auth-change";

type AuthContextValue = {
  accessToken: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  completeSignIn: (accessToken: string) => Promise<void>;
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
 * The authenticated user and role are hydrated exclusively from `/users/me`.
 * The HTTP-only refresh-token cookie is intentionally never read here.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessToken = React.useSyncExternalStore(
    subscribeToAuthChanges,
    getStoredAccessToken,
    () => null,
  );
  const [user, setUser] = React.useState<CurrentUser | null>(null);
  const [isReady, setIsReady] = React.useState(false);
  const hydratedTokenRef = React.useRef<string | null>(null);

  const clearAuthentication = React.useCallback(() => {
    hydratedTokenRef.current = null;
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    setUser(null);
    notifyAuthChange();
  }, []);

  const loadCurrentUser = React.useCallback(async (token: string) => {
    const response = await getCurrentUser(token);
    hydratedTokenRef.current = token;
    setUser(response.data);
    return response.data;
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!accessToken) {
        hydratedTokenRef.current = null;
        setUser(null);
        setIsReady(true);
        return;
      }

      if (hydratedTokenRef.current === accessToken) {
        setIsReady(true);
        return;
      }

      setIsReady(false);
      try {
        const response = await getCurrentUser(accessToken);
        if (cancelled) return;
        hydratedTokenRef.current = accessToken;
        setUser(response.data);
      } catch {
        if (cancelled) return;
        clearAuthentication();
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [accessToken, clearAuthentication]);

  const completeSignIn = React.useCallback(async (token: string) => {
    setIsReady(false);
    try {
      await loadCurrentUser(token);
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
      notifyAuthChange();
    } catch (error) {
      clearAuthentication();
      if (error instanceof ApiClientError) throw new Error(error.message);
      throw error;
    } finally {
      setIsReady(true);
    }
  }, [clearAuthentication, loadCurrentUser]);

  const value = React.useMemo(
    () => ({
      accessToken,
      user,
      isAuthenticated: Boolean(accessToken && user),
      isReady,
      completeSignIn,
      signOut: clearAuthentication,
    }),
    [accessToken, clearAuthentication, completeSignIn, isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
