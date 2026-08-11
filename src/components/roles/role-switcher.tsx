"use client";
import { Check, Shield } from "lucide-react";
import { DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { roleLabels, useRole, type UserRole } from "@/context/role-context";

export function RoleSwitcher() { const { role, setRole } = useRole(); return <><DropdownMenuLabel>Development role</DropdownMenuLabel>{(["super_admin", "admin", "member"] as UserRole[]).map((item) => <DropdownMenuItem key={item} onClick={() => setRole(item)}><Shield />{roleLabels[item]}{role === item && <Check className="ml-auto text-primary" />}</DropdownMenuItem>)}</>; }
