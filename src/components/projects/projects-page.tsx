"use client";

import * as React from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ProjectAnalytics } from "@/components/projects/project-analytics";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetails } from "@/components/projects/project-details";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectSettings } from "@/components/projects/project-settings";
import { ProjectTable } from "@/components/projects/project-table";
import {
  mockProjects,
  projectActivity,
  projectAnalytics,
  projectTasks,
} from "@/lib/projects-data";
import type { ProjectItem } from "@/lib/projects-data";

export function ProjectsPage() {
  const [projects, setProjects] = React.useState(mockProjects);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All");
  const [owner, setOwner] = React.useState("All");
  const [sort, setSort] = React.useState("updated");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] =
    React.useState<ProjectItem | null>(null);
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "details" | "analytics" | "settings"
  >("overview");
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const filteredProjects = React.useMemo(() => {
    const query = search.toLowerCase();
    return [...projects]
      .filter((project) => {
        const matchesQuery = [project.name, project.description, project.owner]
          .join(" ")
          .toLowerCase()
          .includes(query);
        const matchesStatus = status === "All" || project.status === status;
        const matchesOwner = owner === "All" || project.owner === owner;
        return matchesQuery && matchesStatus && matchesOwner;
      })
      .sort((left, right) => {
        switch (sort) {
          case "created":
            return left.createdAt.localeCompare(right.createdAt);
          case "progress":
            return right.progress - left.progress;
          case "name":
            return left.name.localeCompare(right.name);
          default:
            return left.updatedAt.localeCompare(right.updatedAt);
        }
      });
  }, [projects, search, status, owner, sort]);

  const handleCreateProject = (payload: {
    name: string;
    description: string;
    status: string;
    startDate: string;
    dueDate: string;
  }) => {
    const newProject: ProjectItem = {
      id: `prj_${projects.length + 1}`,
      name: payload.name,
      description: payload.description,
      status: payload.status as ProjectItem["status"],
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      owner: "You",
      members: [],
      createdAt: "Just now",
      updatedAt: "Just now",
      startDate: payload.startDate || "TBD",
      dueDate: payload.dueDate || "TBD",
      color: "from-primary/20 to-primary/5",
      visibility: "Private",
    };
    setProjects((current) => [newProject, ...current]);
    setCreateOpen(false);
    setSelectedProject(newProject);
    setActiveTab("details");
  };

  return (
    <AppShell>
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
              A polished, mock-only workspace for planning, tracking, and
              reviewing projects across the team.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>Create project</Button>
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
              sort={sort}
              onSortChange={setSort}
              view={view}
              onViewChange={setView}
            />
          </CardContent>
        </Card>

        {!selectedProject ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeTab === "overview" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeTab === "analytics" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                Analytics
              </button>
            </div>
            {activeTab === "analytics" ? (
              <ProjectAnalytics metrics={projectAnalytics} />
            ) : (
              <div className="space-y-4">
                {view === "grid" ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onOpen={setSelectedProject}
                      />
                    ))}
                  </div>
                ) : (
                  <ProjectTable
                    projects={filteredProjects}
                    onOpen={setSelectedProject}
                  />
                )}
              </div>
            )}
          </div>
        ) : null}

        {selectedProject ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeTab === "details" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeTab === "analytics" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                Analytics
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeTab === "settings" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                Settings
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab("overview");
                }}
              >
                Back to list
              </Button>
            </div>

            {activeTab === "details" ? (
              <ProjectDetails
                project={selectedProject}
                activity={projectActivity}
                tasks={projectTasks}
                onBack={() => {
                  setSelectedProject(null);
                  setActiveTab("overview");
                }}
              />
            ) : null}

            {activeTab === "analytics" ? (
              <ProjectAnalytics metrics={projectAnalytics} />
            ) : null}
            {activeTab === "settings" ? (
              <ProjectSettings project={selectedProject} />
            ) : null}
          </div>
        ) : null}

        <CreateProjectDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreate={handleCreateProject}
        />
        <DeleteProjectDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
      </div>
    </AppShell>
  );
}
