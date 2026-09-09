"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetails } from "@/components/projects/project-details";
import {
  ProjectFilters,
  type ProjectOwnerOption,
} from "@/components/projects/project-filters";
import { ProjectSettings } from "@/components/projects/project-settings";
import { ProjectTable } from "@/components/projects/project-table";
import { useProjectActions } from "@/components/projects/hooks/use-project-actions";
import { useProjects } from "@/components/projects/hooks/use-projects";
import { useTasks, type TaskProject } from "@/components/tasks/hooks/use-tasks";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import type { ProjectRecord } from "@/lib/api/project.api";
import { getProjectTaskStatistics } from "@/lib/project-task-statistics";

export function ProjectsPage({
  initialProjectId,
}: { initialProjectId?: string } = {}) {
  const router = useRouter();
  const { accessToken, isReady } = useAuth();
  const { activeWorkspace, isLoading: workspaceLoading } = useWorkspace();
  const state = useProjects({
    accessToken,
    isReady,
    workspaceId: activeWorkspace?.id,
  });
  const taskProjects = React.useMemo<TaskProject[]>(
    () => state.data.map(({ id, name }) => ({ id, name })),
    [state.data],
  );
  const taskState = useTasks({
    accessToken,
    isReady,
    projects: taskProjects,
  });
  const taskStatistics = React.useMemo(() => {
    const statistics = new Map<
      string,
      ReturnType<typeof getProjectTaskStatistics>
    >();

    taskProjects.forEach((project) => {
      const projectTasks = taskState.tasks.filter(
        (task) => task.projectId === project.id,
      );
      statistics.set(project.id, getProjectTaskStatistics(projectTasks));
    });

    return statistics;
  }, [taskProjects, taskState.tasks]);
  const canManage =
    activeWorkspace?.role === "OWNER" || activeWorkspace?.role === "ADMIN";
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All");
  const [owner, setOwner] = React.useState("All");
  const [sort, setSort] = React.useState("updated");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ProjectRecord | null>(null);
  const [settings, setSettings] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      setSelected(null);
      setSettings(false);
      setDeleteOpen(false);
      setOwner("All");
    }, 0);
    return () => window.clearTimeout(id);
  }, [activeWorkspace?.id]);
  React.useEffect(() => {
    if (!initialProjectId || state.loading || state.error) return;
    const id = window.setTimeout(() => {
      setSelected(
        state.data.find((project) => project.id === initialProjectId) ?? null,
      );
    }, 0);
    return () => window.clearTimeout(id);
  }, [initialProjectId, state.data, state.error, state.loading]);
  const ownerOptions = React.useMemo<ProjectOwnerOption[]>(() => {
    const owners = new Map<string, ProjectOwnerOption>();
    state.data.forEach((project) => {
      if (project.creator) {
        owners.set(project.creator.id, {
          id: project.creator.id,
          name: project.creator.name,
          avatar: project.creator.avatar,
        });
      }
    });
    return [...owners.values()].sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [state.data]);
  const effectiveOwner =
    owner === "All" || ownerOptions.some((option) => option.id === owner)
      ? owner
      : "All";
  const actions = useProjectActions({
    accessToken,
    workspaceId: activeWorkspace?.id,
    onCreated: (p) => state.setData((items) => [p, ...items]),
    onUpdated: (p) => {
      state.setData((items) =>
        items.map((x) =>
          x.id === p.id ? { ...x, ...p, creator: p.creator ?? x.creator } : x,
        ),
      );
      setSelected((x) =>
        x?.id === p.id ? { ...x, ...p, creator: p.creator ?? x.creator } : x,
      );
    },
    onDeleted: (id) => {
      state.setData((items) => items.filter((x) => x.id !== id));
      setSelected(null);
    },
  });
  const projects = React.useMemo(
    () =>
      [...state.data]
        .filter(
          (p) =>
            [p.name, p.description ?? ""]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (status === "All" || p.status === status) &&
            (effectiveOwner === "All" || p.createdBy === effectiveOwner),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.name.localeCompare(b.name)
            : sort === "created"
              ? b.createdAt.localeCompare(a.createdAt)
              : b.updatedAt.localeCompare(a.updatedAt),
        ),
    [state.data, search, status, effectiveOwner, sort],
  );
  if (!isReady || workspaceLoading || state.loading)
    return <Message title="Loading projects..." />;
  if (state.error)
    return (
      <Message
        title="Unable to load projects"
        message={state.error}
        action="Try again"
        onAction={() => void state.reload()}
      />
    );
  if (!activeWorkspace)
    return (
      <Message
        title="No workspace selected"
        message="Select a workspace to view its projects."
      />
    );
  if (initialProjectId && !selected)
    return (
      <Message
        title="Project unavailable"
        message="This project is not available in the selected workspace."
        action="Back to projects"
        onAction={() => router.push("/projects")}
      />
    );
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Projects
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Manage your portfolio
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            A polished, workspace-focused area for planning, tracking, and
            reviewing projects across the team.
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateOpen(true)}>Create project</Button>
        )}
      </div>
      <Card>
        <CardContent className="p-4">
          <ProjectFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            owner={owner}
            onOwnerChange={setOwner}
            owners={ownerOptions}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
          />
        </CardContent>
      </Card>
      {!selected ? (
        projects.length ? (
          <>
            {view === "grid" ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {projects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onOpen={setSelected}
                    statistics={
                      taskState.loading || taskState.error
                        ? undefined
                        : taskStatistics.get(p.id)
                    }
                  />
                ))}
              </div>
            ) : (
              <ProjectTable projects={projects} onOpen={setSelected} />
            )}
          </>
        ) : (
          <Message
            title="No projects yet"
            message="Create a project to get started."
            action={canManage ? "Create project" : undefined}
            onAction={() => setCreateOpen(true)}
          />
        )
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelected(null)}
            >
              Back to list
            </Button>
            {canManage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(!settings)}
              >
                {settings ? "Details" : "Settings"}
              </Button>
            )}
          </div>
          {settings && canManage ? (
            <ProjectSettings
              project={selected}
              onUpdate={async (payload) => {
                await actions.update(selected.id, payload);
                toast.success("Project updated successfully");
              }}
              onArchive={async () => {
                await actions.update(selected.id, { status: "ARCHIVED" });
                toast.success("Project archived successfully");
                setSelected(null);
              }}
              onDelete={() => setDeleteOpen(true)}
            />
          ) : (
            <ProjectDetails
              project={selected}
              tasks={taskState.tasks.filter(
                (task) => task.projectId === selected.id,
              )}
              tasksLoading={taskState.loading}
              tasksError={taskState.error}
              onRetryTasks={() => void taskState.reload()}
              activities={[]}
              activityLoading={false}
              activityError={null}
              onRetryActivity={() => undefined}
              canManage={canManage}
              workspaceRole={activeWorkspace.role}
              onEdit={() => setSettings(true)}
              onBack={() =>
                initialProjectId ? router.push("/projects") : setSelected(null)
              }
            />
          )}
        </div>
      )}
      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={async (payload) => {
          await actions.create(payload);
          toast.success("Project created successfully");
          setCreateOpen(false);
        }}
      />
      <DeleteProjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={async () => {
          if (selected) {
            await actions.remove(selected.id);
            toast.success("Project deleted successfully");
          }
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}

function Message({
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
          {message && (
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          )}
          {action && onAction && (
            <Button className="mt-4" onClick={onAction}>
              {action}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
