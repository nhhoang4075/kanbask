"use client";

import ProgressChart from "@/components/dashboard/progress-chart";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function ProgressCard() {
  return (
    <Card className="h-full flex flex-col overflow-hidden bg-white">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl m-0 p-0">Completion Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ProgressChart />
      </CardContent>
    </Card>
  );
}
