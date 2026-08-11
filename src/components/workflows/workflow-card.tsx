"use client";

import Link from "next/link";
import { ArrowRight, MoreHorizontal, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkflowStatusBadge } from "@/components/workflows/workflow-status-badge";
import type { Workflow } from "@/lib/workflows-data";

export function WorkflowCard({
  workflow,
  onToggle,
}: {
  workflow: Workflow;
  onToggle: (id: string) => void;
}) {
  const isActive = workflow.status === "active";

  return (
    <Card className="group h-full min-h-72 overflow-hidden transition-[box-shadow,border-color] hover:border-primary/25 hover:shadow-md">
      <CardContent className="flex h-full p-5 sm:p-6">
        <div className="flex w-full min-w-0 gap-3.5">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="size-4" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/workflows/${workflow.id}`}
                  className="line-clamp-1 font-semibold transition-colors hover:text-primary"
                >
                  {workflow.name}
                </Link>
                <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                  {workflow.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={`Actions for ${workflow.name}`}
                  className="-mr-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="my-5 flex min-w-0 items-center gap-1.5 overflow-hidden text-xs">
              <span className="max-w-36 shrink-0 truncate rounded-md border border-border bg-muted/70 px-2.5 py-1.5 font-medium text-foreground">
                When {workflow.trigger}
              </span>
              {workflow.steps.map((step) => (
                <span key={step.id} className="flex min-w-0 items-center gap-1.5">
                  <ArrowRight aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
                  <span className="max-w-28 truncate rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-muted-foreground">
                    {step.title}
                  </span>
                </span>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <WorkflowStatusBadge status={workflow.status} />
                <span className="whitespace-nowrap">
                  {workflow.steps.length} {workflow.steps.length === 1 ? "step" : "steps"}
                </span>
                <span className="whitespace-nowrap">Last run {workflow.lastExecution}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                aria-label={`${isActive ? "Pause" : "Activate"} ${workflow.name}`}
                onClick={() => onToggle(workflow.id)}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border p-0.5 text-[10px] font-bold tracking-wide shadow-sm transition-all duration-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground hover:bg-accent"}`}
              >
                <span className={`absolute ${isActive ? "left-2" : "right-2"}`}>
                  {isActive ? "ON" : "OFF"}
                </span>
                <span
                  className={`relative size-5 rounded-full bg-background shadow-sm transition-transform duration-200 ease-out ${isActive ? "translate-x-7" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
