/**
 * Normalizes string input:
 * - Converts empty or whitespace-only strings to null
 * - Trims non-empty strings
 * - Returns null for undefined or invalid values
 */
export const normalize = (value) =>
  typeof value === "string" && value.trim() === ""
    ? null
    : value?.trim?.() ?? null;

/**
 * Creates a URL-friendly slug from a string
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 */
export const normalizeSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Remove consecutive hyphens
};
