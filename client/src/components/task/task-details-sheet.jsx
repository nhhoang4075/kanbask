"use client";

import { FileText, Paperclip, MessageSquare } from "lucide-react";

import TaskDetailsForm from "@/components/task/task-details-form";
import TaskAttachmentTab from "@/components/task/task-attachment-tab";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTask } from "@/hooks/use-task";

export default function TaskDetailsSheet({ isOpen, onOpenChange, task }) {
  const { handleUpdateTask } = useTask();

  const attachmentCount = task.attachments?.length || 0;
  const commentCount = task.comments?.length || 0;

  const handleUpdateTaskDetailsSubmit = async (formData) => {
    await handleUpdateTask(task.id, {
      ...formData,
      status: formData.status || null,
      priority: formData.priority || null,
      due_date: formData.due_date || null,
      completed_at: formData.completed_at || null
    });

    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="min-w-[100vw] md:min-w-[70vw] lg:min-w-[600px] p-0"
        onInteractOutside={(e) => {
          // Prevent the event from propagating to avoid focus issues
          // Don't close on outside click
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-3xl font-bold truncate">{task.title}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="bg-transparent gap-4 px-6">
            <TabsTrigger
              value="details"
              className="flex items-center gap-2 rounded-none border-b-3 border-transparent data-[state=active]:border-prussian-blue data-[state=active]:shadow-none data-[state=active]:ring-0"
            >
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="attachments"
              className="flex items-center gap-2 rounded-none border-b-3 border-transparent data-[state=active]:border-prussian-blue data-[state=active]:shadow-none data-[state=active]:ring-0"
            >
              <Paperclip className="h-4 w-4" />
              {`Attachments ${attachmentCount > 0 ? `(${attachmentCount})` : ""}`}
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="flex items-center gap-2 rounded-none border-b-3 border-transparent data-[state=active]:border-prussian-blue data-[state=active]:shadow-none data-[state=active]:ring-0"
            >
              <MessageSquare className="h-4 w-4" />
              {`Comments ${commentCount > 0 ? `(${commentCount})` : ""}`}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <TabsContent value="details" className="px-6">
              <TaskDetailsForm onSubmit={handleUpdateTaskDetailsSubmit} task={task} />
            </TabsContent>
            <TabsContent value="attachments" className="px-6">
              <TaskAttachmentTab task={task} />
            </TabsContent>
            <TabsContent value="comments" className="px-6">
              {/* <TaskDetailsComments
              onAddComment={handleAddComment}
              onClose={() => onOpenChange(false)}
            /> */}
              <div className="space-y-4">Comments</div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        <div className="absolute bottom-6 right-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="submit"
            form="task-details-form"
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
