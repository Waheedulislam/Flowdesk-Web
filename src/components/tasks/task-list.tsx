import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  TaskPriorityBadge,
  TaskStatusBadge,
} from "@/components/tasks/task-status-badge";
import type { TaskItem } from "@/lib/tasks-data";

interface TaskListProps {
  tasks: TaskItem[];
  onOpen: (task: TaskItem) => void;
}

export function TaskList({ tasks, onOpen }: TaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden px-0 md:px-6">
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Assignee</th>
                  <th className="w-[140px] px-4 py-3 font-medium">Status</th>
                  <th className="w-[110px] px-4 py-3 font-medium">Priority</th>
                  <th className="w-[100px] px-4 py-3 font-medium">Due</th>
                  <th className="w-[90px] px-4 py-3 font-medium">Comments</th>
                  <th className="w-[72px] px-4 py-3 font-medium">Files</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="cursor-pointer border-t border-border/70 align-middle"
                    onClick={() => onOpen(task)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {task.createdAt}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {task.project}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignee} className="size-8" />
                        <span className="truncate text-sm">
                          {task.assignee}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <TaskStatusBadge status={task.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <TaskPriorityBadge priority={task.priority} />
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {task.dueDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {task.comments}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {task.attachments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-4 pb-2 md:hidden">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-border bg-background p-4"
              onClick={() => onOpen(task)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {task.project}
                  </p>
                </div>
                <TaskPriorityBadge priority={task.priority} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center">
                  <TaskStatusBadge status={task.status} />
                </div>
                <span className="text-sm text-muted-foreground">
                  Due {task.dueDate}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>{task.assignee}</span>
                <span>
                  {task.comments} comments · {task.attachments} files
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
