"use client";

import * as React from "react";

type MockAuthContextValue = {
  isAuthenticated: boolean;
  completeMockSignIn: () => void;
  clearMockSession: () => void;
};

const MockAuthContext = React.createContext<MockAuthContextValue | null>(null);

/**
 * Temporary client-only auth seam for routing work in Phase 13.1.
 *
 * This state is deliberately not persisted and is not a security boundary.
 * TODO: Replace with real authenticated user/session state from the backend.
 * TODO: Use server-side session validation for protected routes in Phase 14.
 */
export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const value = React.useMemo(
    () => ({
      isAuthenticated,
      completeMockSignIn: () => setIsAuthenticated(true),
      clearMockSession: () => setIsAuthenticated(false),
    }),
    [isAuthenticated],
  );

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockAuth() {
  const context = React.useContext(MockAuthContext);
  if (!context) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return context;
}
