// TODO: Connect user management API
// TODO: Connect workspace management API
// TODO: Connect audit log API
// TODO: Connect platform analytics API
// TODO: Enforce permissions on backend
export const mockUsers = [["Ada Lovelace", "ada@flowdesk.io", "FlowDesk Core", "Admin", "Active", "2 min ago"], ["Grace Hopper", "grace@flowdesk.io", "Growth Team", "Member", "Active", "18 min ago"], ["Alan Turing", "alan@flowdesk.io", "FlowDesk Core", "Member", "Invited", "—"]] as const;
export const mockAdminWorkspaces = [["FlowDesk Core", "Ada Lovelace", "24", "12", "Business", "Active", "Jan 12, 2026"], ["Growth Team", "Grace Hopper", "18", "7", "Pro", "Active", "Feb 08, 2026"], ["Research Lab", "Alan Turing", "6", "3", "Free", "Paused", "Mar 18, 2026"]] as const;
export const mockAuditLogs = [["Ada Lovelace", "Updated workspace settings", "FlowDesk Core", "Today, 10:42 AM", "Success"], ["Grace Hopper", "Created project", "Website Refresh", "Today, 9:18 AM", "Success"], ["Alan Turing", "Invited member", "Research Lab", "Yesterday, 4:05 PM", "Success"]] as const;
