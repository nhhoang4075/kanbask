"use client";

import PriorityChart from "@/components/dashboard/priority-chart";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function PriorityCard() {
  return (
    <Card className="h-full flex flex-col overflow-hidden bg-white">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl m-0 p-0">Priority Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <PriorityChart />
      </CardContent>
    </Card>
  );
}
