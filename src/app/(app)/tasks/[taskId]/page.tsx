import { TaskDetailPage } from "@/components/tasks/task-detail-page";

export default async function TaskRoutePage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  return <TaskDetailPage taskId={taskId} />;
}
