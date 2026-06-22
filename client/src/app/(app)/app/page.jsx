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
      <div className="flex flex-col w-full h-[97dvh] overflow-hidden p-6 space-y-6 bg-ghost-white rounded-md">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </DashboardProvider>
  );
}
