"use client";

import { useState, useRef } from "react";
import { Upload, AlertCircle } from "lucide-react";

import { useTaskAttachment } from "@/hooks/use-task-attachment";
import { Input } from "@/components/ui/input";
import { allowedFileTypes } from "@/lib/task-utils";
import { cn } from "@/lib/utils";

export default function AttachmentUploadArea({ task }) {
  const { handleUploadAttachments } = useTaskAttachment();

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    await handleFiles(e.dataTransfer.files);
  };

  const handleFiles = async (files) => {
    setIsUploading(true);
    setError(null);

    if (files.length === 0) {
      setIsUploading(false);
      return;
    }

    if (files.length > 5) {
      setError("You can only upload up to 5 files at a time");
      setIsUploading(false);
      return;
    }

    const fileArray = Array.from(files);

    if (fileArray.some((file) => !allowedFileTypes.includes(file.type))) {
      setError("Include invalid file types");
      setIsUploading(false);
      return;
    }

    const validFiles = fileArray.filter((file) => {
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    await handleUploadAttachments(task.id, validFiles);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsUploading(false);
  };

  return (
    <div className="relative w-full pb-6 px-6">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ease-in-out hover:border-prussian-blue/50 hover:bg-prussian-blue/5",
          isDragging ? "border-prussian-blue bg-prussian-blue/5" : "border-muted-foreground/20",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFileTypes.join(",")}
          disabled={isUploading}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onChange={async (e) => {
            await handleFiles(e.target.files);
          }}
          className="absolute w-full h-full opacity-0 cursor-pointer disabled:opacity-0"
        />
        <div className="p-6">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">
            Drag and drop a file here, or click to select a file
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, Image, or Word document (max 50MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-0 left-6 right-0 flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
