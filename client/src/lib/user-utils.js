/**
 * Extract initials: last word's first letter + first word's first letter
 * E.g. "Nguyễn Huy Hoàng" => "HN"
 */
function getInitials(fullName) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0];
  const last = parts[parts.length - 1];
  return (last.charAt(0) + first.charAt(0)).toUpperCase();
}

export { getInitials };
