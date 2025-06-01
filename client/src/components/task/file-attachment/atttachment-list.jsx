"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText, ImageIcon, FileIcon as FileWord, Download, Eye, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTask } from "@/hooks/use-task";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";

export default function AttachmentList({ task, readOnly = false }) {
  const { handleDeleteTaskAttachments } = useTask();
  const [previewFile, setPreviewFile] = useState(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case "word":
        return <FileWord className="h-5 w-5 text-blue-700" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const renderPreview = () => {
    if (!previewFile) return null;

    let content;
    switch (previewFile.mime_type) {
      case "image":
        content = (
          <div className="flex items-center justify-center h-full">
            <img
              src={previewFile.url || "/placeholder.svg"}
              alt={previewFile.original_name}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        );
        break;
      case "pdf":
        content = (
          <div className="flex flex-col items-center justify-center h-full">
            <FileText className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-lg font-medium mb-2">{previewFile.original_name}</p>
            <p className="text-sm text-muted-foreground mb-4">
              PDF files can't be previewed directly
            </p>
            <Button asChild>
              <a
                href={previewFile.url}
                download={previewFile.original_name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </div>
        );
        break;
      case "word":
        content = (
          <div className="flex flex-col items-center justify-center h-full">
            <FileWord className="h-16 w-16 text-blue-700 mb-4" />
            <p className="text-lg font-medium mb-2">{previewFile.original_name}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Word documents can't be previewed directly
            </p>
            <Button asChild>
              <a
                href={previewFile.url}
                download={previewFile.original_name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Document
              </a>
            </Button>
          </div>
        );
        break;
      default:
        content = (
          <div className="flex flex-col items-center justify-center h-full">
            <FileText className="h-16 w-16 text-gray-500 mb-4" />
            <p className="text-lg font-medium mb-2">{previewFile.original_name}</p>
            <p className="text-sm text-muted-foreground mb-4">This file type can't be previewed</p>
            <Button asChild>
              <a
                href={previewFile.url}
                download={previewFile.original_name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download File
              </a>
            </Button>
          </div>
        );
    }

    return (
      <Dialog open={!!previewFile} onOpenChange={handleClosePreview}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>File Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{content}</div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-2">
      {task.attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon(attachment.mime_type)}
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
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={attachment.attacher_avatar_url}
                  alt={attachment.attacher_full_name}
                />
                <AvatarFallback
                  className="text-[8px]"
                  style={pickAvatarColor(attachment.attacher_full_name)}
                >
                  {getInitials(attachment.attacher_full_name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePreview(attachment)}
              title="Preview"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Preview</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Download">
              <a
                href={attachment.url}
                download={attachment.original_name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </a>
            </Button>
            {!readOnly && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleDeleteTaskAttachments(task.id, [attachment.id])}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
      ))}
      {renderPreview()}
    </div>
  );
}
