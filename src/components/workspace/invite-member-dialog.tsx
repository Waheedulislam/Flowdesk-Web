"use client";

import * as React from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RoleSelector } from "@/components/workspace/role-selector";
import type { MemberRole } from "@/lib/workspace-data";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSent: (email: string, role: MemberRole) => void;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  onInviteSent,
}: InviteMemberDialogProps) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<MemberRole>("MEMBER");
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "error" | "success">(
    "idle",
  );
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter an email address.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    // TODO: Connect invitation API.
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setLoading(false);
    setStatus("success");
    setMessage(`Invitation sent to ${email}.`);
    onInviteSent(email, role);
    onOpenChange(false);
    setEmail("");
    setRole("MEMBER");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <Card className="w-full max-w-lg border-border/70 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">
                Invite member
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                Add someone to this workspace
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="invite-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="colleague@flowdesk.io"
                  className="pl-9"
                  aria-invalid={status === "error"}
                />
              </div>
            </div>

            <RoleSelector
              value={role}
              onChange={setRole}
              label="Choose a role"
            />

            {status === "error" ? (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {message}
              </div>
            ) : null}

            {status === "success" ? (
              <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-sm text-success">
                <CheckCircle2 className="size-4" />
                {message}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send invitation"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
