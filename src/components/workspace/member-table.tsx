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

import type {
  WorkspaceMemberRecord,
  WorkspaceMemberRole,
} from "@/lib/api/workspace.api";

import { MemberRoleBadge } from "@/components/workspace/member-role-badge";

interface MemberTableProps {
  members: WorkspaceMemberRecord[];

  currentUserRole: WorkspaceMemberRole;

  onOpenRoleDialog: (member: WorkspaceMemberRecord) => void;
  onOpenRemoveDialog: (member: WorkspaceMemberRecord) => void;
}

export function MemberTable({
  members,
  currentUserRole,
  onOpenRoleDialog,
  onOpenRemoveDialog,
}: MemberTableProps) {
  const [query, setQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("All");

  const filteredMembers = members.filter((member) => {
    const searchText = [member.user.name, member.user.email, member.role].join(
      " ",
    );

    const matchesQuery = searchText.toLowerCase().includes(query.toLowerCase());

    const matchesRole = roleFilter === "All" || member.role === roleFilter;

    return matchesQuery && matchesRole;
  });

  /*
   * ============================================================
   * PERMISSION LOGIC
   * ============================================================
   *
   * Backend rules:
   *
   * OWNER:
   * - Can change ADMIN / MEMBER / GUEST roles
   * - Cannot change OWNER
   * - Can remove ADMIN / MEMBER / GUEST
   * - Cannot remove OWNER
   *
   * ADMIN:
   * - Cannot change any role
   * - Can remove MEMBER only
   * - Cannot remove OWNER / ADMIN / GUEST
   *
   * MEMBER:
   * - Cannot change role
   * - Cannot remove anyone
   *
   * GUEST:
   * - Cannot change role
   * - Cannot remove anyone
   */

  const canChangeRole = (member: WorkspaceMemberRecord) => {
    // Only OWNER can change roles.
    if (currentUserRole !== "OWNER") {
      return false;
    }

    // OWNER cannot change OWNER role.
    if (member.role === "OWNER") {
      return false;
    }

    return true;
  };

  const canRemoveMember = (member: WorkspaceMemberRecord) => {
    // OWNER can remove everyone except OWNER.
    if (currentUserRole === "OWNER") {
      return member.role !== "OWNER";
    }

    // ADMIN can remove MEMBER only.
    if (currentUserRole === "ADMIN") {
      return member.role === "MEMBER";
    }

    // MEMBER / GUEST cannot remove anyone.
    return false;
  };

  const hasAnyAction = (member: WorkspaceMemberRecord) => {
    return canChangeRole(member) || canRemoveMember(member);
  };

  return (
    <Card>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Workspace members</CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter, and adjust access for the team.
          </p>
        </div>

        {/* ====================================================
            SEARCH + FILTER
        ==================================================== */}

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

      <CardContent className="overflow-visible px-0 md:px-6">
        {/* ====================================================
            DESKTOP TABLE
        ==================================================== */}

        <div className="hidden overflow-visible md:block">
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
              {filteredMembers.map((member) => {
                const roleChangeAllowed = canChangeRole(member);
                const removeAllowed = canRemoveMember(member);
                const actionAllowed = hasAnyAction(member);

                return (
                  <tr
                    key={member.id}
                    className="border-t border-border/70 align-middle"
                  >
                    {/* MEMBER */}

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.user.name} className="size-9" />

                        <div>
                          <p className="font-medium">{member.user.name}</p>

                          <p className="text-xs text-muted-foreground">
                            {member.user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}

                    <td className="px-4 py-3">
                      <MemberRoleBadge role={member.role} />
                    </td>

                    {/* JOINED */}

                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          member.user.status === "ACTIVE"
                            ? "success"
                            : "warning"
                        }
                      >
                        {member.user.status}
                      </Badge>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-4 py-3">
                      {actionAllowed ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background hover:bg-accent">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            {roleChangeAllowed ? (
                              <DropdownMenuItem
                                onClick={() => onOpenRoleDialog(member)}
                              >
                                Change role
                              </DropdownMenuItem>
                            ) : null}

                            {removeAllowed ? (
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onOpenRemoveDialog(member)}
                              >
                                Remove member
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <ButtonDisabledAction />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ====================================================
            MOBILE
        ==================================================== */}

        <div className="flex flex-col gap-3 px-4 pb-2 md:hidden">
          {filteredMembers.map((member) => {
            const roleChangeAllowed = canChangeRole(member);
            const removeAllowed = canRemoveMember(member);
            const actionAllowed = hasAnyAction(member);

            return (
              <div
                key={member.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* MEMBER */}

                  <div className="flex items-center gap-3">
                    <Avatar name={member.user.name} className="size-9" />

                    <div>
                      <p className="font-medium">{member.user.name}</p>

                      <p className="text-xs text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  {actionAllowed ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background hover:bg-accent">
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="z-[100] w-44">
                        {roleChangeAllowed ? (
                          <DropdownMenuItem
                            onClick={() => onOpenRoleDialog(member)}
                          >
                            Change role
                          </DropdownMenuItem>
                        ) : null}

                        {removeAllowed ? (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onOpenRemoveDialog(member)}
                          >
                            Remove member
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <ButtonDisabledAction />
                  )}
                </div>

                {/* ROLE + STATUS */}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <MemberRoleBadge role={member.role} />

                  <Badge
                    variant={
                      member.user.status === "ACTIVE" ? "success" : "warning"
                    }
                  >
                    {member.user.status}
                  </Badge>
                </div>

                {/* JOINED */}

                <p className="mt-3 text-sm text-muted-foreground">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}

          {filteredMembers.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No members found.
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Disabled action button for users who have no permission.
 */
function ButtonDisabledAction() {
  return (
    <button
      type="button"
      disabled
      title="You don't have permission to manage this member"
      className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground opacity-50"
    >
      <MoreHorizontal className="size-4" />
    </button>
  );
}
