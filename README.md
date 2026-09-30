# Azul Marine Group website

A complete, static, fully coded website for **Azul Marine Group** (The Azul Marine Group Inc.), a Discovery Bay, California 501(c)(3) nonprofit of marine professionals who support agencies during maritime emergencies, deliver marine training, and do stewardship work on the Sacramento, San Joaquin, and Mokelumne Rivers.

No framework, no build dependencies on the server. Upload the folder and it works.

## What is in this folder

| Path | Purpose |
| --- | --- |
| `index.html`, `about.html`, `programs.html`, `media.html`, `get-involved.html`, `news.html`, `contact.html`, `404.html` | The finished, deployable pages |
| `assets/css/styles.css` | The single stylesheet (public-safety design system) |
| `assets/js/main.js` | Logo entrance, hero background video, scroll reveal, sticky header, mobile navigation, forms |
| `assets/video/` | Drop `hero.mp4` (and optionally `hero.webm`) here for the home page background video; see the README inside |
| `assets/js/media-data.js` | The video and photo library (edit this to add media) |
| `assets/js/media.js` | Renders the media gallery and lightbox |
| `assets/brand/` | Vector logo (`logo.svg`, `logo-white.svg`), transparent PNGs, favicons |
| `assets/img/` | The organization's photographs, optimized (JPEG + WebP), and the social share image |
| `src/` | Page templates, shared partials, and the build script |
| `research/` | Research notes with sources (`sources.md`) and the original files downloaded from Facebook |
| `sitemap.xml`, `robots.txt` | Search engine files |

## Preview locally

From this folder:

```bash
npx --yes serve .
```

Or from the repository root, the `azul-marine-group` entry in `.claude/launch.json` serves it on port 5290.

## Editing pages

The pages in the site root are generated from `src/pages/*.html`, which are wrapped in the shared header and footer from `src/partials/`. To change content:

1. Edit the page in `src/pages/` (or a partial in `src/partials/` for the header, footer, or global contact details).
2. Run `node src/build.mjs` from this folder.
3. Upload the regenerated files.

Global details (phone, email, addresses, EIN, entity number, Facebook URL, site URL) live at the top of `src/build.mjs` and are inserted into every page.

## Adding videos and photos

Open `assets/js/media-data.js`.

- **Video:** add an object to `videos` with `type` set to `"youtube"`, `"vimeo"`, or `"file"` and `src` set to the video ID, URL, or local `.mp4` path. Add a `poster` image path for local files. Leave `type` empty to show a "Video Coming Soon" card.
- **Photo:** put the file in `assets/img/` and add an object to `photos` with `src`, optional `webp`, `alt`, and `caption`.

The gallery on `media.html` and the lightbox pick the changes up automatically. No rebuild is needed for media changes.

## Forms

The forms on `contact.html` and `get-involved.html` work in two modes:

- **Out of the box** they open the visitor's email app with the message addressed to `info@azulmarinegroup.com`.
- **With a free [Web3Forms](https://web3forms.com) access key** they send directly to the inbox. Create a key for `info@azulmarinegroup.com`, paste it into the `data-access-key=""` attribute on each `<form>` in `src/pages/contact.html` and `src/pages/get-involved.html`, and rebuild.

## The logo

`assets/brand/logo.svg` was traced from the logo the organization published on Facebook (720 px). It is the same mark, not a redesign. The header uses it in navy, the footer and intro in white. Do not redraw or recolor the identity.

## Logo entrance

On the first visit in a browser session, the home page shows a short (about two seconds) entrance: the logo draws in as a line, fills, the name appears, then the overlay fades and the logo settles into the header. It is skipped for repeat visits in the same session, for anyone with "reduce motion" set on their device, and on a click or key press.

## What still needs real information before launch

Everything below is shown as a clearly labeled placeholder in the site. Nothing has been invented.

| Item | Where | What to do |
| --- | --- | --- |
| Leadership (board, officers) | `about.html` | Provide names, titles, short bios |
| Partner agencies and organizations | `get-involved.html` | Provide the list the organization is authorized to publish |
| Online donation button | `get-involved.html` | Set up a processor (PayPal Giving Fund, Zeffy, Givebutter, etc.) and add the link |
| Events | `get-involved.html`, `news.html` | Add as scheduled |
| Videos | `assets/js/media-data.js` | Provide files or YouTube/Vimeo links |
| Program photos for Stewardship and Advisory | `index.html`, `programs.html` | Provide photos of water testing, levee inspection, vessel support |
| Office hours | `contact.html` | Confirm and add |
| Web3Forms access key | forms | Create and paste in |
| Site URL | `src/build.mjs` | Confirm `https://www.azulmarinegroup.com` is the domain that will be used; the domain was not resolving at build time |

Also confirm before launch: that the organization is registered with the California Attorney General's Registry of Charitable Trusts (required to solicit donations in California), and that it holds rights to the helicopter photograph.

## Verified facts used on the site

See `research/sources.md` for the full list with sources. In brief: the organization's name, legal name, EIN, 501(c)(3) public charity status and April 2026 ruling date, California entity number and type, Discovery Bay address, phone, email, Stockton registered address, mission text, member disciplines, and the waterways named in the mission all come from the organization's Facebook page, the IRS Business Master File, and the California Secretary of State record.
