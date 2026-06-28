"use client";

import TaskDetailsForm from "@/components/task/task-details-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTask } from "@/hooks/use-task";
import { useProject } from "@/hooks/use-project";

export default function CreateTaskSheet({ isOpen, onOpenChange }) {
  const { selectedProject } = useProject();
  const { handleCreateTask } = useTask();

  const handleSubmit = async (formData) => {
    await handleCreateTask({ ...formData, project_id: selectedProject.id });
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[100vw] md:min-w-[70vw] lg:min-w-[600px] p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="text-3xl font-bold truncate">Untitled Task</SheetTitle>
        </SheetHeader>
        <SheetDescription className="px-6">Create a new task</SheetDescription>
        <ScrollArea className="h-[calc(100vh-150px)] p-6">
          <TaskDetailsForm onSubmit={handleSubmit} />
        </ScrollArea>
        <div className="absolute bottom-6 right-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="submit"
            form="task-details-form"
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Confirm
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
