"use client";

import * as React from "react";
import {
  AlertCircle,
  Loader2,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { RoleBadge } from "@/components/roles/role-badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspaceDetail } from "@/components/workspace/hooks/use-workspace-detail";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import { updateProfile } from "@/lib/api/auth.api";

const sections = [
  "General",
  "Workspace",
  "Notifications",
  "Appearance",
  "Security",
  "Billing",
] as const;

export default function SettingsPage() {
  const { accessToken, isReady, user, updateUser } = useAuth();
  const {
    activeWorkspace,
    isLoading: workspaceLoading,
    error: workspaceError,
    refreshWorkspaces,
  } = useWorkspace();
  const detailState = useWorkspaceDetail({
    accessToken,
    isReady,
    slug: activeWorkspace?.slug,
  });

  const [section, setSection] =
    React.useState<(typeof sections)[number]>("General");
  const [profileName, setProfileName] = React.useState(user?.name ?? "");
  const [profileError, setProfileError] = React.useState<string | null>(null);
  const [profileSaving, setProfileSaving] = React.useState(false);
  const { theme, setTheme } = useTheme();

  if (!isReady || !user) {
    return (
      <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
        Loading your settings…
      </div>
    );
  }

  const resolvedProfileName = profileName || user.name;

  const workspaceName =
    detailState.detail?.name ??
    activeWorkspace?.name ??
    "No workspace selected";
  const workspaceDescription =
    detailState.detail?.description ??
    activeWorkspace?.description ??
    "No description available";
  const workspaceOwner = detailState.detail?.owner.name ?? "Unavailable";
  const workspaceStatus =
    detailState.detail?.status ?? activeWorkspace?.status ?? "UNKNOWN";

  const handleProfileSave = async () => {
    const trimmedName = profileName.trim();

    if (!trimmedName) {
      setProfileError("Please enter your name.");
      return;
    }

    if (!accessToken) {
      setProfileError("Your session is no longer valid. Please sign in again.");
      return;
    }

    setProfileError(null);
    setProfileSaving(true);

    try {
      const response = await updateProfile(accessToken, { name: trimmedName });
      updateUser(response.data);
      setProfileName(response.data.name);
      toast.success("Profile updated successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't update your profile. Please try again.";
      setProfileError(message);
      toast.error("Couldn't update your profile", { description: message });
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div>
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your workspace preferences and account details.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {sections.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSection(item)}
              className={`shrink-0 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                section === item
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div>
          {(section === "General" || section === "Workspace") && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {section === "General"
                      ? "General settings"
                      : "Workspace details"}
                  </CardTitle>
                  <CardDescription>
                    These details are loaded from your authenticated account and
                    active workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {section === "General" ? (
                    <>
                      <div className="flex items-center gap-4">
                        <Avatar
                          name={user.name}
                          src={user.avatar ?? undefined}
                          className="size-14 text-base"
                        />
                        <div className="space-y-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="profile-name">Full name</Label>
                          <Input
                            id="profile-name"
                            value={resolvedProfileName}
                            onChange={(event) =>
                              setProfileName(event.target.value)
                            }
                            className="mt-2"
                            aria-invalid={Boolean(profileError)}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            value={user.email}
                            readOnly
                            className="mt-2 bg-muted/40"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Role</Label>
                        <div className="mt-2">
                          <RoleBadge role={user.role} />
                        </div>
                      </div>

                      {profileError ? (
                        <p className="text-sm text-destructive">
                          {profileError}
                        </p>
                      ) : null}

                      <Button
                        onClick={handleProfileSave}
                        disabled={profileSaving}
                      >
                        {profileSaving ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Saving changes…
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Field label="Workspace name" value={workspaceName} />
                      <Field
                        label="Workspace description"
                        value={workspaceDescription}
                      />
                      <Field label="Workspace owner" value={workspaceOwner} />
                      <Field label="Workspace status" value={workspaceStatus} />

                      {workspaceError ? (
                        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                          <AlertCircle className="mt-0.5 size-4 shrink-0" />
                          <span>{workspaceError}</span>
                        </div>
                      ) : null}

                      {workspaceLoading ? (
                        <p className="text-sm text-muted-foreground">
                          Loading workspace details…
                        </p>
                      ) : null}

                      <Button
                        variant="outline"
                        onClick={() => void refreshWorkspaces()}
                        disabled={workspaceLoading}
                      >
                        Refresh workspace
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {section === "Notifications" ? (
            <PreferenceCard
              title="Notification preferences"
              copy="This preference model is not backed by a current notification API."
              items={[
                "Email notifications",
                "Task assignments",
                "Mentions",
                "Due date reminders",
                "Weekly reports",
              ]}
              disabled
            />
          ) : null}

          {section === "Appearance" ? (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Choose how FlowDesk looks on this device.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ].map((option) => {
                  const Icon = option.icon;
                  const active =
                    theme === option.value ||
                    (option.value === "system" && !theme);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background hover:bg-accent"
                      }`}
                    >
                      <Icon className="size-5" />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}

          {section === "Security" ? (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Keep your account protected.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SecurityRow
                  title="Two-factor authentication"
                  copy="No backend endpoint is available to manage this setting yet."
                  action="Unavailable"
                  disabled
                />
                <SecurityRow
                  title="Passkeys"
                  copy="Passkey management is not supported by the current backend."
                  action="Unavailable"
                  disabled
                />
                <SecurityRow
                  title="Password"
                  copy="Password updates are not supported by the current backend contract."
                  action="Unavailable"
                  disabled
                />
              </CardContent>
            </Card>
          ) : null}

          {section === "Billing" ? (
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                  Current plan and invoice settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">
                    Billing information
                  </p>
                  <p className="mt-2 text-base font-medium text-muted-foreground">
                    No billing API is available in the current backend contract.
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Manage billing
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} readOnly className="mt-2 bg-muted/40" />
    </div>
  );
}

function PreferenceCard({
  title,
  copy,
  items,
  disabled,
}: {
  title: string;
  copy: string;
  items: string[];
  disabled?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{copy}</CardDescription>
      </CardHeader>
      <CardContent className="divide-y">
        {items.map((item, index) => (
          <label
            key={item}
            className="flex cursor-pointer items-center justify-between py-4 text-sm font-medium"
          >
            <span>{item}</span>
            <input
              type="checkbox"
              defaultChecked={index < 4}
              disabled={disabled}
              className="size-4 accent-primary disabled:opacity-50"
            />
          </label>
        ))}
      </CardContent>
    </Card>
  );
}

function SecurityRow({
  title,
  copy,
  action,
  disabled,
}: {
  title: string;
  copy: string;
  action: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
      </div>
      <Button variant="outline" disabled={disabled}>
        <ShieldCheck className="size-4" />
        {action}
      </Button>
    </div>
  );
}
