import AppHeader from "@/components/app/app-header";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardContent from "@/components/dashboard/dashboard-content";
import { DashboardProvider } from "@/hooks/use-dashboard";

export const metadata = {
  title: "Dashboard",
  description: "Your Kanbask dashboard"
};

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="flex flex-col gap-2 w-full h-[98dvh] overflow-hidden rounded-md">
        <AppHeader name="Dashboard">
          <DashboardHeader />
        </AppHeader>
        <div className="flex-1 flex flex-col rounded-md bg-ghost-white overflow-auto">
          <DashboardContent />
        </div>
      </div>
    </DashboardProvider>
  );
}
