# WordPress migration plan — Atlas Auto Service Centre

This static build was produced specifically to be converted into a WordPress theme.
Everything below maps 1:1; nothing needs to be re-invented during the WP build.

## Repository layout

```
index.html, services.html, service-<slug>.html, workshop.html,
why-atlas.html, location.html, contact.html   ← built pages (what you see in the browser)
assets/css/01–13*.css    ← the original inline <style>, split in original cascade order
assets/css/14-pages.css  ← additive styles for the internal pages
assets/js/01–10*.js      ← the original inline <script>, split in original order
assets/js/11-page.js     ← additive internal-page behaviours
assets/images/           ← every image extracted from the original (base64 → files)
src/partials/            ← shared markup (chrome, nav, footer, modals) — the future theme PHP
src/templates/           ← head + page shell + service-single template
src/pages/               ← unique body content per page
src/site.json            ← site-wide constants (phone, email, address, hours, socials, embeds)
src/content/services.json← the 9 service bays + the 5-step process (future CPT content)
tools/build.js           ← dependency-free assembler (run: node tools/build.js)
```

The original monolith remains in git history (commit `68dc750`, file `index.html`);
`assets/css` + `assets/js` concatenated in numeric order are byte-identical to the
original inline `<style>`/`<script>` (verified at extraction time).

## Partial → WordPress theme file

| Static partial            | WordPress piece                                   |
|---------------------------|---------------------------------------------------|
| `src/templates/head.html` | `header.php` (`wp_head`, enqueue list below)      |
| `src/partials/top-chrome.html` | `header.php` fixed chrome                    |
| `src/partials/nav-overlay.html` | menu markup → register as `wp_nav_menu` ("Primary"), keep `servicesToggle` submenu as a custom walker or a small JS |
| `src/partials/bottom-bar.html` | `footer.php` top block (or `template-parts/bottom-bar.php`) |
| `src/partials/footer.html` | `footer.php` (`wp_footer`)                        |
| `src/partials/booking-modal.html` | `template-parts/booking-modal.php`         |
| `src/partials/map-modal.html` | `template-parts/map-modal.php`               |
| `src/partials/video-intro.html` | front-page only (`is_front_page()` in `front-page.php`) |
| `src/partials/cta-band.html` | `template-parts/cta-band.php` (ACF fields: title, text) |
| `src/templates/service-single.html` | `single-service.php` (CPT template)         |

## Pages → WordPress

| Static file                          | WP page / template                          | Menu |
|--------------------------------------|---------------------------------------------|------|
| `index.html`                         | Front page (`front-page.php`)               | —    |
| `services.html`                      | Page "Services" (`page-services.php` or blocks) | Primary |
| `service-<slug>.html` (×9)           | CPT **service** posts, template `single-service.php` | Submenu "Service Bays" (first 8, `inNav:true` in services.json) |
| `workshop.html`                      | Page "The Workshop"                         | Primary |
| `why-atlas.html`                     | Page "Why Atlas"                            | Primary |
| `location.html`                      | Page "Location"                             | Primary |
| `contact.html`                       | Page "Contact"                              | Primary |

Suggested slugs (mirroring WP pretty permalinks): `/services/`, `/services/<slug>/`,
`/workshop/`, `/why-atlas/`, `/location/`, `/contact/`.

## Custom post type: `service`

Register CPT `service` (public, hierarchical false, menu position under Pages).
Each entry in `src/content/services.json` → one post; map fields to ACF:

`num`, `tag`, `nav_title`, `bay_title`, `booking_value`, `card_class`, `image`,
`in_nav`, `excerpt` (post_excerpt), `intro` (field), `includes` (repeater, one text row),
`faq` (repeater: q + a).

`processSteps` in the same JSON → a single ACF options-page repeater ("How it works")
rendered by `single-service.php`.

The booking `<select>` values (`booking_value`) must be kept as the form option values so
`data-book-service` preselection (assets/js/11-page.js) keeps working with any form plugin.

## Asset enqueue order (functions.php)

Enqueue in numeric order — the cascade depends on it:

CSS: `01-base` … `13-intro-video` (original styles, unchanged) then `14-pages`.
JS (footer, in order): `01-navigation` … `10-intro-video` then `11-page`.
Fonts: the two Google Fonts links already in `head.html`.
`video-intro` markup + `10-intro-video.js` only on the front page.

## Booking form

The booking modal form fields (name, phone, email, vehicle, plate, service, date, type,
notes) should be rebuilt in the form plugin of choice (CF7 / WPForms / Gravity) keeping
the same field names; point submissions at the service desk email in `src/site.json`.
The contact page additionally has an inline copy of the form (`#contactBookingForm`) —
rebuild it once as a shortcode and reuse it in both places.

## Client QA flags carried over from the original (fix in WP)

1. `Careers` and `Community` footer links are `#` placeholders — pages don't exist yet.
2. All social links (Facebook/Instagram/X) point to the same Instagram URL in the original.
3. `hero-slide-1` doubles as the Mechanical bay background and `hero-slide-2` as Recovery —
   source unique bay photography when available.
4. `isuzu-badge-trusted.png` is a square Isuzu graphic used as a 160×28 wordmark —
   replace with a proper horizontal wordmark.
5. Verify: email `info@atlas-servicecentre.co.ke`, hours, recovery coverage area, and the
   "authorized since 2020" claim before launch.

## Rebuilding the static site

```
node tools/build.js        # regenerates all 15 pages from src/
python3 -m http.server     # preview
```
