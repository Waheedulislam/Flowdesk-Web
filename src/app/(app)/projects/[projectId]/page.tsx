import { ProjectDetailPage } from "@/components/projects/project-detail-page";

export default async function ProjectRoutePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectDetailPage projectId={projectId} />;
}
