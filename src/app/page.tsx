import {
  ArrowRight,
  CircleCheckBig,
  CircleX,
  Info,
  Plus,
  TriangleAlert,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Phase 1 preview: renders the FlowDesk shell (sidebar + navbar + responsive
 * nav) around a gallery of the base design-system components so both themes
 * can be reviewed. This route is a scaffold and will be replaced by the real
 * dashboard in a later phase.
 */
export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <p className="text-sm font-medium text-primary">Phase 1 · Foundation</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Design system preview
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The FlowDesk shell, theme system, and base components. Toggle light
            and dark from the navbar, and resize to see the sidebar collapse
            into a mobile drawer.
          </p>
        </header>

        <Section title="Buttons" description="Variants and sizes.">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button>
              <Plus />
              New project
            </Button>
            <Button variant="outline">
              Continue
              <ArrowRight />
            </Button>
          </div>
        </Section>

        <Section title="Badges" description="Status and semantic tokens.">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">
              <CircleCheckBig />
              Completed
            </Badge>
            <Badge variant="warning">
              <TriangleAlert />
              At risk
            </Badge>
            <Badge variant="destructive">
              <CircleX />
              Overdue
            </Badge>
            <Badge variant="info">
              <Info />
              In review
            </Badge>
          </div>
        </Section>

        <Section title="Cards" description="Primary content surface.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Active projects</CardTitle>
                <CardDescription>Across your workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">24</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-success">+4</span> this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invite a teammate</CardTitle>
                <CardDescription>
                  Add members to collaborate in real time.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="invite-email">Email address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@company.com"
                  />
                </div>
              </CardContent>
              <CardFooter>
                {/* TODO: Connect invitation flow to backend. */}
                <Button className="w-full">Send invite</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loading state</CardTitle>
                <CardDescription>Skeleton placeholders</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-3 pt-2">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Form inputs" description="Labels and fields.">
          <div className="grid max-w-md gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="project-name">Project name</Label>
              <Input id="project-name" placeholder="Q3 Marketing launch" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="disabled-field">Disabled</Label>
              <Input id="disabled-field" placeholder="Unavailable" disabled />
            </div>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Separator />
      {children}
    </section>
  );
}
