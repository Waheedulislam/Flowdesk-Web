"use client";
import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectStatus } from "@/lib/api/project.api";
const statuses: ProjectStatus[] = [
  "PLANNING",
  "ACTIVE",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
];
export type ProjectOwnerOption = {
  id: string;
  name: string;
  avatar?: string | null;
};
export function ProjectFilters(p: {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  owner: string;
  onOwnerChange: (v: string) => void;
  owners: ProjectOwnerOption[];
  sort: string;
  onSortChange: (v: string) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <div className="relative md:min-w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={p.search}
            onChange={(e) => p.onSearchChange(e.target.value)}
            placeholder="Search projects"
            className="pl-9"
          />
        </div>
        <select
          value={p.status}
          onChange={(e) => p.onStatusChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="All">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={p.owner}
          onChange={(e) => p.onOwnerChange(e.target.value)}
          disabled={!p.owners.length}
          aria-label="Filter projects by owner"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="All">All owners</option>
          {p.owners.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <select
          value={p.sort}
          onChange={(e) => p.onSortChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="updated">Recently updated</option>
          <option value="created">Created date</option>
          <option value="name">Name</option>
        </select>
        <Button
          size="sm"
          variant={p.view === "grid" ? "default" : "ghost"}
          onClick={() => p.onViewChange("grid")}
        >
          <LayoutGrid />
        </Button>
        <Button
          size="sm"
          variant={p.view === "list" ? "default" : "ghost"}
          onClick={() => p.onViewChange("list")}
        >
          <List />
        </Button>
      </div>
    </div>
  );
}
