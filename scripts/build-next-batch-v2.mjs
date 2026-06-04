import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const claimUrl = 'https://cal.com/daniel-hohnloser/15min';
const rawPath = '/Users/welovedani/Obsidian/MasterBrain/1_Projects/AI-Money-Experiment/build/output/v2/raw-mobile-mechanic-phoenix-az.json';
const raw = JSON.parse(readFileSync(rawPath, 'utf8'));
const byTitle = new Map(raw.map((r) => [r.title, r]));

const leads = [
  {
    title: 'Accurate Mobile Mechanic – Brakes, Batteries, AC & More',
    slug: 'accurate-mobile-mechanic',
    short: 'Accurate Mobile Mechanic',
    eyebrow: 'Mobile repair · Bell Road Phoenix',
    headline: 'Brakes, batteries, A/C — handled where the car sits.',
    subhead: 'A mobile mechanic preview built around the signals customers already mention: fast help, fair pricing, and repairs done at the driveway, parking lot, or curb.',
    accent: '#ff7a1a',
    accent2: '#1947ff',
    bg: '#f5f7fb',
    ink: '#101828',
    theme: 'clean service-bay blue/orange, structured and practical',
    layout: 'accurate',
    services: [
      ['Alternators & charging', 'A customer review says Accurate came through on an alternator job and kept the agreed price even when it took longer.'],
      ['Battery / no-move help', 'One reviewer said a car that “wouldn’t move” was handled same day, with clear communication and a careful battery replacement.'],
      ['Brakes, batteries, A/C & more', 'The public listing name itself leads with brakes, batteries and A/C. This preview keeps that wording exactly owner-verifiable.'],
      ['Mobile boat / engine help', 'A review mentions mobile boat repair on a 2004 MerCruiser, including carburetor removal, rebuild/cleaning, reinstall, and run-check.'],
    ],
    ownerLine: '162 reviews and no website listed is enough proof to deserve a real page — this is the first draft.',
    sms: 'Saw Accurate Mobile Mechanic has 4.9★ with 162 reviews but no website, so I built you one to show you: {url} — want it live on your own domain for $399? No pressure.',
  },
  {
    title: "Papi's mobile services",
    slug: 'papis-mobile-services',
    short: "Papi's Mobile Services",
    eyebrow: 'Honest mobile mechanic · Ahwatukee/Phoenix',
    headline: 'No gimmicks. No overcharging. Just solid mobile repair.',
    subhead: 'This preview leans into the exact thing customers repeat in reviews: honest advice, fast work, and not pushing repairs that are not worth it.',
    accent: '#1f7a4d',
    accent2: '#f2b84b',
    bg: '#fff8ed',
    ink: '#1b1a16',
    theme: 'warm neighborhood mechanic, cream/green/gold, trust-first voice',
    layout: 'papi',
    services: [
      ['Straight answers', 'A customer says Papi “tells you exactly how it is” and does not make people spend money that is not worth it.'],
      ['Fast mobile work', 'Another review calls out “good work done fast” — the preview keeps the service promise simple and review-grounded.'],
      ['Used-car practicality', 'One reviewer says Papi advised them away from sinking money into an old Ford and helped them get into a more reliable Toyota Camry.'],
      ['General auto repair', 'The public listing category is auto repair shop; final service menu should be owner-approved before publishing.'],
    ],
    ownerLine: 'The strongest hook here is trust. The page should sound like the reviews: direct, fair, and local.',
    sms: "Saw Papi's Mobile Services has 4.9★ reviews and no website, so I built you one around what customers already say: {url} — want it live on your own domain for $399? No pressure.",
  },
  {
    title: 'Elite Mobile Auto Electric LLC',
    slug: 'elite-mobile-auto-electric',
    short: 'Elite Mobile Auto Electric',
    eyebrow: 'Mobile auto electric · West Phoenix',
    headline: 'Electrical problems, no-starts, and stubborn diagnostics — brought back to life.',
    subhead: 'Owner-facing preview for a mobile auto electric shop whose reviews point to bilingual communication, detailed explanations, and getting vehicles running again after other mechanics could not.',
    accent: '#68f5ff',
    accent2: '#ff9f1c',
    bg: '#080d12',
    ink: '#f4fbff',
    theme: 'dark electric diagnostic, cyan/amber, technical and confidence-heavy',
    layout: 'elite',
    services: [
      ['Electrical diagnostics', 'The business name and reviews support the electrical positioning; one reviewer says multiple mechanics could not figure out the issue before Danny did.'],
      ['No-start recovery', 'A customer wrote that Danny made sure the car was running and stayed running after they had given up hope.'],
      ['Alternator & belt work', 'One review specifically mentions alternator and serpentine belt replacement, plus a battery recommendation.'],
      ['Spanish + English communication', 'A reviewer says Danny was professional speaking both Spanish and English and explained the work clearly.'],
    ],
    ownerLine: 'This one should feel technical and reassuring — the reviews sell diagnostic persistence better than generic mechanic copy could.',
    sms: 'Saw Elite Mobile Auto Electric has 4.7★ with 93 reviews but no website, so I built you a preview from your Google reviews: {url} — want it live on your own domain for $399? No pressure.',
  },
];

function esc(s = '') {
  return String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function tel(phone) { return '+1' + phone.replace(/\D/g, ''); }
function stars(n) { return '★'.repeat(Math.round(Number(n) || 0)); }
function firstName(name) { return (name || 'Google reviewer').split(/\s+/)[0]; }
function hoursList(openingHours = []) { return openingHours.map((h) => `<div><b>${esc(h.day)}</b><span>${esc(h.hours)}</span></div>`).join(''); }
function excerpt(text, max = 260) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sentence = cut.match(/^(.+[.!?])\s+[^.!?]*$/);
  if (sentence?.[1] && sentence[1].length > 90) return sentence[1];
  return cut.replace(/[,;:\-–—]?\s+\S*$/, '') + '…';
}
function quoteCards(reviews = [], accent = '#fff') {
  const seen = new Set();
  return reviews.filter((r) => {
    const key = String(r.text || '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!key || r.stars < 4 || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3).map((r) => `
    <article class="quote"><div class="stars">${esc(stars(r.stars))}</div><blockquote>“${esc(excerpt(r.text))}”</blockquote><p>${esc(firstName(r.name))} · Google review</p></article>
  `).join('');
}
function imageTiles(imageUrls = []) { return imageUrls.slice(0, 4).map((u, i) => `<div class="photo p${i}" style="background-image:url('${esc(u)}')"></div>`).join(''); }
function mapsUrl(r) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.title} ${r.address || 'Phoenix AZ'}`)}`; }

function renderLead(lead) {
  const r = byTitle.get(lead.title);
  if (!r) throw new Error(`Missing raw record for ${lead.title}`);
  if (r.website) throw new Error(`${lead.title} has website in raw data: ${r.website}`);
  const heroImg = r.imageUrls?.[0] || r.imageUrl || '';
  const bodyClass = lead.layout;
  const isDark = lead.layout === 'elite';
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(lead.short)} — ${esc(r.totalScore)}★ mobile auto repair preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
:root{--bg:${lead.bg};--ink:${lead.ink};--accent:${lead.accent};--accent2:${lead.accent2};--muted:${isDark ? '#a8bcc8' : '#667085'};--card:${isDark ? '#101922' : '#ffffff'};--line:${isDark ? '#203140' : '#dde3ea'}}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,sans-serif;line-height:1.55}a{color:inherit}.ribbon{position:relative;z-index:5;background:${isDark ? '#041014' : '#101828'};color:#fff;text-align:center;padding:10px 14px;font-size:13px}.ribbon a{color:var(--accent);font-weight:800;text-decoration:underline;text-underline-offset:3px}.nav{position:sticky;top:0;z-index:4;display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:${isDark ? 'rgba(8,13,18,.88)' : 'rgba(255,255,255,.86)'};backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.brand{font-family:Archivo,Inter,sans-serif;font-weight:900;letter-spacing:-.04em}.pill{border:1px solid var(--line);border-radius:999px;padding:9px 14px;text-decoration:none;font-weight:800;background:var(--accent);color:${lead.layout === 'accurate' ? '#fff' : '#101828'}}
.hero{position:relative;overflow:hidden}.hero:before{content:"";position:absolute;inset:0;background:url('${esc(heroImg)}') center/cover no-repeat;opacity:${isDark ? '.23' : '.18'};filter:${isDark ? 'contrast(1.2) saturate(.8)' : 'saturate(.85)'}}.hero:after{content:"";position:absolute;inset:0;background:${lead.layout === 'accurate' ? 'linear-gradient(110deg,#f5f7fb 0%,rgba(245,247,251,.92) 45%,rgba(245,247,251,.35))' : lead.layout === 'papi' ? 'radial-gradient(circle at 15% 10%,rgba(242,184,75,.28),transparent 35%),linear-gradient(120deg,#fff8ed 0%,rgba(255,248,237,.86) 55%,rgba(255,248,237,.35))' : 'radial-gradient(circle at 80% 15%,rgba(104,245,255,.2),transparent 30%),linear-gradient(105deg,#080d12 0%,rgba(8,13,18,.92) 52%,rgba(8,13,18,.58))'}}.heroIn{position:relative;z-index:2;max-width:1120px;margin:0 auto;padding:76px 24px 72px;display:grid;grid-template-columns:1.1fr .9fr;gap:38px;align-items:end}.eyebrow{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:8px 12px;color:var(--accent);font-weight:900;text-transform:uppercase;letter-spacing:.12em;font-size:12px;background:${isDark ? 'rgba(16,25,34,.75)' : 'rgba(255,255,255,.75)'}}h1{font-family:${lead.layout === 'papi' ? 'Instrument Serif, Georgia, serif' : lead.layout === 'elite' ? 'Space Grotesk, Inter, sans-serif' : 'Archivo, Inter, sans-serif'};font-size:clamp(42px,7vw,86px);line-height:.92;letter-spacing:${lead.layout === 'papi' ? '-.035em' : '-.06em'};margin:18px 0 18px}.sub{font-size:19px;max-width:680px;color:${isDark ? '#d6e5ec' : '#344054'};margin:0 0 24px}.ctas{display:flex;gap:12px;flex-wrap:wrap}.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:${lead.layout === 'accurate' ? '12px' : lead.layout === 'papi' ? '999px' : '4px'};padding:15px 20px;text-decoration:none;font-weight:900}.btn.primary{background:var(--accent);color:${lead.layout === 'accurate' ? '#fff' : '#101828'}}.btn.secondary{border:1px solid var(--line);background:${isDark ? 'rgba(16,25,34,.75)' : 'rgba(255,255,255,.75)'}}.proof{background:var(--card);border:1px solid var(--line);border-radius:${lead.layout === 'elite' ? '8px' : '24px'};padding:24px;box-shadow:${isDark ? '0 0 60px rgba(104,245,255,.08)' : '0 22px 70px rgba(16,24,40,.10)'}}.score{font-family:Archivo;font-size:44px;letter-spacing:-.06em}.stars{color:var(--accent2);letter-spacing:2px;font-weight:900}.proof p{margin:8px 0 0;color:var(--muted)}
.strip{border-block:1px solid var(--line);background:${isDark ? '#0c151d' : '#fff'};}.stats{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}.stat{padding:20px 24px;border-right:1px solid var(--line)}.stat b{display:block;font-size:24px;font-family:Archivo}.stat span{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.1em;font-weight:900}section{max-width:1120px;margin:0 auto;padding:68px 24px}h2{font-family:${lead.layout === 'papi' ? 'Instrument Serif, Georgia, serif' : 'Archivo, Inter, sans-serif'};font-size:clamp(34px,5vw,58px);line-height:.98;letter-spacing:-.05em;margin:0 0 12px}.sectionSub{color:var(--muted);font-size:18px;max-width:690px;margin:0 0 26px}.services{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:14px}.svc{background:var(--card);border:1px solid var(--line);border-radius:${lead.layout === 'elite' ? '8px' : '18px'};padding:22px}.svc h3{margin:0 0 8px;font-family:Archivo;letter-spacing:-.03em}.svc p{margin:0;color:var(--muted)}.gallery{max-width:1120px;margin:0 auto;padding:0 24px 24px;display:grid;grid-template-columns:1.3fr .8fr .8fr;grid-auto-rows:210px;gap:12px}.photo{background:#222 center/cover no-repeat;border-radius:${lead.layout === 'papi' ? '28px' : lead.layout === 'elite' ? '6px' : '16px'};border:1px solid var(--line);min-height:170px}.p0{grid-row:span 2}.quotesWrap{background:${isDark ? '#071015' : lead.layout === 'papi' ? '#f4ead7' : '#eef3ff'};border-block:1px solid var(--line)}.quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.quote{background:var(--card);border:1px solid var(--line);border-radius:${lead.layout === 'elite' ? '8px' : '20px'};padding:22px}.quote blockquote{margin:10px 0 14px;font-size:17px}.quote p{margin:0;color:var(--muted);font-weight:800}.info{display:grid;grid-template-columns:1fr 1fr;gap:16px}.panel{background:var(--card);border:1px solid var(--line);border-radius:${lead.layout === 'elite' ? '8px' : '22px'};padding:24px}.hours div{display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid var(--line);padding:8px 0}.hours span{color:var(--muted)}.owner{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#101828;text-align:center}.owner .wrap{max-width:760px;margin:0 auto;padding:66px 24px}.owner h2{color:#101828}.owner p{font-size:19px;font-weight:700}.owner .btn{background:#101828;color:#fff}footer{text-align:center;color:var(--muted);font-size:13px;padding:26px 20px}@media(max-width:760px){.heroIn{grid-template-columns:1fr;padding-top:54px}.stats{grid-template-columns:repeat(2,1fr)}.gallery{grid-template-columns:1fr 1fr;grid-auto-rows:170px}.p0{grid-row:auto;grid-column:span 2}.info{grid-template-columns:1fr}.nav{padding:12px 16px}.brand{font-size:14px}.pill{font-size:13px;padding:8px 10px}}
</style></head><body class="${bodyClass}">
<div class="ribbon">Preview built from ${esc(lead.short)} public Google listing/reviews — not affiliated until claimed. <a href="${claimUrl}">Owner? Claim it →</a></div>
<nav class="nav"><div class="brand">${esc(lead.short)}</div><a class="pill" href="tel:${tel(r.phone)}">${esc(r.phone)}</a></nav>
<header class="hero"><div class="heroIn"><div><span class="eyebrow">${esc(lead.eyebrow)}</span><h1>${esc(lead.headline)}</h1><p class="sub">${esc(lead.subhead)}</p><div class="ctas"><a class="btn primary" href="tel:${tel(r.phone)}">Call ${esc(r.phone)}</a><a class="btn secondary" href="#services">See review-backed services</a></div></div><aside class="proof"><div class="stars">${esc(stars(r.totalScore))}</div><div class="score">${esc(r.totalScore)} / 5</div><p>${esc(r.reviewsCount)} Google reviews · no website listed on the public Google result used for this preview.</p></aside></div></header>
<div class="strip"><div class="stats"><div class="stat"><b>${esc(r.totalScore)}★</b><span>Google rating</span></div><div class="stat"><b>${esc(r.reviewsCount)}</b><span>Reviews</span></div><div class="stat"><b>Mobile</b><span>Service model</span></div><div class="stat"><b>No site</b><span>Listing gap</span></div></div></div>
<section id="services"><h2>What customers already say they call for.</h2><p class="sectionSub">No invented service menu. These cards are grounded in the public listing name/category and review text; the owner should approve final wording before this becomes a real site.</p><div class="services">${lead.services.map(([h, p]) => `<article class="svc"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div></section>
<div class="gallery">${imageTiles(r.imageUrls || [])}</div>
<div class="quotesWrap"><section><h2>Review proof, not marketing fluff.</h2><p class="sectionSub">Pulled from public Google reviews. These are the owner-facing proof points this page is built around.</p><div class="quotes">${quoteCards(r.reviews || [], lead.accent)}</div></section></div>
<section><div class="info"><div class="panel"><h2>Find / call</h2><p class="sectionSub">${esc(r.address || 'Phoenix, AZ')}</p><p><b>Phone:</b> <a href="tel:${tel(r.phone)}">${esc(r.phone)}</a></p><p><a class="btn secondary" href="${mapsUrl(r)}" target="_blank" rel="noreferrer">Open Google listing →</a></p></div><div class="panel"><h2>Hours shown</h2><div class="hours">${hoursList(r.openingHours || [])}</div></div></div></section>
<section class="owner"><div class="wrap"><h2>${esc(lead.short)} — this draft is ready to claim.</h2><p>${esc(lead.ownerLine)}</p><a class="btn" href="${claimUrl}">Claim this website →</a></div></section>
<footer>Pre-built preview for ${esc(lead.short)} · made from public Google data · not affiliated until claimed · noindex demo</footer>
</body></html>`;
}

mkdirSync('v2', { recursive: true });
for (const lead of leads) writeFileSync(join('v2', `${lead.slug}.html`), renderLead(lead));

const cards = leads.map((lead) => {
  const r = byTitle.get(lead.title);
  return `    <a class="card" href="./${esc(lead.slug)}.html">\n      <div class="thumb" style="background:linear-gradient(135deg,${lead.bg},${lead.accent});color:${lead.layout === 'elite' ? '#fff' : '#101828'}">${esc(lead.short)}</div>\n      <div class="meta"><h3>${esc(lead.short)}</h3><div class="cat">${esc(r.categoryName)} · Phoenix</div>\n      <div class="rate">${esc(stars(r.totalScore))} ${esc(r.totalScore)} · ${esc(r.reviewsCount)} reviews</div>\n      <div class="why"><b>Theme:</b> ${esc(lead.theme)}. Built from review-backed service signals; no website listed.</div></div>\n    </a>`;
}).join('\n');

const index = readFileSync('v2/index.html', 'utf8');
const marker = '  </div>\n\n  <div class="ba">';
if (!index.includes('Next outreach batch')) {
  writeFileSync('v2/index.html', index.replace(marker, `  </div>\n\n  <h2 style="margin:8px 0 0;font-size:28px">Next outreach batch</h2>\n  <p class="lede" style="font-size:15px">Quality gate kept 3 leads: high rating, meaningful review count, real phone, no website, clean local-service fit, and enough public review/photo data to build a v2-quality page.</p>\n  <div class="grid">\n${cards}\n${marker}`));
}

writeFileSync('v2/next-batch-manifest.json', JSON.stringify(leads.map((lead) => {
  const r = byTitle.get(lead.title);
  return { business: lead.short, sourceTitle: lead.title, slug: lead.slug, rating: r.totalScore, reviews: r.reviewsCount, phone: r.phone, website: r.website || null, livePath: `/ghostsite-demo/v2/${lead.slug}.html`, sms: lead.sms };
}), null, 2));

console.log(`Generated ${leads.length} GhostSite v2 pages.`);
