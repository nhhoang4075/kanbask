import Dashboard from "@/components/dashboard/dashboard";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export const metadata = {
  title: "Dashboard",
  description: "Your Kanbask dashboard"
};

export default function DashboardPage() {
  return (
    <div className="w-full h-[97dvh] overflow-hidden p-6 space-y-6 bg-ghost-white rounded-2xl">
      <DashboardHeader />
      <Dashboard />
    </div>
  );
}
