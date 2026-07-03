"use client";

import AttachmentUploadArea from "@/components/task/attachments/attachment-upload-area";
import AttachmentList from "@/components/task/attachments/atttachment-list";
import { TaskAttachmentProvider } from "@/hooks/use-task-attachment";

export default function AttachmentsTab({ task }) {
  return (
    <TaskAttachmentProvider>
      <div className="py-2">
        <AttachmentUploadArea task={task} />
        <AttachmentList task={task} />
      </div>
    </TaskAttachmentProvider>
  );
}
