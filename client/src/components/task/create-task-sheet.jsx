"use client";

import TaskDetailsForm from "@/components/task/details/task-details-form";
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

export default function CreateTaskSheet({ isOpen, onOpenChange, initialValues }) {
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
        <div className="py-6">
          <TaskDetailsForm onSubmit={handleSubmit} initialValues={initialValues} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
