"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import TaskTrendChart from "@/components/analytics/task-trend-chart";
import TaskDistributionChart from "@/components/analytics/task-distribution-chart";
import { dashboardStats } from "@/lib/dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <AnalyticsHeader />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {dashboardStats.slice(0, 4).map((stat) => (
            <Card key={stat.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-5">
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TaskTrendChart />
          </div>
          <TaskDistributionChart />
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between gap-4">
            <CardTitle>Detailed analytics</CardTitle>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              View more <ArrowRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This dedicated analytics view is a deeper workspace overview for
              projects, members, and task trends. Use the dashboard for quick
              summary insights.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
