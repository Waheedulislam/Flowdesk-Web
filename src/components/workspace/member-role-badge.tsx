import { Badge } from "@/components/ui/badge";
import type { MemberRole } from "@/lib/workspace-data";

interface MemberRoleBadgeProps {
  role: MemberRole;
}

export function MemberRoleBadge({ role }: MemberRoleBadgeProps) {
  const variant = {
    OWNER: "default" as const,
    ADMIN: "info" as const,
    MEMBER: "secondary" as const,
    GUEST: "warning" as const,
  }[role];

  return <Badge variant={variant}>{role}</Badge>;
}
