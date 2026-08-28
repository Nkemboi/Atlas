#!/usr/bin/env node
/* Atlas static-site builder.
 * Assembles every page from src/partials + src/templates + src/pages + src/content.
 * No dependencies. Output: flat HTML files at the repo root (index.html, services.html,
 * service-<slug>.html, workshop.html, why-atlas.html, location.html, contact.html).
 *
 * The partials map 1:1 onto WordPress theme pieces later:
 *   head.html          -> header.php <head>
 *   top-chrome.html    -> header.php (fixed chrome)
 *   nav-overlay.html   -> menu markup (wp_nav_menu)
 *   footer.html        -> footer.php
 *   booking/map modals -> template parts
 *   service-single     -> single-service.php (CPT template)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, content) => fs.writeFileSync(path.join(ROOT, p), content);

const site = JSON.parse(read('src/site.json'));
const data = JSON.parse(read('src/content/services.json'));
const services = data.services;

const partial = (name) => read('src/partials/' + name + '.html');
const pageBody = (name) => read('src/pages/' + name + '.html');

const CSS_FILES = [
  '01-base.css', '02-chrome.css', '03-hero.css', '04-map-overlay.css', '05-nav-overlay.css',
  '06-bottom-bar.css', '07-sections-services.css', '08-location-band.css', '09-booking-overlay.css',
  '10-bay-icons-cta.css', '11-trusted-marquee.css', '12-theme-overrides.css', '13-intro-video.css',
  '14-pages.css'
];
const JS_FILES = [
  '01-navigation.js', '02-booking-modal.js', '03-map-modal.js', '04-header-scroll.js',
  '05-bottom-bar.js', '06-accordion.js', '07-hero-slider.js', '08-services-carousel.js',
  '09-reveal.js', '10-intro-video.js', '11-page.js'
];

/* ---------- shared tokens ---------- */
const baseTokens = {
  ROOT: '',
  SITE_NAME: site.siteName,
  PHONE: site.phoneDisplay,
  PHONE_HREF: site.phoneHref,
  ADDRESS: site.addressLong,
  EMAIL: site.email,
  INSTAGRAM_URL: site.instagramUrl,
  INSTAGRAM_HANDLE: site.instagramHandle,
  MAPS_URL: site.mapsUrl,
  OSM_EMBED: site.osmEmbed,
  COPYRIGHT: site.copyright,
  HOURS_LINES: site.hours.map((h) => '          <li>' + h.days + ': ' + h.time + '</li>').join('\n')
};

const replaceTokens = (str, tokens) =>
  str.replace(/\{\{(\w+)\}\}/g, (m, key) => (key in tokens ? tokens[key] : m));

/* ---------- navigation ---------- */
function navLinks(activeKey) {
  const out = [];
  if (activeKey !== 'home') {
    out.push('      <a href="index.html" class="nav-link">Home</a>');
  }
  for (const item of site.nav) {
    if (item.submenu) {
      out.push('      <button type="button" class="nav-link" id="servicesToggle" aria-expanded="false">');
      out.push('        ' + item.label + ' <span class="chev">▾</span>');
      out.push('      </button>');
      out.push('      <div class="services-submenu" id="servicesSubmenu">');
      for (const s of services.filter((s) => s.inNav)) {
        const cur = activeKey === 'service:' + s.slug;
        out.push(
          '        <a href="service-' + s.slug + '.html" class="sub-link"' +
            (cur ? ' aria-current="page" style="color:var(--orange)"' : '') + '>' + s.navTitle + '</a>'
        );
      }
      out.push('      </div>');
    } else {
      const cur = activeKey === item.key;
      out.push(
        '      <a href="' + item.href + '" class="nav-link' + (cur ? ' is-current' : '') + '"' +
          (cur ? ' aria-current="page"' : '') + '>' + item.label + '</a>'
      );
    }
  }
  return out.join('\n');
}

const FOOTER_SERVICES = [
  ['service-mechanical-diagnostics.html', 'Mechanical & Diagnostics'],
  ['service-genuine-parts.html', 'Genuine Parts'],
  ['service-fleet-management.html', 'Fleet Support'],
  ['service-wheel-alignment.html', 'Wheel Alignment'],
  ['service-body-paint.html', 'Body & Paint']
];
const FOOTER_COMPANY = [
  ['why-atlas.html', 'Why Atlas'],
  ['workshop.html', 'The Workshop'],
  ['location.html', 'Location'],
  ['#', 'Careers'],
  ['#', 'Community']
];

function footerTokens() {
  return {
    FOOTER_SERVICES: FOOTER_SERVICES.map(([h, l]) => '          <li><a href="' + h + '">' + l + '</a></li>').join('\n'),
    FOOTER_COMPANY: FOOTER_COMPANY.map(([h, l]) => '          <li><a href="' + h + '">' + l + '</a></li>').join('\n')
  };
}

/* ---------- shared chrome partials ---------- */
const chromeTokens = (activeKey) =>
  Object.assign({}, baseTokens, footerTokens(), { NAV_LINKS: navLinks(activeKey) });

/* ---------- cta band ---------- */
function ctaBand(title, text) {
  return replaceTokens(partial('cta-band'), Object.assign({}, baseTokens, { CTA_TITLE: title, CTA_TEXT: text }));
}
const CTA_DEFAULT = ctaBand(
  'One desk for personal and company.',
  'Call, WhatsApp or book online — the same service desk answers for the family car and the fleet.'
);

/* ---------- head & scripts ---------- */
function headHtml(title, description) {
  const css = CSS_FILES.map((f) => '<link rel="stylesheet" href="assets/css/' + f + '">').join('\n');
  return replaceTokens(read('src/templates/head.html'), { TITLE: title, DESCRIPTION: description, CSS_LINKS: css });
}
const scriptsHtml = JS_FILES.map((f) => '<script src="assets/js/' + f + '"></script>').join('\n');

/* ---------- page renderer ---------- */
function renderPage({ file, title, description, navKey, main, withIntro, bodyClass }) {
  const tokens = chromeTokens(navKey);
  const shell = read('src/templates/page.html');
  const html = replaceTokens(shell, {
    HEAD: headHtml(title, description),
    BODY_CLASS: bodyClass || '',
    VIDEO_INTRO: withIntro ? replaceTokens(partial('video-intro'), tokens) : '',
    TOP_CHROME: replaceTokens(partial('top-chrome'), tokens),
    MAIN: replaceTokens(main, tokens),
    NAV_OVERLAY: replaceTokens(partial('nav-overlay'), tokens),
    BOTTOM_BAR: replaceTokens(partial('bottom-bar'), tokens),
    FOOTER: replaceTokens(partial('footer'), tokens),
    BOOKING_MODAL: replaceTokens(partial('booking-modal'), tokens),
    MAP_MODAL: replaceTokens(partial('map-modal'), tokens),
    SCRIPTS: scriptsHtml
  });
  write(file, html);
  console.log('built', file);
}

/* ---------- homepage ---------- */
const homeMain = ['hero', 'home-services', 'home-trusted', 'home-facilities', 'home-location']
  .map((p) => partial(p))
  .join('\n');
renderPage({
  file: 'index.html',
  title: 'Atlas Auto Service Centre — Opposite Garden City',
  description:
    'Isuzu-authorized vehicle service on Thika Road, Exit 7 — opposite Garden City Mall, Nairobi. Nine bays for personal and fleet vehicles.',
  navKey: 'home',
  main: homeMain,
  withIntro: true,
  bodyClass: ''
});

/* ---------- services overview ---------- */
function bayLinkCard(s) {
  const img = s.image ? ' img' : '';
  const style = s.image ? ' style="background-image:url(\'assets/images/' + s.image + '\')"' : '';
  return [
    '      <a class="bay ' + s.cardClass + img + ' reveal" href="service-' + s.slug + '.html"' + style + '>',
    '        <span class="bay-num">' + s.tag + '</span>',
    '        <div>',
    '          <div class="bay-title">' + s.bayTitle + '</div>',
    '          <div class="bay-desc">' + s.excerpt + '</div>',
    '          <div class="bay-arrow">View bay →</div>',
    '        </div>',
    '      </a>'
  ].join('\n');
}
const servicesMain = replaceTokens(pageBody('services'), {
  BAY_LINKS: services.map(bayLinkCard).join('\n'),
  TRUSTED: partial('home-trusted'),
  CTA_BAND: CTA_DEFAULT
});
renderPage({
  file: 'services.html',
  title: 'Services — Nine Bays, One Standard | Atlas Auto Service Centre',
  description:
    'Mechanical & diagnostics, genuine parts, fleet support, recovery, alignment, body & paint, detailing, tracking & governors, electrical & A/C — all at Thika Road, Exit 7.',
  navKey: 'services',
  main: servicesMain
});

/* ---------- service detail pages ---------- */
function indexItem(s) {
  return [
    '      <a class="index-item" href="service-' + s.slug + '.html">',
    '        <span class="idx">' + s.num + '</span>',
    '        <span class="idx-body">',
    '          <span class="idx-title">' + s.navTitle + '</span>',
    '          <span class="idx-desc">' + s.excerpt + '</span>',
    '        </span>',
    '        <span class="idx-arrow">→</span>',
    '      </a>'
  ].join('\n');
}
function servicePage(s) {
  const tokens = {
    PAGE_HERO_BG: s.image
      ? '  <div class="page-hero-bg" style="background-image:url(\'assets/images/' + s.image + '\')"></div>'
      : '',
    NUM: s.num,
    NAV_TITLE: s.navTitle,
    BAY_TITLE: s.bayTitle,
    INTRO: s.intro,
    EXCERPT: s.excerpt,
    INCLUDES: s.includes.map((i) => '        <li>' + i + '</li>').join('\n'),
    IMAGE: s.image || 'workshop-facility.jpg',
    STEPS: data.processSteps
      .map((st, i) => '      <div class="step"><div class="s-num">0' + (i + 1) + '</div><h4>' + st.title + '</h4><p>' + st.text + '</p></div>')
      .join('\n'),
    FAQ: s.faq
      .map((f, i) =>
        [
          '      <div class="why-item' + (i === 0 ? ' open' : '') + '">',
          '        <button type="button" class="why-trigger" aria-expanded="' + (i === 0 ? 'true' : 'false') + '">',
          '          <span>' + f.q + '</span>',
          '          <span class="why-chev">▾</span>',
          '        </button>',
          '        <div class="why-panel"><p>' + f.a + '</p></div>',
          '      </div>'
        ].join('\n')
      )
      .join('\n'),
    CROSS_LINKS: services
      .filter((o) => o.slug !== s.slug)
      .slice(0, 4)
      .map(indexItem)
      .join('\n'),
    BOOKING_VALUE: s.bookingValue,
    CTA_BAND: ctaBand(
      'Book Bay ' + s.num + ' — ' + s.bayTitle + '.',
      'Call the desk or send a booking; a coordinator confirms within the hour during business hours.'
    )
  };
  const main = replaceTokens(read('src/templates/service-single.html'), tokens);
  renderPage({
    file: 'service-' + s.slug + '.html',
    title: s.navTitle + ' — Bay ' + s.num + ' | Atlas Auto Service Centre',
    description: s.excerpt + ' Atlas Auto Service Centre, Thika Road Exit 7, opposite Garden City Mall, Nairobi.',
    navKey: 'service:' + s.slug,
    main
  });
}
services.forEach(servicePage);

/* ---------- workshop ---------- */
const workshopMain = replaceTokens(pageBody('workshop'), {
  BAY_INDEX: services.map(indexItem).join('\n'),
  CTA_BAND: ctaBand(
    'Walk the floor, or skip straight to the desk.',
    'Every bay books through the same service desk on Thika Road — opposite Garden City, Exit 7.'
  )
});
renderPage({
  file: 'workshop.html',
  title: 'The Workshop — Nine Bays, Full Capability | Atlas Auto Service Centre',
  description:
    'Inside the Atlas workshop on Thika Road: nine bays, genuine parts and factory-standard process for personal and fleet vehicles.',
  navKey: 'workshop',
  main: workshopMain
});

/* ---------- why atlas ---------- */
const whyMain = replaceTokens(pageBody('why-atlas'), {
  TRUSTED: partial('home-trusted'),
  CTA_BAND: CTA_DEFAULT
});
renderPage({
  file: 'why-atlas.html',
  title: 'Why Atlas — Authorized, Accountable, Convenient | Atlas Auto Service Centre',
  description:
    'Five reasons executives and fleets choose Atlas: factory-trained technicians, genuine parts, fleet priority, Thika Road location and one desk for personal and company vehicles.',
  navKey: 'why',
  main: whyMain
});

/* ---------- location ---------- */
const locationMain = replaceTokens(pageBody('location'), {
  AREA_CHIPS: site.areasServed.map((a) => '          <span class="chip">' + a + '</span>').join('\n'),
  CTA_BAND: CTA_DEFAULT
});
renderPage({
  file: 'location.html',
  title: 'Location — Thika Road, Exit 7 | Atlas Auto Service Centre',
  description:
    'Atlas Auto Service Centre sits on Thika Road at Exit 7, opposite Garden City Mall, Nairobi — on the route for Runda, Karen, Muthaiga and Ridgeways.',
  navKey: 'location',
  main: locationMain
});

/* ---------- contact ---------- */
const contactMain = replaceTokens(pageBody('contact'), { CTA_BAND: CTA_DEFAULT });
renderPage({
  file: 'contact.html',
  title: 'Contact & Bookings | Atlas Auto Service Centre',
  description:
    'Call +254 700 941 698, email info@atlas-servicecentre.co.ke or send a booking request. Atlas Auto Service Centre, Thika Road Exit 7, opposite Garden City Mall.',
  navKey: 'contact',
  main: contactMain
});

console.log('done:', 1 + 1 + services.length + 4, 'pages');
