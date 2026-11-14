# Aymen Smida — Developer Portfolio

A fast, dependency-free personal portfolio for **Aymen Smida, Senior Full Stack Developer (Laravel)**.
Built with semantic HTML5, modern CSS and vanilla JavaScript. No framework, no bundler, no runtime
dependencies — it deploys directly to GitHub Pages.

The content is sourced from the CV in `documents/aymen-smida-cv.pdf`. All copy is centralised in
`data/*.json` and the markup carries `data-i18n` keys, so text can be translated without touching the
layout.

---

## Features

- **Three languages** — English (default), French and Arabic, with full RTL layout for Arabic.
- **Dark / light mode** — follows the system preference on first visit, then remembers the choice.
- **Responsive layout** — mobile-first, tested from 320 px to 1440 px with no horizontal overflow.
- **Project filtering** — filter the six featured projects by Laravel, Vue.js, PHP or MySQL.
- **Accessible** — skip link, semantic landmarks, visible focus styles, ARIA labels, keyboard menu,
  reduced-motion support.
- **Frontend-only contact form** — validates in the browser and opens the visitor's email client via
  `mailto:`. Nothing is sent to a server.
- **SEO ready** — meta description, canonical URL, Open Graph, Twitter cards, JSON-LD `Person`
  schema, `robots.txt` and `sitemap.xml`.
- **Lightweight** — system fonts, inline SVG icons, one responsive portrait, ~15 KB of JavaScript.

## Tech stack

| Area      | Choice                                                             |
| --------- | ------------------------------------------------------------------ |
| Markup    | Semantic HTML5, inline SVG sprite                                  |
| Styling   | CSS3, custom properties, Grid, Flexbox, logical properties for RTL  |
| Scripting | Vanilla JavaScript (ES6), no libraries                              |
| Content   | JSON (`data/en.json`, `data/fr.json`, `data/ar.json`)               |
| Hosting   | Any static host; GitHub Pages + GitHub Actions included             |

No npm, no build step, no framework.

---

## Project structure

```
.
├── index.html                  # Main page (all sections, English fallback content)
├── 404.html                    # Custom not-found page
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── .nojekyll                   # Disables Jekyll processing on GitHub Pages
├── .github/workflows/deploy.yml
├── assets/
│   ├── css/
│   │   ├── style.css           # Tokens, base styles, layout, components
│   │   ├── animations.css      # Entrance motion + reduced-motion overrides
│   │   └── responsive.css      # Breakpoints (1024 / 900 / 680 / 420)
│   ├── js/
│   │   ├── theme.js            # Theme init + toggle (loads in <head>, no flash)
│   │   ├── translations.js     # JSON loader, language switcher, RTL handling
│   │   ├── navigation.js       # Mobile menu, active section, scroll UI
│   │   ├── projects.js         # Project filters
│   │   └── main.js             # Contact form validation + bootstrap
│   └── images/
│       ├── aymen-smida-portrait.jpg      # Hero portrait, 1000 × 1040
│       ├── aymen-smida-portrait-sm.jpg   # Same portrait, 600 × 624 (srcset)
│       ├── aymen.png                     # Full-resolution source photo
│       ├── favicon.svg
│       ├── og.png                        # 1200 × 630 social card
│       ├── og.svg
│       └── apple-touch-icon.png
├── data/
│   ├── en.json
│   ├── fr.json
│   └── ar.json
└── documents/
    └── aymen-smida-cv.pdf      # Downloadable CV
```

---

## Local development

The site is fully static, but translations are fetched with `fetch()`, so it must be served over HTTP
(opening `index.html` directly from disk will keep the English markup but cannot load the JSON files).

From the project folder, run any static server, for example:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

Alternatives: `php -S localhost:8000`, VS Code Live Server, or any equivalent static server.

There is nothing to install and nothing to build.

---

## Deployment to GitHub Pages

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that publishes the
site on every push to `main`.

1. Push the project to a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the **Actions** tab).
5. The site is published at `https://<username>.github.io/<repository>/`.

The workflow copies the static files into `dist/` and uploads them as a Pages artifact. No build tools
are required.

> If the repository is **not** named `portfolio`, update the URLs in `index.html` (`canonical`,
> Open Graph, Twitter), `robots.txt`, `sitemap.xml` and the `og:image` / `twitter:image` paths.

---

## Customisation

### Personal information

| What                 | Where                                                       |
| -------------------- | ----------------------------------------------------------- |
| Name, email, phone   | `index.html` (header, hero, contact, footer)                 |
| Portrait photo       | `assets/images/aymen-smida-portrait*.jpg`                    |
| Social links         | `index.html` (hero, contact, footer)                         |
| CV file              | `documents/aymen-smida-cv.pdf`                               |
| SEO URLs / OG image  | `index.html` `<head>`, `robots.txt`, `sitemap.xml`           |
| Skills               | `index.html` → `#skills`                                     |
| Experience           | `index.html` → `#experience`                                 |
| Education / languages| `index.html` → `#education`                                  |
| Projects             | `index.html` → `#projects` + the three `data/*.json` files   |

The contact form's recipient address is set on the form element:

```html
<form class="form" data-contact-form data-email="you@example.com" novalidate>
```

### Update the CV

Replace `documents/aymen-smida-cv.pdf` with the new file, keeping the same filename. The hero and
header buttons link to it directly; no other change is needed.

### Add or edit a project

1. Copy one `<article class="project-card" …>` block inside `#projects`.
2. Update `data-tags` (used by the filters), `style="--cover-accent: …"`, the monogram and the tech
   chips.
3. Add `data-i18n` keys for the new project (for example `projects.myproject.name`) and add the
   matching entries to `data/en.json`, `data/fr.json` and `data/ar.json`.

To add a repository or live-demo link, add this inside `.project-body`:

```html
<div class="project-links">
  <a class="project-link" href="https://github.com/…" target="_blank" rel="noopener noreferrer">GitHub</a>
</div>
```

No links are published by default because the CV does not contain public repository or demo URLs.

### Add a language

1. Create `data/de.json` with the same key structure as `data/en.json`.
2. Add a button to the language switcher in `index.html`:
   `<button type="button" class="lang-btn" data-lang="de" lang="de" aria-pressed="false">DE</button>`.
3. Add `"de"` to the `SUPPORTED` array in `assets/js/translations.js`.

### SEO and sharing

Update the absolute production URL in these places if the domain changes:

- `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` in `index.html`
- `Sitemap:` line in `robots.txt`
- `<loc>` in `sitemap.xml`

`assets/images/og.png` is a 1200 × 630 social sharing card; replace it with your own if you prefer.

---

## Accessibility & performance notes

- All interactive elements are reachable by keyboard; the mobile menu closes on `Escape`.
- `prefers-reduced-motion` disables smooth scrolling and entrance animations.
- Colour pairs meet WCAG AA contrast in both themes.
- No web fonts are downloaded; the design uses the system UI and serif stacks, so there is no font
  layout shift or third-party request.
- The hero portrait is the only raster image on the page. It is served responsively through `srcset`
  (600 px / 1000 px) at ~37 KB / ~98 KB, with explicit `width` and `height` so it cannot shift the
  layout while loading. Everything else is inline SVG.
- JavaScript is split into small, single-purpose files and loaded with `defer`.

---

## Content source

All professional information comes from `documents/aymen-smida-cv.pdf`. No companies, dates,
certifications, projects or results have been invented. The CV lists no public project repositories or
live demos, so none are shown.

## License

© Aymen Smida. All rights reserved.