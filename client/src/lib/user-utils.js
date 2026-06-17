/**
 * Extract initials: last word's first letter + first word's first letter
 * E.g. "Nguyen Huy Hoang" => "HN"
 */
function getInitials(fullName) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0];
  const last = parts[parts.length - 1];
  return (last.charAt(0) + first.charAt(0)).toUpperCase();
}

const AVATAR_COLORS = [
  { background: "linear-gradient(135deg, #FF37bC 0%, #FF4B2B 100%)", color: "#FFF5F8" },
  { background: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)", color: "#003E4F" },
  { background: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)", color: "#F3EFFF" },
  { background: "linear-gradient(135deg, #E7770E 0%, #FFD200 100%)", color: "#3E2E00" },
  { background: "linear-gradient(135deg, #43B69C 0%, #A8FFAE 100%)", color: "#033426" },
  { background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)", color: "#3F0000" },
  { background: "linear-gradient(135deg, #1193B0 0%, #5DF5FD 100%)", color: "#0B2737" }
];

function pickAvatarColor(name) {
  const char = name.trim().charAt(0).toUpperCase();
  const code = char.charCodeAt(0);
  const A = 65,
    Z = 90;
  let idx =
    code < A || code > Z ? 0 : Math.floor(((code - A) / (Z - A + 1)) * AVATAR_COLORS.length);

  return AVATAR_COLORS[idx];
}

const COLOR_BUCKETS = [
  "bg-red-200 text-red-800",
  "bg-orange-200 text-orange-800",
  "bg-amber-200 text-amber-800",
  "bg-yellow-200 text-yellow-800",
  "bg-lime-200 text-lime-800",
  "bg-green-200 text-green-800",
  "bg-emerald-200 text-emerald-800",
  "bg-teal-200 text-teal-800",
  "bg-blue-200 text-blue-800",
  "bg-indigo-200 text-indigo-800"
];

// Lấy bucket index từ chữ cái
function getColorBucket(char) {
  const A = "A".charCodeAt(0);
  const Z = "Z".charCodeAt(0);
  const idx = char.charCodeAt(0);
  if (idx < A || idx > Z) return 0;
  // Chia đều 26 chữ cái cho 10 nhóm
  const bucketSize = (Z - A + 1) / COLOR_BUCKETS.length; // = 2.6
  return Math.floor((idx - A) / bucketSize);
}

export function getFallbackClasses(name) {
  const char = name.trim().charAt(0).toUpperCase();
  const bucket = getColorBucket(char);
  return COLOR_BUCKETS[bucket] || COLOR_BUCKETS[0];
}

export { getInitials, pickAvatarColor };
