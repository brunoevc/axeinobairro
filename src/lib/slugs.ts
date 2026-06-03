/**
 * Generates a URL-friendly slug from a string.
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Split accents from letters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
};

/**
 * Validates if a slug contains only allowed characters.
 * Strictly enforced: a-z, 0-9, and -
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug || slug.trim() === "") return false;
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug);
};

/**
 * Checks if a slug is unique among merchants.
 */
export const isSlugUnique = (slug: string, merchantId: string, merchants: { id: string, slug?: string }[]): boolean => {
  if (!slug) return false;
  return !merchants.some(m => m.slug === slug && m.id !== merchantId);
};

