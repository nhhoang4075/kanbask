export const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
};
