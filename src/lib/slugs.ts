/**
 * Reserved slugs that cannot be used by merchants
 */
export const RESERVED_SLUGS = [
  'admin',
  'api',
  'loja',
  'noticias',
  'checkout',
  'agenda',
  'campanhas',
  'login',
  'register',
  'dashboard',
  'perfil',
  'ofertas',
];

/**
 * Normalizes a string into a URL-friendly slug.
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

export const normalizeSlug = generateSlug;

/**
 * Validates if a slug is robust and allowed.
 * Rules:
 * - Not empty
 * - Not reserved
 * - Only lowercase a-z, 0-9, and hyphen
 * - No double hyphens
 * - No hyphens at start or end
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug || slug.trim() === "") return false;
  
  // Block reserved slugs
  if (RESERVED_SLUGS.includes(slug.toLowerCase())) return false;
  
  // Only lowercase, numbers, and single hyphens
  // No hyphens at start or end
  // Regex ensures it starts and ends with alphanumeric, with optional hyphens in between
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Checks if a slug is unique among merchants.
 */
export const isSlugUnique = (slug: string, merchantId: string, merchants: { id: string, slug?: string }[]): boolean => {
  if (!slug) return false;
  return !merchants.some(m => m.slug === slug && m.id !== merchantId);
};

/**
 * Helper to get the public path for a merchant.
 * Prioritizes slug-based professional URLs.
 */
export const getMerchantPublicPath = (merchant: { id: string, slug?: string }): string => {
  if (merchant.slug && isValidSlug(merchant.slug)) {
    return `/loja/${merchant.slug}`;
  }
  return `/negocios/${merchant.id}`;
};


