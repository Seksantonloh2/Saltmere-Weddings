# Saltmere Weddings: Framer handoff

The working HTML prototype is in `site/`. To preview it, run `python -m http.server 5173 --directory site` and open http://localhost:5173. It uses root paths, so opening the files directly with `file://` won't work.

## Pages (all end at the enquiry form)
| Page | URL | Sections |
|---|---|---|
| Home | `/` | Hero over a full-width photo · Stats strip (count-up) · Services bento (5 tiles) · How it works (3 numbered rows) · Why couples choose us (portrait + 3 promises) · Real weddings preview (3) · Reviews (3) · Final CTA band |
| Services | `/services` | Centred hero · Full-width image band · Package cards (Full planning featured) · Always-included list · CTA band |
| Real Weddings | `/weddings` | Hero + filter chips · Bento of 6 weddings · Story modal (6–8 photos, 3-sentence story, credits, CTA) · CTA band |
| About | `/about` | Split hero (portrait left) · Founder story · How we work (3 columns) · Team cards · Behind-the-scenes pair · Supplier list · CTA band |
| Enquire | `/enquire` | Hero · Date-first form + contact side panel · FAQ accordion |

The package buttons link to `/enquire?package=…`, which preselects the package in the form dropdown. Home preview cards link to `/weddings#<couple>`, which opens that wedding's story.

## Tokens
| Token | Value |
|---|---|
| Background | `#FAF8F5` |
| Surface (tiles/cards) | `#F1ECE5` |
| Ink | `#141414` |
| Muted text | `#5E5952` |
| Lines | `#E2DCD3` |
| Accent (Brown) | `#683526`, hover `#84503F` (lighter) |
| Status | success `#16A34A`, error `#DC2626` (form only) |
| Radius | 6px everywhere (chips are pills) |
| Spacing | 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128; section padding 80–152px |
| Max width | 1280px, gutter 16–48px |

## Type
- Headings: **Instrument Serif** 400. Body: **Source Sans 3** 400/600. Wordmark: **Switzer** Medium, 0.42em tracking, with *Weddings* in Instrument Serif italic underneath.
- Title and subtitle pairs (about 4:1):
  - Hero: 112 / 28 desktop, 60 / 16 mobile
  - Section: 76 / 19 desktop, 44 / 16 mobile
  - Card title: 36 desktop, 28 mobile
- Body: 18px desktop, 17px mobile, line-height 1.6.

## Motion (every animation is 0.8s, ease `cubic-bezier(0.22, 1, 0.36, 1)`)
- **Text on load:** Appear effect with blur 10 → 0, opacity 0 → 1, y 16 → 0, staggered about 70ms per word.
- **Scroll reveals:** blur 8, y 24, staggered about 90ms within grids.
- **Gallery images:** slow slide-in (y 40 → 0 with a slight scale-down, 1.4s).
- **Buttons:** Hover variant lightens the brown, the label slides up and is replaced by a duplicate, and the arrow shifts 5px. Press scales to 0.97. No shadows anywhere.
- **Cards:** image zooms to 1.04–1.05, background shifts slightly darker, and service tiles lift 4px.
- **Stats:** count up from 0 over 1.6s with ease-out and run once. Suffixes (+, ★) stay static.
- **Page transitions:** blur and fade between pages. Same-page anchors only smooth-scroll.
- **Reduced motion:** blur and translate are off, and simple fades remain.

## Navigation
- Desktop: links on the left, centred wordmark, Brown "Check your date" button on the right. Sticky, with a hairline border once you scroll.
- Mobile: hamburger with a full-screen menu, plus a fixed bottom "Check your date" button. The fixed button hides while the hero, a CTA band, the form or the footer is on screen.

## Images
All photos are Unsplash (free licence) and hotlinked through `images.unsplash.com` for the mock-up. Before launch, download them into Framer, or swap in the studio's own photos. Couples, team, reviews, stats, suppliers, ABN and phone number are all sample or placeholder content.

## Notes on the brief
- The brief mentions both a **Brown #683526** accent and a "champagne" button. Brown is used for every button, to keep to one accent.
- The portfolio copy mentions Switzer and Inter. The site follows the **Instrument Serif + Source Sans 3** visual direction table, with Switzer used only for the wordmark and favicon.
- "0.8ms" is read as **0.8s**.
- Two extra fictional weddings (Priya & Tom, coastal; Grace & Oliver, garden) were added so every filter chip shows at least one wedding.
