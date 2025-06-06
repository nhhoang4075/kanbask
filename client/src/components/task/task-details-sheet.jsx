"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { FileText, Paperclip, MessageSquare, History } from "lucide-react";

import DetailsTab from "@/components/task/details/details-tab";
import AttachmentsTab from "@/components/task/attachments/attachments-tab";
import CommentsTab from "@/components/task/comments/comments-tab";
import HistoryTab from "@/components/task/history/history-tab";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TaskDetailsSheet({ task }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const taskIdQuery = searchParams.get("task");
  const isOpen = taskIdQuery === String(task.id);

  const onOpenChange = useCallback(
    (open) => {
      const params = new URLSearchParams(searchParams);

      if (!open) {
        params.delete("task");
      } else {
        params.set("task", String(task.id));
      }

      const queryString = params.toString();
      const newUrl = queryString ? `?${queryString}` : pathname;

      router.replace(newUrl);
    },
    [router, searchParams, task.id]
  );

  const attachmentCount = task.attachment_count || 0;
  const commentCount = task.comment_count || 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <SheetContent className="min-w-[100vw] md:min-w-[70vw] lg:min-w-[600px] p-0">
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
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 rounded-none border-b-3 border-transparent data-[state=active]:border-prussian-blue data-[state=active]:shadow-none data-[state=active]:ring-0"
            >
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <DetailsTab task={task} onOpenChange={onOpenChange} />
          </TabsContent>
          <TabsContent value="attachments">
            <AttachmentsTab task={task} />
          </TabsContent>
          <TabsContent value="comments">
            <CommentsTab task={task} />
          </TabsContent>
          <TabsContent value="history">
            <HistoryTab task={task} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
