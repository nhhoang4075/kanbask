import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}