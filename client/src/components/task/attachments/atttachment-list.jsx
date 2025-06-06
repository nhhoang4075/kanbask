"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Eye, Trash2 } from "lucide-react";

import DeleteAttachmentAlert from "@/components/task/attachments/delete-attachment-alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTaskAttachment } from "@/hooks/use-task-attachment";
import { formatFileSize, pickFileIcon } from "@/lib/task-utils";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";

export default function AttachmentList({ task }) {
  const { attachments, fetchAttachments } = useTaskAttachment();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  useEffect(() => {
    fetchAttachments(task.id);
  }, [task.id]);

  const attachmentCount = attachments.length || 0;

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2 px-6">
        {`${attachmentCount} ${attachmentCount <= 1 ? "attachment" : "attachments"}`}
      </h3>
      <ScrollArea className="max-h-[calc(100vh-350px)] overflow-y-auto px-6">
        <ul className="space-y-2">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {pickFileIcon(attachment.mime_type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.original_name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(attachment.size_bytes)}</span>
                    <span>•</span>
                    <span>
                      Uploaded{" "}
                      {formatDistanceToNow(new Date(attachment.attached_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <div className="flex items-center mr-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={attachment.attacher_avatar_url}
                            alt={attachment.attacher_full_name}
                            className="object-cover"
                          />
                          <AvatarFallback
                            className="text-[8px]"
                            style={pickAvatarColor(attachment.attacher_full_name)}
                          >
                            {getInitials(attachment.attacher_full_name)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        align="center"
                        className="bg-prussian-blue text-white"
                      >
                        <p>{attachment.attacher_full_name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Link href={attachment.url} target="_blank">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Preview</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => {
                    setSelectedAttachment(attachment);
                    console.log("attachment", attachment);
                    setIsDeleteAlertOpen(true);
                  }}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <DeleteAttachmentAlert
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        attachment={selectedAttachment}
      />
    </div>
  );
}
