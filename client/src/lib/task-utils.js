import { format } from "date-fns";

export const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
};

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
