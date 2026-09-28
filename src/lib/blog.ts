import { getCollection, type CollectionEntry } from 'astro:content';
import categories from '../data/categories.json';

export type Post = CollectionEntry<'blog'>;

export const BLOG_PER_PAGE = 9;
export const ARCHIVE_PER_PAGE = 10;

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postUrl = (p: Post) => `/blog/${p.id}/`;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = (n: number) => String(n).padStart(2, '0');
/** "July 15, 2025" */
export const fmtLong = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
/** "Aug 03, 2026" */
export const fmtShort = (d: Date) => `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${pad(d.getUTCDate())}, ${d.getUTCFullYear()}`;
export const dayKey = (d: Date) => `${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}`;
export const dayUrl = (d: Date) => `/blog/${dayKey(d)}/`;

export const allCategories: { slug: string; name: string }[] = categories;
export const categoryName = (slug: string) => allCategories.find((c) => c.slug === slug)?.name ?? slug;
export const categoryUrl = (slug: string) => `/blog/category/${slug}/`;

function plainText(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const words = (s: string, n: number) => {
  const w = s.split(/\s+/);
  return w.length > n ? w.slice(0, n).join(' ') : s;
};
/** Long excerpt used on category/date archives (WordPress default: 55 words). */
export const excerpt = (p: Post) => p.data.excerpt || words(plainText(p.body ?? ''), 55);
/** Short excerpt used in the (hidden) loop-card excerpt widget. */
export const shortExcerpt = (p: Post) => words(excerpt(p), 12) + '...';

export const categoryClasses = (p: Post) => p.data.categories.map((c) => `category-${c}`).join(' ');

/** Numbered pagination for WordPress-style URLs. */
export function pageHref(base: string, n: number, style: 'blog' | 'archive') {
  if (n === 1) return base;
  return style === 'blog' ? `${base}${n}/` : `${base}page/${n}/`;
}
