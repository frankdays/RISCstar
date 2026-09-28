import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://riscstar.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Keep the WordPress/Elementor markup readable in the output.
  compressHTML: false,
  // Redirects that WordPress handled (GitHub Pages gets a small redirect page for each).
  redirects: {
    '/talk-with-our-experts/': '/contact-us/',
  },
  integrations: [sitemap({ filter: (page) => !/\/(404|blog\/author\/|talk-with-our-experts|blog\/guide-to-power-management-on-arm-risc-v)/.test(page) })],
});
