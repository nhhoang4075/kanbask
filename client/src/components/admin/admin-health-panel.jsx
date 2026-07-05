"use client";

import { useEffect } from "react";
import {
  RefreshCw,
  Database,
  HardDrive,
  Mail,
  BrainCircuit,
  Radio,
  Activity,
  Clock,
  MemoryStick,
  Gauge,
  AlertTriangle
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, capitalCase } from "@/lib/utils";
import { useAdmin } from "@/hooks/use-admin";

const STATUS_BADGE = {
  up: "bg-green-100 text-green-700",
  ready: "bg-green-100 text-green-700",
  down: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
  initializing: "bg-amber-100 text-amber-700"
};

const DEP_ICON = {
  database: Database,
  storage: HardDrive,
  mail: Mail,
  embedding: BrainCircuit
};

const isHealthy = (status) => status === "up" || status === "ready";

function formatUptime(seconds) {
  if (seconds == null) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function AdminHealthPanel() {
  const { health, error, fetchHealth, healthLoading } = useAdmin();

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const deps = health?.dependencies ?? [];
  const downDeps = deps.filter((dep) => !isHealthy(dep.status));
  const allHealthy = deps.length > 0 && downDeps.length === 0;

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-500">{error.message}</p>}

      {deps.length > 0 && (
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-xl p-6 text-white",
            allHealthy
              ? "bg-prussian-blue"
              : "bg-gradient-to-r from-prussian-blue from-0% via-prussian-blue via-65% to-red-900 to-100%"
          )}
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-sky-blue font-semibold mb-1">
              System status
            </p>
            <h3 className="text-lg font-semibold mb-1">
              {allHealthy
                ? "All systems operational"
                : `${downDeps.length} issue${downDeps.length > 1 ? "s" : ""} detected`}
            </h3>
            <p className="text-sm text-white/70">
              {allHealthy
                ? "Every monitored dependency is responding normally."
                : `${downDeps.map((dep) => capitalCase(dep.name)).join(", ")} ${
                    downDeps.length > 1 ? "are" : "is"
                  } unreachable — everything else is operating normally.`}
            </p>
          </div>
          <Badge
            className={cn(
              "flex-none rounded-full px-3 py-1 text-xs font-semibold",
              allHealthy ? "bg-white/15 text-white" : "bg-mustard/90 text-prussian-blue"
            )}
          >
            {deps.length - downDeps.length} of {deps.length} up
          </Badge>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex flex-row items-center gap-2"
          onClick={() => fetchHealth()}
          disabled={healthLoading}
        >
          <RefreshCw className={cn("h-4 w-4", healthLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {deps.map((dep) => {
          const Icon = DEP_ICON[dep.name] ?? Activity;
          const healthy = isHealthy(dep.status);

          return (
            <Card key={dep.name}>
              <CardHeader className="flex flex-row items-center gap-3">
                <div
                  className={cn(
                    "flex-none rounded-lg p-2",
                    healthy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <CardTitle className="flex-1 text-sm font-medium capitalize">{dep.name}</CardTitle>
                <Badge className={cn("rounded-sm", STATUS_BADGE[dep.status] ?? "bg-gray-100 text-gray-700")}>
                  {capitalCase(dep.status)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {dep.latency_ms != null && (
                  <>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Latency</span>
                      <span>{dep.latency_ms}ms</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn("h-full rounded-full", healthy ? "bg-green-500" : "bg-red-500")}
                        style={{ width: `${Math.min((dep.latency_ms / 1000) * 100, 100)}%` }}
                      />
                    </div>
                  </>
                )}
                {dep.error && (
                  <div className="flex items-center gap-2 rounded-md bg-red-50 px-2.5 py-2 text-xs text-red-600">
                    <AlertTriangle className="h-3.5 w-3.5 flex-none" />
                    {dep.error}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex-none rounded-lg p-2 bg-sky-blue/30 text-blue-green">
              <Radio className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-medium">Socket</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {health?.socket?.connections ?? "—"}
              </span>{" "}
              active connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex-none rounded-lg p-2 bg-sky-blue/30 text-blue-green">
              <Activity className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-medium">Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-blue-green" />
              Uptime{" "}
              <span className="font-semibold text-foreground">
                {formatUptime(health?.process?.uptime_seconds)}
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MemoryStick className="h-3.5 w-3.5 text-blue-green" />
              Memory{" "}
              <span className="font-semibold text-foreground">
                {health?.process?.memory_mb != null ? `${health.process.memory_mb} MB` : "—"}
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="h-3.5 w-3.5 text-blue-green" />
              Load avg{" "}
              <span className="font-semibold text-foreground">
                {health?.process?.load_avg?.join(", ") ?? "—"}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
