"use client";

import * as React from "react";
import { LayoutGrid, List, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectStatus } from "@/lib/dashboard-data";

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  owner: string;
  onOwnerChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ProjectFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  owner,
  onOwnerChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <div className="relative md:min-w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search projects"
            className="pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="All">All statuses</option>
          <option value="ON_TRACK">On track</option>
          <option value="AT_RISK">At risk</option>
          <option value="DELAYED">Delayed</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          value={owner}
          onChange={(event) => onOwnerChange(event.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="All">All owners</option>
          <option value="Ada Lovelace">Ada Lovelace</option>
          <option value="Noah Chen">Noah Chen</option>
          <option value="Lina Patel">Lina Patel</option>
          <option value="Marek Ortiz">Marek Ortiz</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="updated">Recently updated</option>
          <option value="created">Created date</option>
          <option value="progress">Progress</option>
          <option value="name">Name</option>
        </select>
        <div className="flex rounded-md border border-input bg-background p-1">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("grid")}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("list")}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
