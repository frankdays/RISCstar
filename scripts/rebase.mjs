// Prefix root-relative URLs in dist/ with BASE_PATH (e.g. "/RISCstar") so the site works
// at a GitHub Pages project URL. No-op when BASE_PATH is empty (custom domain).
import fs from 'node:fs';
import path from 'node:path';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
if (!base) { console.log('rebase: no BASE_PATH, nothing to do'); process.exit(0); }

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(html|css)$/.test(p)) files.push(p);
  }
})('dist');

// "/x" but not "//x" and not already prefixed
const root = `/(?!/|${base.slice(1)}/)`;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  if (f.endsWith('.html')) {
    s = s.replace(new RegExp(`((?:href|src|action|poster|data-src)=["'])${root}`, 'g'), `$1${base}/`);
    s = s.replace(/(srcset=["'])([^"']+)/g, (m, a, v) => a + v.replace(new RegExp(`(^|,\\s*)${root}`, 'g'), `$1${base}/`));
    s = s.replace(new RegExp(`(http-equiv="refresh" content="0; url=)${root}`, 'g'), `$1${base}/`);
    s = s.replace('<html lang="en-US"', `<html lang="en-US" data-base="${base}"`);
  }
  s = s.replace(new RegExp(`url\\((["']?)${root}`, 'g'), `url($1${base}/`);
  if (s !== before) fs.writeFileSync(f, s);
}
console.log(`rebase: prefixed ${files.length} files with ${base}`);
