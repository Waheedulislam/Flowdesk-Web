import { WorkflowEditorPage } from "@/components/workflows/workflow-editor-page";

export default async function Page({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = await params;
  return <WorkflowEditorPage mode="detail" workflowId={workflowId} />;
}
