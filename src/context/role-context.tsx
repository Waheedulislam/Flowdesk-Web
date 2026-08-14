"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";
import type { BackendUserRole } from "@/lib/api/auth.api";

export type UserRole = BackendUserRole;

type RoleContextValue = { role: UserRole | null };
const RoleContext = React.createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return <RoleContext.Provider value={{ role: user?.role ?? null }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = React.useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within RoleProvider");
  return context;
}

export const roleLabels: Record<UserRole, string> = {
  SYSTEM_ADMIN: "Super Admin",
  ADMIN: "Admin",
  USER: "User",
};
