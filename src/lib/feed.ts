// RSS feed, served at /feed/ (the WordPress feed URL) and /rss.xml.
import rss from '@astrojs/rss';
import { getPosts, postUrl, excerpt, categoryName } from './blog';

export async function feed(context: { site: URL }) {
  const posts = await getPosts();
  return rss({
    title: 'RISCstar',
    description: 'Optimize Arm & RISC-V performance, power utilization & security',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      link: p.data.redirect ?? postUrl(p),
      pubDate: p.data.date,
      description: excerpt(p),
      author: p.data.author,
      categories: p.data.categories.map(categoryName),
    })),
  });
}
