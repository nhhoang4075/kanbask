import AppHeader from "@/components/app/app-header";
import TeamSideBar from "@/components/team/team-sidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export const metadata = {
  title: "Team",
  description: "Your Kanbask team"
};

export default function TeamLayout({ children }) {
  return (
    <div className="flex flex-col gap-2 w-full h-[98dvh] overflow-hidden rounded-md">
      <AppHeader name="Team" />
      <div className="flex-1 overflow-auto">
        <ResizablePanelGroup autoSaveId={"resizable-team"} direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={25} maxSize={35} className="rounded-md">
            <TeamSideBar />
          </ResizablePanel>
          <ResizableHandle className="mx-0.5 w-0.5 rounded bg-transparent hover:bg-mustard active:bg-mustard transition duration-200 ease-in-out" />
          <ResizablePanel defaultSize={70} className="rounded-md">
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
