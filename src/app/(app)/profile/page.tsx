import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Account
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Update your personal details and how you appear across FlowDesk.
        </p>
      </header>
    </div>
  );
}
