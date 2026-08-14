import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import type { WorkspaceOverviewModel } from "@/components/workspace/workspace-overview";

interface WorkspaceHeaderProps {
  workspace: WorkspaceOverviewModel;
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  return (
    <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary/8 via-background to-background">
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar name={workspace.name} className="size-14 rounded-xl" />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {workspace.name}
              </h1>
              <Badge variant="success">{workspace.status}</Badge>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {workspace.description}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>Owner: {workspace.ownerName}</span>
              <span>•</span>
              <span>{workspace.ownerEmail}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg border border-border bg-background/80 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Members
            </p>
            <p className="text-lg font-semibold">{workspace.memberCount}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/80 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Projects
            </p>
            <p className="text-lg font-semibold">{workspace.projectCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
