"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

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

function formatUptime(seconds) {
  if (seconds == null) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function AdminHealthPanel() {
  const { health, fetchHealth, loading } = useAdmin();

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex flex-row items-center gap-2"
          onClick={() => fetchHealth()}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {health?.dependencies?.map((dep) => (
          <Card key={dep.name}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium capitalize">{dep.name}</CardTitle>
              <Badge className={cn("rounded-sm", STATUS_BADGE[dep.status] ?? "bg-gray-100 text-gray-700")}>
                {capitalCase(dep.status)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-1">
              {dep.latency_ms != null && (
                <p className="text-sm text-muted-foreground">Latency: {dep.latency_ms}ms</p>
              )}
              {dep.error && <p className="text-sm text-red-500">{dep.error}</p>}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Socket</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connections: {health?.socket?.connections ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Uptime: {formatUptime(health?.process?.uptime_seconds)}
            </p>
            <p className="text-sm text-muted-foreground">
              Memory: {health?.process?.memory_mb != null ? `${health.process.memory_mb} MB` : "—"}
            </p>
            <p className="text-sm text-muted-foreground">
              Load average: {health?.process?.load_avg?.join(", ") ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
