import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { roleLabels, type UserRole } from "@/context/role-context";

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
      <Shield className="size-3" />
      {roleLabels[role]}
    </Badge>
  );
}
