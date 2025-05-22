'use client';

import Dashboard from "@/components/dashboard/dashboard";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { DashboardProvider } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="flex flex-col w-full h-[97dvh] overflow-hidden p-6 space-y-6 bg-ghost-white rounded-2xl">
        <DashboardHeader />
        <Dashboard />
      </div>
    </DashboardProvider>
  );
}