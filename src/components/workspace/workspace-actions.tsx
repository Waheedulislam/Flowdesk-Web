"use client";
import { Button } from "@/components/ui/button";
export function WorkspaceActions({ canInvite, onInvite, onCreate }: { canInvite: boolean; onInvite: () => void; onCreate: () => void }) { return <div className="flex flex-wrap items-center gap-2"><Button variant="outline" onClick={onCreate}>Create workspace</Button>{canInvite ? <Button onClick={onInvite}>Invite member</Button> : null}</div>; }
