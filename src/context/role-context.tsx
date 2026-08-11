"use client";

import * as React from "react";

export type UserRole = "super_admin" | "admin" | "member";

type RoleContextValue = { role: UserRole; setRole: (role: UserRole) => void };
const RoleContext = React.createContext<RoleContextValue | null>(null);

// TODO: Replace mock role with authenticated user role
// TODO: Connect role to backend authorization
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<UserRole>("admin");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = React.useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within RoleProvider");
  return context;
}

export const roleLabels: Record<UserRole, string> = { super_admin: "Super Admin", admin: "Admin", member: "Member" };
