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
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

/**
 * Validates if a slug contains only allowed characters.
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug);
};

/**
 * Checks if a slug is unique among merchants.
 */
export const isSlugUnique = (slug: string, merchantId: string, merchants: { id: string, slug?: string }[]): boolean => {
  if (!slug) return true;
  return !merchants.some(m => m.slug === slug && m.id !== merchantId);
};
