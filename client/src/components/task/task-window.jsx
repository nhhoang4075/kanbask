"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TableProperties, AlignStartHorizontal } from "lucide-react";

import TaskList from "@/components/task/list/task-list";
import TaskKanban from "@/components/task/kanban/kanban-board";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TaskWindow() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "list";

  const changeTab = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full h-full rounded-md">
      <Tabs value={tab} onValueChange={changeTab} className="w-full h-full bg-white">
        <TabsList className="justify-start w-full px-6 gap-x-6 rounded-none border-b bg-white">
          <TabsTrigger
            value="list"
            className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            <div className="flex items-center gap-2">
              <TableProperties className="h-4 w-4" />
              List
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="kanban"
            className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            <div className="flex items-center gap-2">
              <AlignStartHorizontal className="h-4 w-4" />
              Kanban
            </div>
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="w-full h-[calc(98vh-100px)]">
          <TabsContent value="list" className="m-0">
            <div className="w-full p-6">
              <TaskList />
            </div>
          </TabsContent>
          <TabsContent value="kanban" className="m-0">
            <div className="w-full p-6">
              <TaskKanban />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
