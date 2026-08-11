// TODO: Connect conversation API
// TODO: Connect message history API
// TODO: Connect workspace context API

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  title: string;
  timestamp: string;
  group: "Today" | "Yesterday";
  messages: ChatMessage[];
};

export const suggestedPrompts = [
  "Show me my overdue tasks",
  "Which projects are falling behind?",
  "Summarize this week's activity",
  "What should my team focus on today?",
  "Create a workflow for overdue tasks",
  "Show me the busiest team members",
];

export const mockConversations: Conversation[] = [
  {
    id: "ai-1", title: "Project planning", timestamp: "2 min ago", group: "Today",
    messages: [
      { id: "m1", role: "user", content: "Which projects need attention this week?", timestamp: "10:32 AM" },
      { id: "m2", role: "assistant", content: "Atlas Mobile App needs the most attention: it has three tasks due this week and two are currently blocked. The Website Refresh is also approaching its design review milestone on Thursday.", timestamp: "10:32 AM" },
    ],
  },
  { id: "ai-2", title: "Weekly team summary", timestamp: "1 hour ago", group: "Today", messages: [{ id: "m3", role: "assistant", content: "This week, your team completed 24 tasks across 6 active projects. Momentum is strongest in Product and Design.", timestamp: "9:18 AM" }] },
  { id: "ai-3", title: "Overdue task review", timestamp: "3 hours ago", group: "Today", messages: [{ id: "m4", role: "assistant", content: "There are 8 overdue tasks. Atlas Mobile App has the highest number of overdue items.", timestamp: "7:05 AM" }] },
  { id: "ai-4", title: "Website launch planning", timestamp: "Yesterday", group: "Yesterday", messages: [{ id: "m5", role: "user", content: "Help me plan the website launch.", timestamp: "Yesterday" }] },
  { id: "ai-5", title: "Workflow ideas", timestamp: "Yesterday", group: "Yesterday", messages: [{ id: "m6", role: "assistant", content: "I can help draft automation ideas for repetitive task follow-ups and project handoffs.", timestamp: "Yesterday" }] },
];

export function getMockResponse(prompt: string) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("overdue")) return "Your workspace currently has 8 overdue tasks. The Atlas Mobile App has the highest number of overdue items, with three tasks needing an owner update.";
  if (normalized.includes("falling behind") || normalized.includes("project")) return "Atlas Mobile App is at risk of slipping its next milestone because two implementation tasks are blocked. Website Refresh is on track, but its design review is due Thursday.";
  if (normalized.includes("workflow")) return "A useful starting workflow is: when a task becomes overdue, notify its assignee, then alert the project owner after 24 hours. You can build this from the Workflows area.";
  if (normalized.includes("busiest") || normalized.includes("focus")) return "The Product team has the most active work today. I would focus first on unblocking Atlas Mobile App, then confirming owners for the overdue tasks.";
  return "I can help you explore tasks, projects, productivity, and workflow ideas. Based on your workspace, I recommend reviewing the Atlas Mobile App blockers first.";
}
