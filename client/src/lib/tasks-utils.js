export const priorityColors = {
  low: "bg-green-100 text-green-800 hover:bg-green-100/80",
  medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
  high: "bg-red-100 text-red-800 hover:bg-red-100/80"
};

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
