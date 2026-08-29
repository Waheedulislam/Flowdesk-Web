"use client";

import * as React from "react";
import { Camera, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-context";
import { updateProfile } from "@/lib/api/auth.api";
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
import { Spinner } from "@/components/ui/spinner";

export default function ProfilePage() {
  const { accessToken, updateUser, user } = useAuth();
  const [name, setName] = React.useState(user?.name ?? "");
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  if (!user) {
    return (
      <p className="text-sm text-muted-foreground">Loading your profile…</p>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Enter your name.");
      return;
    }
    if (trimmedName.length < 2) {
      setNameError("Name must be at least 2 characters.");
      return;
    }
    if (trimmedName.length > 100) {
      setNameError("Name cannot exceed 100 characters.");
      return;
    }
    if (!accessToken) {
      setFormError("Your session is no longer valid. Please sign in again.");
      return;
    }

    setNameError(null);
    setIsSaving(true);

    try {
      const response = await updateProfile(accessToken, { name: trimmedName });
      updateUser(response.data);
      setName(response.data.name);
      toast.success("Profile updated successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't update your profile. Please try again.";
      setFormError(message);
      toast.error("Couldn't update your profile", { description: message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Profile information</CardTitle>
          <CardDescription>
            Update how you appear to the rest of your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar
                name={user.name}
                src={user.avatar ?? undefined}
                className="size-16 text-lg"
              />
              <div>
                <Button
                  type="button"
                  variant="outline"
                  disabled
                  title="Avatar changes are not available yet."
                >
                  <Camera />
                  Change avatar
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Avatar changes are not available yet.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={
                    nameError ? "profile-name-error" : undefined
                  }
                  className="mt-2"
                  disabled={isSaving}
                />
                {nameError ? (
                  <p
                    id="profile-name-error"
                    className="mt-2 text-sm text-destructive"
                  >
                    {nameError}
                  </p>
                ) : null}
              </div>
              <div>
                <Label>Email</Label>
                <p className="mt-2 rounded-md border border-input bg-muted/40 px-3 py-2 text-sm">
                  {user.email}
                </p>
              </div>
            </div>
            {formError ? (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            ) : null}
            <div>
              <Label>Role</Label>
              <div className="mt-2">
                <RoleBadge role={user.role} />
              </div>
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Spinner />
                  Saving changes…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account preferences</CardTitle>
          <CardDescription>
            Control your personal workspace experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex items-center justify-between text-sm font-medium">
            Receive weekly workspace summary
            <input
              type="checkbox"
              defaultChecked
              className="size-4 accent-primary"
            />
          </label>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Keep your account protected.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <LockKeyhole />
            Change password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
