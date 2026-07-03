import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isSameDay, isSameYear, parseISO } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Convert snake_case or lowercase to Title Case (e.g., "in_progress" => "In Progress")
export function capitalCase(str) {
  return str
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function formatTimestampHour(isoString) {
  return format(isoString, "HH:mm");
}

export function formatFullTimestamp(isoString) {
  const date = parseISO(isoString);
  const now = new Date();

  if (isSameDay(date, now)) {
    return format(date, "HH:mm");
  } else if (isSameYear(date, now)) {
    return format(date, "MMM d, HH:mm");
  } else {
    return format(date, "MMM d yyyy, HH:mm");
  }
}

export function formatShortTimestamp(isoString) {
  const date = parseISO(isoString);
  const now = new Date();

  if (isSameDay(date, now)) {
    return format(date, "HH:mm");
  } else if (isSameYear(date, now)) {
    return format(date, "MMM d");
  } else {
    return format(date, "MMM d, yyyy");
  }
}

export function formatDate(isoString) {
  return format(isoString, "MMM d, yyyy");
}

export function formatDateShort(isoString) {
  return format(isoString, "dd/MM/yyyy");
}

export function getLastWeekDates() {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0); // Reset time to start of day
    dates.push(date);
  }
  return dates;
}
