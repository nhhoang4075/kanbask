import { format } from "date-fns";
import {
  File,
  FileImage,
  FileText,
  FileSpreadsheet,
  FileSliders,
  FileSearch2,
  Archive
} from "lucide-react";

import { formatDateShort, capitalCase } from "@/lib/utils";

export function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

export const formatDateTime = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return format(date, "PPP p");
};

export function comparePriority(a, b) {
  const priorityOrder = { low: 1, medium: 2, high: 3 };
  return priorityOrder[a] - priorityOrder[b];
}

const priorityColors = {
  low: "bg-green-100 text-green-700 border-green-700",
  medium: "bg-amber-100 text-amber-700 border-amber-700",
  high: "bg-red-100 text-red-700 border-red-700"
};

export function pickPriorityColor(priority) {
  return priorityColors[priority];
}

const statusColors = {
  todo: "bg-yellow-500 text-white border-yellow-500",
  in_progress: "bg-blue-500 text-white border-blue-500",
  review: "bg-indigo-500 text-white border-indigo-500",
  done: "bg-green-500 text-white border-green-500",
  canceled: "bg-rose-500 text-white border-rose-500"
};

export function pickStatusColor(status) {
  return statusColors[status];
}

export const allowedFileTypes = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "image/webp", // WEBP
  "image/gif", // GIF
  "application/pdf", // PDF
  "application/msword", // DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.ms-excel", // XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  "application/vnd.ms-powerpoint", // PPT
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  "application/x-7z-compressed", // 7Z
  "application/zip", // ZIP
  "application/rar" // RAR
];

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function pickFileIcon(type) {
  if (type.startsWith("image/")) {
    return <FileImage className="h-5 w-5 text-emerald-500" />;
  }

  if (type === "application/pdf") {
    return <FileSearch2 className="h-5 w-5 text-red-500" />;
  }

  if (
    type === "application/msword" ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return <FileText className="h-5 w-5 text-blue-700" />;
  }

  if (
    type === "application/vnd.ms-excel" ||
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return <FileSpreadsheet className="h-5 w-5 text-green-700" />;
  }

  if (
    type === "application/vnd.ms-powerpoint" ||
    type === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return <FileSliders className="h-5 w-5 text-orange-500" />;
  }

  if (
    type === "application/x-7z-compressed" ||
    type === "application/zip" ||
    type === "application/rar"
  ) {
    return <Archive className="h-5 w-5 text-purple-600" />;
  }

  return <File className="h-5 w-5 text-gray-500" />;
}

export function getActivityDescription(action, details) {
  switch (action) {
    case "create":
      return <span>created this task</span>;
    case "change_title":
      return (
        <span>
          changed title from <span className="font-semibold">{details.old || "NULL"}</span> to{" "}
          <span className="font-semibold">{details.new || "NULL"}</span>
        </span>
      );
    case "change_status":
      return (
        <span>
          changed status from{" "}
          <span className="font-semibold">{capitalCase(details.old || "NULL")}</span> to{" "}
          <span className="font-semibold">{capitalCase(details.new || "NULL")}</span>
        </span>
      );
    case "change_due_date":
      return (
        <span>
          changed due date from{" "}
          <span className="font-semibold">
            {details.old ? formatDateShort(details.old) : "NULL"}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {details.new ? formatDateShort(details.new) : "NULL"}
          </span>
        </span>
      );
    case "attach":
      return <span>attached files to this task</span>;
    case "comment":
      return <span>commented on this task</span>;
    case "delete":
      return (
        <span>
          deleted task <span className="font-semibold">{details.deleted_task_title || "NULL"}</span>
        </span>
      );
    default:
      return action;
  }
}
