"use client";

import * as React from "react";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuth } from "@/context/auth-context";
import { acceptInvitation } from "@/lib/api/workspace.api";

export default function AcceptInvitationPage() {
  const params = useParams();
  const router = useRouter();

  const { accessToken, isReady, user } = useAuth();

  const token =
    typeof params.token === "string"
      ? params.token
      : Array.isArray(params.token)
        ? params.token[0]
        : "";

  const [loading, setLoading] = React.useState(false);
  const [accepted, setAccepted] = React.useState(false);

  const handleAcceptInvitation = async () => {
    if (!accessToken) {
      toast.error("Please login first.");
      router.push(
        `/login?redirect=/accept-invitation/${encodeURIComponent(token)}`,
      );
      return;
    }

    if (!token) {
      toast.error("Invalid invitation link.");
      return;
    }

    setLoading(true);

    try {
      await acceptInvitation(accessToken, token);

      setAccepted(true);

      toast.success("Invitation accepted successfully", {
        description: "You have joined the workspace.",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to accept invitation.";

      toast.error("Unable to accept invitation", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!isReady || !token) return;

    // If user is not logged in, send them to login.
    if (!accessToken) {
      router.replace(
        `/login?redirect=/accept-invitation/${encodeURIComponent(token)}`,
      );
    }
  }, [accessToken, isReady, router, token]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Checking your account...
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid invitation</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              This invitation link is invalid or incomplete.
            </p>

            <Button
              className="mt-5 w-full"
              onClick={() => router.push("/dashboard")}
            >
              Go to dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <MailWarning className="size-10 text-primary" />

            <h1 className="mt-4 text-xl font-semibold">Login required</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Please login with the account that received this invitation.
            </p>

            <Button
              className="mt-6 w-full"
              onClick={() =>
                router.push(
                  `/login?redirect=/accept-invitation/${encodeURIComponent(
                    token,
                  )}`,
                )
              }
            >
              Login to continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <CheckCircle2 className="size-12 text-green-600" />

            <h1 className="mt-4 text-xl font-semibold">Invitation accepted</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Welcome to the workspace. Redirecting you to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Join workspace</CardTitle>

          <p className="text-sm text-muted-foreground">
            You have been invited to join a FlowDesk workspace.
          </p>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-border/70 bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Signed in as</p>

            <p className="mt-1 font-medium">{user?.email ?? "Your account"}</p>
          </div>

          <Button
            className="mt-6 w-full"
            onClick={handleAcceptInvitation}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Joining workspace...
              </>
            ) : (
              "Accept invitation"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
