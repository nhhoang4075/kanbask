/**
 * Extract initials: last word's first letter + first word's first letter
 * E.g. "Nguyen Huy Hoang" => "HN"
 */
export function getInitials(fullName) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  const first = parts[0];
  const last = parts[parts.length - 1];
  return (last.charAt(0) + first.charAt(0)).toUpperCase();
}

const AVATAR_COLORS = [
  { background: "linear-gradient(135deg, #FF37BC 0%, #FF4B2B 100%)", color: "#FFF5F8" },
  { background: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)", color: "#003E4F" },
  { background: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)", color: "#F3EFFF" },
  { background: "linear-gradient(135deg, #E7770E 0%, #FFD200 100%)", color: "#3E2E00" },
  { background: "linear-gradient(135deg, #43B69C 0%, #A8FFAE 100%)", color: "#033426" },
  { background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)", color: "#3F0000" },
  { background: "linear-gradient(135deg, #1193B0 0%, #5DF5FD 100%)", color: "#0B2737" }
];

export function pickAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];

  const char = name.trim().charAt(0).toUpperCase();
  const code = char.charCodeAt(0);
  const A = 65,
    Z = 90;
  let idx =
    code < A || code > Z ? 0 : Math.floor(((code - A) / (Z - A + 1)) * AVATAR_COLORS.length);

  return AVATAR_COLORS[idx];
}
