import type { TaskRecord, TaskStatus } from "@/lib/api/task.api";

export type ProjectTaskStatistics = {
  totalTasks: number;
  completedTasks: number;
  progress: number;
  statusCounts: Record<TaskStatus, number>;
};

const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

export function getProjectTaskStatistics(
  tasks: TaskRecord[],
): ProjectTaskStatistics {
  const statusCounts = taskStatuses.reduce(
    (counts, status) => {
      counts[status] = 0;
      return counts;
    },
    {} as Record<TaskStatus, number>,
  );

  tasks.forEach((task) => {
    statusCounts[task.status] += 1;
  });

  const totalTasks = tasks.length;
  const completedTasks = statusCounts.DONE;

  return {
    totalTasks,
    completedTasks,
    progress:
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    statusCounts,
  };
}
