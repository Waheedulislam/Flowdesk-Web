"use client";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetails } from "@/components/projects/project-details";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectSettings } from "@/components/projects/project-settings";
import { ProjectTable } from "@/components/projects/project-table";
import { useProjectActions } from "@/components/projects/hooks/use-project-actions";
import { useProjects } from "@/components/projects/hooks/use-projects";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import type { ProjectRecord } from "@/lib/api/project.api";

export function ProjectsPage() {
  const { accessToken, isReady } = useAuth();
  const { activeWorkspace, isLoading: workspaceLoading } = useWorkspace();
  const state = useProjects({
    accessToken,
    isReady,
    workspaceId: activeWorkspace?.id,
  });
  const canManage =
    activeWorkspace?.role === "OWNER" || activeWorkspace?.role === "ADMIN";
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All");
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
    }, 0);
    return () => window.clearTimeout(id);
  }, [activeWorkspace?.id]);
  const actions = useProjectActions({
    accessToken,
    workspaceId: activeWorkspace?.id,
    onCreated: (p) => state.setData((items) => [p, ...items]),
    onUpdated: (p) => {
      state.setData((items) => items.map((x) => (x.id === p.id ? p : x)));
      setSelected((x) => (x?.id === p.id ? p : x));
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
            (status === "All" || p.status === status),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.name.localeCompare(b.name)
            : sort === "created"
              ? b.createdAt.localeCompare(a.createdAt)
              : b.updatedAt.localeCompare(a.updatedAt),
        ),
    [state.data, search, status, sort],
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
                  <ProjectCard key={p.id} project={p} onOpen={setSelected} />
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
              canManage={canManage}
              onEdit={() => setSettings(true)}
              onBack={() => setSelected(null)}
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
