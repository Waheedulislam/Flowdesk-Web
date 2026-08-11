// TODO: Connect workflows API
// TODO: Connect workflow execution API
// TODO: Connect workflow execution history API

export type WorkflowStatus = "active" | "draft" | "paused";
export type WorkflowStepKind = "condition" | "action";

export type WorkflowStep = {
  id: string;
  kind: WorkflowStepKind;
  title: string;
  field?: string;
  operator?: string;
  value?: string;
  action?: string;
  recipient?: string;
  message?: string;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: string;
  steps: WorkflowStep[];
  lastExecution: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Execution = {
  id: string;
  workflow: string;
  trigger: string;
  status: "success" | "failed" | "running";
  startedAt: string;
  completedAt: string;
  duration: string;
  stepsExecuted: string;
};

export const triggerOptions = [
  "Task created", "Task updated", "Task completed", "Task status changed",
  "Task assigned", "Project created", "Member joined workspace", "Comment added", "Due date approaching",
];

export const mockWorkflows: Workflow[] = [
  {
    id: "workflow-1", name: "High Priority Task Alert", status: "active",
    description: "Notify the team when a high priority task is completed.", trigger: "Task completed",
    steps: [
      { id: "s1", kind: "condition", title: "Check priority", field: "Priority", operator: "is", value: "High" },
      { id: "s2", kind: "action", title: "Send notification", action: "Send notification", recipient: "Project team", message: "A high priority task was completed." },
    ],
    lastExecution: "12 minutes ago", createdBy: "Ada Lovelace", createdAt: "Jul 18, 2026", updatedAt: "12 minutes ago",
  },
  {
    id: "workflow-2", name: "New Task Triage", status: "active",
    description: "Route newly created tasks to the right owner based on priority.", trigger: "Task created",
    steps: [
      { id: "s3", kind: "condition", title: "Check priority", field: "Priority", operator: "is", value: "High" },
      { id: "s4", kind: "action", title: "Assign task", action: "Assign task", recipient: "Operations lead" },
    ],
    lastExecution: "1 hour ago", createdBy: "Grace Hopper", createdAt: "Jul 11, 2026", updatedAt: "Yesterday",
  },
  {
    id: "workflow-3", name: "Due Date Reminder", status: "paused",
    description: "Remind assignees when work is approaching its due date.", trigger: "Due date approaching",
    steps: [{ id: "s5", kind: "action", title: "Send notification", action: "Send notification", recipient: "Task assignee", message: "This task is due tomorrow." }],
    lastExecution: "Aug 2, 2026", createdBy: "Ada Lovelace", createdAt: "Jun 29, 2026", updatedAt: "Aug 2, 2026",
  },
  {
    id: "workflow-4", name: "Welcome New Members", status: "draft",
    description: "Introduce new workspace members to the team and onboarding resources.", trigger: "Member joined workspace",
    steps: [{ id: "s6", kind: "action", title: "Send notification", action: "Send notification", recipient: "New member", message: "Welcome to FlowDesk!" }],
    lastExecution: "Not run yet", createdBy: "Grace Hopper", createdAt: "Aug 6, 2026", updatedAt: "Aug 6, 2026",
  },
];

export const mockExecutions: Execution[] = [
  { id: "run-1", workflow: "High Priority Task Alert", trigger: "Task completed", status: "success", startedAt: "Today, 10:42 AM", completedAt: "10:42 AM", duration: "0.8s", stepsExecuted: "2 of 2" },
  { id: "run-2", workflow: "New Task Triage", trigger: "Task created", status: "success", startedAt: "Today, 9:18 AM", completedAt: "9:18 AM", duration: "1.1s", stepsExecuted: "2 of 2" },
  { id: "run-3", workflow: "High Priority Task Alert", trigger: "Task completed", status: "failed", startedAt: "Yesterday, 4:05 PM", completedAt: "4:05 PM", duration: "0.6s", stepsExecuted: "1 of 2" },
];
