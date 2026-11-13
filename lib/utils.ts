import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price as Turkish Lira */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(price);
}

/** Format large numbers with dots (Turkish convention) */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(n);
}

/** Calculate discount percentage */
export function discountPercent(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}

/** Truncate text to given length */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

/** Convert slug to display label */
export function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Format ISO date string into DD.MM.YYYY */
export function formatDate(isoStr: string): string {
  if (!isoStr) return '';
  const datePart = isoStr.split('T')[0];
  const [year, month, day] = datePart.split('-');
  return `${day}.${month}.${year}`;
}

/** Normalize Turkish characters for forgiving search */
export function normalizeSearchText(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

/** Multi-token, Turkish-insensitive product search */
export function matchesProductSearch(
  product: {
    name: string;
    brand: string;
    category: string;
    description: string;
    features: string[];
    tags: string[];
  },
  query: string
): boolean {
  const clean = normalizeSearchText(query).trim();
  if (!clean) return true;

  const tokens = clean.split(/\s+/).filter(Boolean);
  const haystack = normalizeSearchText(
    [
      product.name,
      product.brand,
      product.category,
      product.description,
      ...product.features,
      ...product.tags,
    ].join(' ')
  );

  return tokens.every((token) => haystack.includes(token));
}

