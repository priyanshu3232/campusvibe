// CampusVibe — Time formatting utilities

/**
 * Returns a human-readable relative time string for a given ISO timestamp.
 * Examples: "just now", "2m ago", "1h ago", "5h ago", "1d ago", "3d ago", "1w ago"
 *
 * @param {string} isoString - An ISO 8601 date string
 * @returns {string} Relative time description
 */
export function formatTime(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'just now';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

/**
 * Formats an ISO date string into a readable date like "Apr 9, 2026".
 *
 * @param {string} isoString - An ISO 8601 date string
 * @returns {string} Formatted date string
 */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
