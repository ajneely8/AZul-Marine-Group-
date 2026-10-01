/**
 * Static site build for Azul Marine Group.
 *
 * Every page in src/pages/ is a plain HTML fragment with a small JSON
 * front matter block at the top. The build wraps each fragment in the
 * shared document shell (head, government-style header, footer) and
 * writes the finished page to the site root. Run it with:
 *
 *   node src/build.mjs
 *
 * No bundler, no framework, no dependencies.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const partial = (name) => readFileSync(join(here, 'partials', name), 'utf8');

/* ------------------------------------------------------------------
   Organization details. Every value here was taken from a public
   source (see research/sources.md). Placeholders are marked as such.
   ------------------------------------------------------------------ */
const site = {
  name: 'Azul Marine Group',
  legalName: 'The Azul Marine Group Inc.',
  shortName: 'AMG',
  url: 'https://www.azulmarinegroup.com',
  phone: '(925) 337-2294',
  phoneHref: 'tel:+19253372294',
  email: 'info@azulmarinegroup.com',
  address1: '4971 Cabrillo Point',
  address2: 'Discovery Bay, CA 94505',
  mailing1: '401 N. San Jose Street',
  mailing2: 'Stockton, CA 95203',
  ein: '33-1710533',
  caEntity: '6441651',
  facebook: 'https://www.facebook.com/profile.php?id=61573883656021',
  gofundme: 'https://www.gofundme.com/f/support-seawolfs-return-to-protect-our-waters',
  yachtsman: 'https://www.recreationpublications.com/PUB/BDYOct26/index.html',
  year: String(new Date().getFullYear()),
};

const nav = [
  ['index.html', 'Home'],
  ['about.html', 'About'],
  ['programs.html', 'Programs'],
  ['media.html', 'Media'],
  ['news.html', 'News'],
  ['donate.html', 'Donate'],
  ['contact.html', 'Contact'],
];

const logoPath = readFileSync(join(root, 'assets/brand/logo-path.txt'), 'utf8').trim();
const logoSymbol = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><symbol id="amg-logo" viewBox="0 0 720 722"><path fill-rule="evenodd" d="${logoPath}"/></symbol></svg>`;
const logoSvg = (cls, label) =>
  `<svg class="${cls}" viewBox="0 0 720 722" role="img" aria-label="${label}" focusable="false" fill="currentColor"><use href="#amg-logo"/></svg>`;

const buildId = Date.now().toString(36);
const shell = partial('shell.html');
const header = partial('header.html');
const footer = partial('footer.html');

function render(template, vars) {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) => {
    const value = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), vars);
    return value == null ? '' : String(value);
  });
}

function navHtml(active) {
  return nav
    .map(([href, label]) => {
      const current = href === active ? ' aria-current="page"' : '';
      return `<li><a href="${href}"${current}>${label}</a></li>`;
    })
    .join('\n        ');
}

const pagesDir = join(here, 'pages');
const files = readdirSync(pagesDir).filter((f) => f.endsWith('.html'));
const built = [];

for (const file of files) {
  const raw = readFileSync(join(pagesDir, file), 'utf8');
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) throw new Error(`Missing front matter in ${file}`);
  const meta = JSON.parse(match[1]);
  const body = raw.slice(match[0].length);
  const out = meta.output || file;

  const vars = {
    site,
    meta,
    logoHeader: logoSvg('brand__mark', 'Azul Marine Group'),
    logoFooter: logoSvg('footer-brand__mark', 'Azul Marine Group'),
    logoSymbol,
    buildId,
    navItems: navHtml(out),
    bodyClass: meta.bodyClass || '',
    canonical: `${site.url}/${out === 'index.html' ? '' : out}`,
    ogImage: `${site.url}/assets/img/og-image.jpg`,
    jsonld: partial('jsonld.html'),
    extraScripts: meta.scripts ? meta.scripts.map((s) => `<script src="${s}?v=${buildId}" defer></script>`).join('\n  ') : '',
  };

  let html = render(shell, {
    ...vars,
    header: render(header, vars),
    footer: render(footer, vars),
    body: render(body, vars),
  });
  html = render(html, vars);
  writeFileSync(join(root, out), html);
  built.push(out);
}

/* sitemap + robots */
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${built
  .filter((p) => p !== '404.html')
  .map((p) => `  <url><loc>${site.url}/${p === 'index.html' ? '' : p}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')}
</urlset>
`;
writeFileSync(join(root, 'sitemap.xml'), sitemap);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${built.length} pages: ${built.join(', ')}`);
