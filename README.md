# Atlas Auto Service Centre — website

Multi-page static site for Atlas Auto Service Centre (Thika Road, Exit 7 — opposite
Garden City Mall, Nairobi). Built from the original single-file `index.html`
(preserved in git history at commit `68dc750`) by:

1. **Separating the files** — inline CSS → `assets/css/01–13*.css`, inline JS →
   `assets/js/01–10*.js`, base64 images → `assets/images/*` (same cascade order,
   byte-identical concatenation verified at extraction).
2. **Developing internal pages** from the navigation structure — Services overview,
   one page per service bay (9), The Workshop, Why Atlas, Location and Contact —
   all sharing the same chrome, nav, footer and booking/map modals.
3. **Structuring for WordPress** — shared markup lives in `src/partials/`, content in
   `src/content/*.json`, and `docs/wordpress-migration.md` maps every piece to its
   future theme file / custom post type.

## Pages (built, at repo root)

| Page | File |
|---|---|
| Home | `index.html` |
| Services | `services.html` |
| Service bays | `service-mechanical-diagnostics.html`, `service-genuine-parts.html`, `service-fleet-management.html`, `service-recovery-towing.html`, `service-wheel-alignment.html`, `service-body-paint.html`, `service-detailing.html`, `service-tracking-governors.html`, `service-electrical-ac.html` |
| The Workshop | `workshop.html` |
| Why Atlas | `why-atlas.html` |
| About Us (team & careers) | `about.html` |
| Location | `location.html` |
| Contact | `contact.html` |

## Develop

```bash
node tools/build.js        # rebuild all pages from src/ (no dependencies)
python3 -m http.server     # serve and preview
```

Edit content in `src/` (partials, page bodies, `src/content/services.json`,
`src/site.json`), then re-run the build. The built HTML at the root is committed so the
site also works when opened straight from any static host.

See `docs/wordpress-migration.md` for the WordPress theme conversion plan.
