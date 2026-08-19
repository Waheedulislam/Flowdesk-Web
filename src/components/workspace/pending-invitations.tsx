"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { WorkspaceInvitation } from "@/lib/api/workspace.api";

interface PendingInvitationsProps {
  invitations: WorkspaceInvitation[];
  loading?: boolean;
  error?: string | null;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusVariant(status: WorkspaceInvitation["status"]) {
  switch (status) {
    case "PENDING":
      return "warning";

    case "ACCEPTED":
      return "success";

    default:
      return "secondary";
  }
}

function getStatusLabel(status: WorkspaceInvitation["status"]) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "ACCEPTED":
      return "Accepted";

    case "EXPIRED":
      return "Expired";

    default:
      return status;
  }
}

export function PendingInvitations({
  invitations,
  loading = false,
  error = null,
}: PendingInvitationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending invitations</CardTitle>

        <p className="text-sm text-muted-foreground">
          Track who has been invited and whether their access is still active.
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading invitations...
            </p>
          </div>
        ) : null}

        {/* Error */}
        {!loading && error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">
              Unable to load invitations
            </p>

            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        ) : null}

        {/* Empty */}
        {!loading && !error && invitations.length === 0 ? (
          <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20">
            <div className="text-center">
              <p className="text-sm font-medium">No invitations</p>

              <p className="mt-1 text-xs text-muted-foreground">
                There are no pending invitations for this workspace.
              </p>
            </div>
          </div>
        ) : null}

        {/* Invitations */}
        {!loading && !error
          ? invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex flex-col gap-3 rounded-lg border border-border/80 bg-background/70 p-4 md:flex-row md:items-center md:justify-between"
              >
                {/* Invitation info */}
                <div className="min-w-0">
                  <p className="truncate font-medium">{invitation.email}</p>

                  <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <span>Role: {invitation.role}</span>

                    <span>•</span>

                    <span>Sent {formatDate(invitation.createdAt)}</span>

                    <span>•</span>

                    <span>Expires {formatDate(invitation.expiresAt)}</span>
                  </div>
                </div>

                {/* Status + action */}
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={getStatusVariant(invitation.status)}>
                    {getStatusLabel(invitation.status)}
                  </Badge>

                  {invitation.status === "PENDING" ? (
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          : null}
      </CardContent>
    </Card>
  );
}
