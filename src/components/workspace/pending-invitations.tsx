import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkspaceInvitation } from "@/lib/workspace-data";

interface PendingInvitationsProps {
  invitations: WorkspaceInvitation[];
}

export function PendingInvitations({ invitations }: PendingInvitationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending invitations</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track who has been invited and whether their access is still active.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex flex-col gap-3 rounded-lg border border-border/80 bg-background/70 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-medium">{invitation.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>Role: {invitation.role}</span>
                <span>•</span>
                <span>Sent {invitation.sentAt}</span>
                <span>•</span>
                <span>Expires {invitation.expiresAt}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  invitation.status === "Pending"
                    ? "warning"
                    : invitation.status === "Accepted"
                      ? "success"
                      : "secondary"
                }
              >
                {invitation.status}
              </Badge>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
