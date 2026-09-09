"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ProjectDetails } from "@/components/projects/project-details";
import { ProjectSettings } from "@/components/projects/project-settings";
import { useProjectActivity } from "@/components/projects/hooks/use-project-activity";
import { useProjectDetail } from "@/components/projects/hooks/use-project-detail";
import { useProjectTasks } from "@/components/projects/hooks/use-project-tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import {
  deleteProject,
  updateProject,
  type UpdateProjectPayload,
} from "@/lib/api/project.api";

export function ProjectDetailPage({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { accessToken, isReady } = useAuth();
  const { activeWorkspace, isLoading: workspaceLoading } = useWorkspace();
  const detail = useProjectDetail({
    accessToken,
    isReady,
    projectId,
    workspaceId: activeWorkspace?.id ?? "",
  });
  const tasks = useProjectTasks({ accessToken, isReady, projectId });
  const activity = useProjectActivity({
    accessToken,
    isReady,
    workspaceId: activeWorkspace?.id ?? "",
    projectId,
  });
  const [settings, setSettings] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const canManage =
    activeWorkspace?.role === "OWNER" || activeWorkspace?.role === "ADMIN";

  const saveProject = async (payload: UpdateProjectPayload) => {
    if (!accessToken || !detail.project) {
      throw new Error("Your session is no longer valid. Please try again.");
    }
    const response = await updateProject(
      accessToken,
      detail.project.id,
      payload,
    );
    detail.setProject({
      ...response.data,
      creator: response.data.creator ?? detail.project.creator,
    });
    toast.success("Project updated successfully");
  };

  const archiveProject = async () => {
    await saveProject({ status: "ARCHIVED" });
    toast.success("Project archived successfully");
  };

  const removeProject = async () => {
    if (!accessToken || !detail.project) return;
    await deleteProject(accessToken, detail.project.id);
    toast.success("Project deleted successfully");
    router.push("/projects");
  };

  if (!isReady || workspaceLoading || detail.loading) {
    return <DetailMessage title="Loading project..." />;
  }
  if (!activeWorkspace) {
    return (
      <DetailMessage
        title="No workspace selected"
        message="Select a workspace to view this project."
      />
    );
  }
  if (
    detail.error ||
    !detail.project ||
    detail.project.workspaceId !== activeWorkspace.id
  ) {
    return (
      <DetailMessage
        title="Unable to load project"
        message={
          detail.error ??
          "This project is unavailable in the selected workspace."
        }
        action="Try again"
        onAction={() => void detail.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/projects")}
        >
          Back to projects
        </Button>
        {canManage ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettings((value) => !value)}
          >
            {settings ? "Details" : "Settings"}
          </Button>
        ) : null}
      </div>
      {settings && canManage ? (
        <ProjectSettings
          key={`${detail.project.id}-${detail.project.updatedAt}`}
          project={detail.project}
          onUpdate={saveProject}
          onArchive={archiveProject}
          onDelete={() => setDeleteOpen(true)}
        />
      ) : (
        <ProjectDetails
          project={detail.project}
          tasks={tasks.tasks}
          tasksLoading={tasks.loading}
          tasksError={tasks.error}
          onRetryTasks={() => void tasks.reload()}
          activities={activity.activities}
          activityLoading={activity.loading}
          activityError={activity.error}
          onRetryActivity={() => void activity.reload()}
          canManage={canManage}
          workspaceRole={activeWorkspace.role}
          onEdit={() => setSettings(true)}
          onBack={() => router.push("/projects")}
        />
      )}
      <DeleteProjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={removeProject}
      />
    </div>
  );
}

function DetailMessage({
  title,
  message,
  action,
  onAction,
}: {
  title: string;
  message?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <p className="font-semibold">{title}</p>
          {message ? (
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          ) : null}
          {action && onAction ? (
            <Button className="mt-4" onClick={onAction}>
              {action}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
