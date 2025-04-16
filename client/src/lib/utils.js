import { clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

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
