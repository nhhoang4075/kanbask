import AttachmentUploadArea from "@/components/task/file-attachment/attachment-upload-area";
import AttachmentList from "@/components/task/file-attachment/atttachment-list";

export default function TaskAttachmentTab({ task }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <AttachmentUploadArea task={task} />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">
          {task.attachments.length} {task.attachments.length > 1 ? "attachment" : "attachments"}
        </h4>
        <AttachmentList task={task} readOnly={false} />
      </div>
    </div>
  );
}
