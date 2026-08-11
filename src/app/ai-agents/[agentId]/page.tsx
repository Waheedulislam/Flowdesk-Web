import { AgentDetails } from "@/components/ai-agents/agent-details";

export default async function Page({ params }: { params: Promise<{ agentId: string }> }) { const { agentId } = await params; return <AgentDetails agentId={agentId} />; }
