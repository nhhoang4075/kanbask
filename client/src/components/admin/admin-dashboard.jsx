"use client";

import { useEffect } from "react";
import { Users, UsersRound, FolderKanban, ListChecks } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/use-admin";

const STATUS_DOT = {
  up: "bg-green-500",
  ready: "bg-green-500",
  down: "bg-red-500",
  failed: "bg-red-500",
  initializing: "bg-amber-500"
};

export default function AdminDashboard() {
  const { stats, health, fetchStats, fetchHealth } = useAdmin();

  useEffect(() => {
    fetchStats();
    fetchHealth();
  }, [fetchStats, fetchHealth]);

  const cards = [
    { label: "Users", value: stats?.user_count, icon: Users },
    { label: "Teams", value: stats?.team_count, icon: UsersRound },
    { label: "Projects", value: stats?.project_count, icon: FolderKanban },
    { label: "Tasks", value: stats?.task_count, icon: ListChecks }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-prussian-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value ?? "—"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          {health?.dependencies?.length ? (
            <div className="flex flex-row flex-wrap gap-4">
              {health.dependencies.map((dep) => (
                <div key={dep.name} className="flex items-center gap-2">
                  <span
                    className={cn("h-2.5 w-2.5 rounded-full", STATUS_DOT[dep.status] ?? "bg-gray-400")}
                  />
                  <span className="text-sm capitalize">{dep.name}</span>
                </div>
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
