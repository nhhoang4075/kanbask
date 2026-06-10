"use client";

import { useState, useRef } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileUpload({ onFileUpload, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const allowedFileTypes = [
    "application/pdf", // PDF
    "image/jpeg", // JPEG
    "image/png", // PNG
    "image/gif", // GIF
    "application/msword", // DOC
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // DOCX
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setError("");

    if (files.length === 0) return;

    // Check file type
    const file = files[0];
    if (!allowedFileTypes.includes(file.type)) {
      setError("Only PDF, image, and Word documents are allowed");
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Create a file object with necessary information
    const fileObj = {
      id: `file-${Date.now()}`,
      name: file.name,
      type: getFileType(file.type),
      size: file.size,
      url: URL.createObjectURL(file), // Create a temporary URL
      uploadedAt: new Date().toISOString(),
      uploadedBy: {
        id: "user-1", // Assuming current user is John Doe
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    };

    onFileUpload(fileObj);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.includes("pdf")) return "pdf";
    if (mimeType.includes("image")) return "image";
    if (mimeType.includes("word")) return "word";
    return "other";
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 hover:bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={disabled ? undefined : handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          disabled={disabled}
        />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">Drag and drop a file here, or click to select a file</p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, Image, or Word document (max 10MB)
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
