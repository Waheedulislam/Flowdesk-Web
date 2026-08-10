"use client";

import * as React from "react";
import { MoreHorizontal, Search } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { WorkspaceMember } from "@/lib/workspace-data";
import { MemberRoleBadge } from "@/components/workspace/member-role-badge";

interface MemberTableProps {
  members: WorkspaceMember[];
  onOpenRoleDialog: (member: WorkspaceMember) => void;
  onOpenRemoveDialog: (member: WorkspaceMember) => void;
}

export function MemberTable({
  members,
  onOpenRoleDialog,
  onOpenRemoveDialog,
}: MemberTableProps) {
  const [query, setQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("All");

  const filteredMembers = members.filter((member) => {
    const matchesQuery = [member.name, member.email, member.role]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesRole = roleFilter === "All" || member.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Workspace members</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter, and adjust access for the team.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search members"
              className="pl-9"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="All">All roles</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="GUEST">Guest</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden px-0 md:px-6">
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-border/70 align-middle"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={member.name} className="size-9" />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <MemberRoleBadge role={member.role} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {member.joinedAt}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        member.status === "Active" ? "success" : "warning"
                      }
                    >
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background hover:bg-accent">
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onOpenRoleDialog(member)}
                        >
                          Change role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onOpenRemoveDialog(member)}
                        >
                          Remove member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-2 md:hidden">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} className="size-9" />
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background hover:bg-accent">
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onOpenRoleDialog(member)}>
                      Change role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onOpenRemoveDialog(member)}
                    >
                      Remove member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <MemberRoleBadge role={member.role} />
                <Badge
                  variant={member.status === "Active" ? "success" : "warning"}
                >
                  {member.status}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Joined {member.joinedAt}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
