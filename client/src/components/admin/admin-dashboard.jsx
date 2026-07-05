"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Users, UsersRound, FolderKanban, ListChecks } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sparkline from "@/components/admin/sparkline";
import { cn, capitalCase } from "@/lib/utils";
import { useAdmin } from "@/hooks/use-admin";

const STATUS_BADGE = {
  up: "bg-green-100 text-green-700",
  ready: "bg-green-100 text-green-700",
  down: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
  initializing: "bg-amber-100 text-amber-700"
};

export default function AdminDashboard() {
  const { stats, health, fetchStats, fetchHealth } = useAdmin();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchStats();
    fetchHealth();
  }, [fetchStats, fetchHealth]);

  const cards = [
    {
      label: "Users",
      value: stats?.user_count,
      trend: stats?.history?.users,
      icon: Users,
      iconClass: "bg-blue-100 text-blue-700"
    },
    {
      label: "Teams",
      value: stats?.team_count,
      trend: stats?.history?.teams,
      icon: UsersRound,
      iconClass: "bg-emerald-100 text-emerald-700"
    },
    {
      label: "Projects",
      value: stats?.project_count,
      trend: stats?.history?.projects,
      icon: FolderKanban,
      iconClass: "bg-amber-100 text-amber-700"
    },
    {
      label: "Tasks",
      value: stats?.task_count,
      trend: stats?.history?.tasks,
      icon: ListChecks,
      iconClass: "bg-mustard/40 text-prussian-blue"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, trend, icon: Icon, iconClass }) => (
          <Card key={label} className="gap-3">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <p className="text-3xl font-bold mt-1">{value ?? "—"}</p>
              </div>
              <div className={cn("flex-none rounded-lg p-2", iconClass)}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {trend && trend.length > 1 ? (
                <Sparkline data={trend} className="h-8 w-full" />
              ) : (
                <div className="h-8" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            System Health
          </CardTitle>
          <Link
            href={`${pathname}?${new URLSearchParams({
              ...Object.fromEntries(searchParams),
              tab: "health"
            }).toString()}`}
            className="text-xs font-semibold text-blue-green hover:underline"
          >
            View details →
          </Link>
        </CardHeader>
        <CardContent>
          {health?.dependencies?.length ? (
            <div className="flex flex-row flex-wrap gap-2">
              {health.dependencies.map((dep) => (
                <Badge
                  key={dep.name}
                  className={cn("rounded-sm capitalize", STATUS_BADGE[dep.status] ?? "bg-gray-100 text-gray-700")}
                >
                  {capitalCase(dep.name)}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No health data yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
