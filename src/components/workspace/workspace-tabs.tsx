"use client";

export type WorkspaceTab = "overview" | "members" | "settings";

export function WorkspaceTabs({ activeTab, onChange }: { activeTab: WorkspaceTab; onChange: (tab: WorkspaceTab) => void }) {
  return <div className="flex flex-wrap gap-2" role="tablist" aria-label="Workspace sections">
    {(["overview", "members", "settings"] as const).map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => onChange(tab)} className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>{tab}</button>)}
  </div>;
}
