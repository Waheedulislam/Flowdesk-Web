// TODO: Connect agents API
// TODO: Connect agent activity API
// TODO: Connect agent execution API

export type AgentStatus = "active" | "paused" | "draft";
export type Agent = { id: string; name: string; description: string; status: AgentStatus; type: string; workspace: string; instructions: string; lastActive: string; actions: number; icon: "chart" | "check" | "users" | "workflow" | "report"; frequency: string; permissions: string };

export const agentTypes = ["Project analyst", "Task assistant", "Team insights", "Workflow assistant", "Weekly reporter"];

export const mockAgents: Agent[] = [
  { id: "agent-1", name: "Project Analyst", description: "Analyzes project progress and identifies risks.", status: "active", type: "Project analyst", workspace: "FlowDesk Core", instructions: "You are a FlowDesk project assistant. Analyze project progress, identify blockers, and provide concise recommendations.", lastActive: "10 min ago", actions: 12, icon: "chart", frequency: "Daily", permissions: "Projects and tasks" },
  { id: "agent-2", name: "Task Assistant", description: "Helps organize, summarize and prioritize tasks.", status: "active", type: "Task assistant", workspace: "FlowDesk Core", instructions: "Review workspace tasks, surface overdue work, and suggest clear next actions.", lastActive: "32 min ago", actions: 28, icon: "check", frequency: "Hourly", permissions: "Tasks" },
  { id: "agent-3", name: "Team Insights", description: "Analyzes team workload and productivity.", status: "paused", type: "Team insights", workspace: "FlowDesk Core", instructions: "Identify workload patterns and highlight opportunities to balance team capacity.", lastActive: "Yesterday", actions: 9, icon: "users", frequency: "Weekly", permissions: "Workspace analytics" },
  { id: "agent-4", name: "Workflow Assistant", description: "Suggests workflow automations based on workspace activity.", status: "draft", type: "Workflow assistant", workspace: "FlowDesk Core", instructions: "Find repetitive workspace patterns and propose helpful workflow automations.", lastActive: "Not run yet", actions: 0, icon: "workflow", frequency: "Manual", permissions: "Tasks and workflows" },
  { id: "agent-5", name: "Weekly Reporter", description: "Prepares weekly workspace summaries.", status: "active", type: "Weekly reporter", workspace: "FlowDesk Core", instructions: "Create a concise weekly report of workspace progress, completed work, and risks.", lastActive: "2 hours ago", actions: 6, icon: "report", frequency: "Weekly", permissions: "Workspace analytics" },
];

export const mockAgentActivity = [
  ["Project Analyst", "Analyzed Apollo Web Redesign", "10 minutes ago"],
  ["Task Assistant", "Reviewed 8 overdue tasks", "32 minutes ago"],
  ["Weekly Reporter", "Generated workspace summary", "2 hours ago"],
] as const;
