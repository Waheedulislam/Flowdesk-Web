import { ProjectsPage } from "@/components/projects/projects-page";

export default async function ProjectRoutePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectsPage initialProjectId={projectId} />;
}
