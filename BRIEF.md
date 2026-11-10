# RPL Crane Services — static GitHub Pages preview brief

For a Cursor cloud agent. Write the site code only. Do not contact the business. Do not push this URL to Nate, or to the client, until Audit passes the L-103 gate. The parent launches this run; do not start further cloud agents.

Written 10 Nov 2026, ~23:45 AWST (Australia/Perth), from Production’s approved wireframe (`wireframe.html` md5 `b0ec228da92fb29cbf36c368008c7a2f`) and Director’s job card (Nate GO 23:37 AWST). This is a **static noindex GitHub Pages** preview, not a Wix build, and nothing may touch the client’s site or account.

---

## 1. Route

Public repo `CromServices/rpl-crane-services-preview`, branch `main`, GitHub Pages from `main` `/`. Expected URL:

https://cromservices.github.io/rpl-crane-services-preview/

The repo already has `assets/`, `fonts/`, `robots.txt` (`User-agent: *` / `Disallow: /`), this `BRIEF.md`, and a placeholder `index.html` with `<meta name="robots" content="noindex">`. Replace the placeholder with the finished Home. Keep the noindex meta on every page. Keep `robots.txt` as disallow-all. Add an empty `.nojekyll` if it is not already there.

Commit as Crom Services `<cromservices@gmail.com>`. Do not add a custom domain. Do not edit any other CromServices repo. Read-only references (do not modify those repos): the sun/moon and booking-chrome pattern at https://cromservices.github.io/ozzy-gyprock-preview/, and the Liftrite crane-picker pattern at https://cromservices.github.io/liftrite-crane-hire-preview/ plus the Liftrite pack cited in §7.

Deliverable: a single Home page (`index.html` plus CSS/JS as needed) that matches the attached `wireframe.html` layout, with the colour, chrome, one-card picker, booking, and copy rules in this brief. Inner marketing pages are optional; Home is what Audit will gate.

---

## 2. Source files

Canonical production pack (do not overwrite): `/workspace/crom/projects/crom-desk/02-working/production/outbound-spec-sites-2026-11-10/rpl-crane-services/`

A working copy sits in `/workspace/crom/projects/crom-desk/02-working/coder2/outbound-spec-sites-2026-11-10/rpl-crane-services/`. The parent attaches `wireframe.html` and `wireframe.md` to the cloud run. The local `wireframe.md` has had bank details stripped; if you are ever handed the production markdown, still never copy BSB or account numbers onto the page, into this repo, or into any proof. Approved images and fonts are already in this repo (no `assets/source/` folder).

| File | md5 | Role |
|---|---|---|
| `wireframe.html` | `b0ec228da92fb29cbf36c368008c7a2f` | Home layout, spacing, visible copy (upgrade booking chips; keep the one-card picker; drop banned lines) |
| `wireframe.md` (local, bank details stripped) | `a905d0fcefed8a3468a5ef8389a6d0cf` | Facts, sourcing, structure |
| `assets/logo.png` / `assets/logo-400.webp` | `599430c3ef86a6cd9021b48f2197b065` / `bb7cd09d00cd76290ca098c123e696b6` | Refreshed badge (use on the site) |
| `assets/hero-480.webp` (plus `.jpg` / 600) | `822ea083b6c2c1bb8b18dee15eff99c7` | Hero — branded truck side, once |
| `fonts/manrope-400.woff2` / `manrope-700.woff2` / `sourcesans3.woff2` | `700bdb48f816f3a1cfe09e57bbc4397e` / `f473cffa9febfb6c91827efb2cafdee7` / `9ef356ea553ac473c76cc863ff644c35` | Self-host |

**Logo refresh: yes.** Use the refreshed “RPL CRANE SERVICES” badge (`assets/logo.png` / `logo-400.webp` / `logo-800.webp`). It is a clean refresh of their existing badge, not a new brand. After the build, the parent will publish `proofs/logo-before-after.png` and site before/after proofs at public URLs. Old-site shots already exist in the production pack as `proofs/current-desktop-1440.png` and `proofs/current-mobile-390.png` (the 390 frame shows the clipped badge, because the live site has no viewport). There are no files named `current-desktop-1440-first.png` / `current-mobile-390-first.png`; `desktop-1440-first.png` / `mobile-390-first.png` are first-view crops of the new wireframe.

Correct typos in the live copy (“Excelent”, “provde”) in all visible text; do not add facts.

---

## 3. Hard rules

- `<meta name="robots" content="noindex">` on every page, and `robots.txt` disallow-all, before any URL is announced.
- **Never put RPL’s BSB or account number anywhere** — not on the page, not in HTML comments, not in README, not in proofs, not in schema, not in this repo. Payment method (cash or direct debit) may be mentioned. Bank details stay off the page.
- No pricing on the page. Drop “There is no online price.” The published **minimum job of 4 hours** and the fact of night and emergency surcharges may be mentioned, without inventing dollar amounts or a “night rate” figure.
- **No street address and no ABN.** Do not print “Unit 2/94 Bryant Street” (or any street number) on Contact, footer, or JSON-LD. Contact and the hero may say Padstow, next to the M5.
- No invented reviews, ratings, stats, or licence numbers, and no second crane. Published contract licence N-0371621/1 and HRW 068323 may appear, because they are on the live site. Published hours may appear: 24-hour service, six days a week, except Sunday. No reviews block (none were found). No map.
- No builder/demo/AI wording. Public copy uses only facts published on `https://rplcraneservices.com.au/` (plus `about.html`, `quote.html`, `contact.html`), fetched 10 Nov 2026, typo-corrected.
- Do not email admin@rplcraneservices.com.au or anyone at the business. Widgets are in-page only and must not send mail.
- Honour `prefers-reduced-motion`. Tap targets ≥ 44px.

## Shared build standards (write these into the page behaviour, not as on-page copy)

These come from locks.md, the 10 Nov Ozzy/Subzero job, Production research.md, and Director’s 23:37 job card. Do not print lock names, file paths, or “per the brief” on the rendered page.

### L-103 (locks.md, 10 Nov 2026 21:54 AWST)

Every preview is read as the client would read it. Scan rendered visible text for internal or builder notes. Ban-list: as listed, no invented, placeholder, TODO, per wireframe, brief, L-0, Crom meta-talk, “This form does not send.” Any hit is a BLOCK. The only allowed placeholder is a marked photo slot: **Your photo here**. Copy where the client site gives no detail is written in the client voice from facts on their site only. Sourcing notes live in `wireframe.md`, never on the page.

Also **L-101**: no sample, demo, template, concept, or “illustrative” wording on the pages, titles, metas, or alt text. Honesty that this is a Crom pitch preview belongs in `README.md` only.

### L-105 (locks.md, 10 Nov 2026 22:06 AWST)

Keep the business’s own photos, logo and brand colours, modernised. No stock that could pass as theirs. A marked photo slot only where no usable photograph exists. No empty panels. Real copy on every card. Each photograph is used once as a content image (a CSS lightbox of that same image is not a second use).

### L-072 sun/moon toggle (locks.md, amended 10 Nov 2026 22:59 AWST)

Every site ships light and dark themes. Default follows the device (`prefers-color-scheme`). A **single small sun/moon icon button** (about 36px) sits at the **right of the nav**, `aria-label="Switch light/dark"`, switches light/dark, and is remembered per device. **No visible System option.** Dark keeps the brand accents and headings with contrast ≥ 4.5:1 (3:1 for large text). Check both themes at 390 and 1440 (also 320 and 1920).

### Date chips and time pills (Ozzy/Subzero job card + this Director card; upgrades the wireframe widget)

The wireframe’s booking block is a static 10-day row that includes Saturday and Sunday as selectable, and time pills **Morning / Afternoon / Either**, plus walkthrough copy that promises emails and calendars and the banned line “This preview form does not send.” Do not copy that behaviour.

Required shape on Home:

1. **14 date chips** for the next 14 calendar days in the business’s local timezone (named in this brief). **Weekends disabled** (Saturday and Sunday may be visible or omitted, but must not be selectable). Do not invent clock opening hours.
2. Time-window pills: **Morning, Midday, Afternoon** (not “Either”).
3. Job-type chips from their real services only (listed below).
4. A summary line of the selected day, window, and job type (and, for RPL, the plant).
5. Name and phone fields (email and a customer site-address field are fine).
6. A **full-width Book** button.
7. A **success state** that only restates the saved summary. No step copy that promises emails or calendars, or says “you’ll stay on this page.” No “This form does not send.”

Safe help line, trimmed: “Pick a day that suits you. This holds a visit or a call. The job is confirmed once we reply.”

### Big-image lightbox (Production research.md + each pack’s wireframe)

**Definition**, from `/workspace/crom/projects/crom-desk/02-working/production/outbound-spec-sites-2026-11-10/research.md` (section “Masonry or bento job gallery, with a lightbox”): a bento / masonry gallery of the business’s own job photographs, with fixed aspect ratios, `srcset` in WebP (JPEG fallback), lazy-load below the fold, and a **CSS `:target` lightbox** so a visitor can open a shot without a heavy script. Captions stay short and factual. No shader or scroll libraries.

The pack wireframes already implement this as `.lightbox` panels (`display:none` until `:target { display:flex }`), a full-viewport dark veil, the larger derivative of the same photograph, and a close control with `aria-label="Close"` that returns to `#photos`. See `wireframe.html` in this folder. Where the gallery is marked “Your photo here” slots, still ship the lightbox CSS so it is ready once real photographs are supplied; do not lightbox an empty slot as if it were a photo.

### Sticky chrome the wireframe already asks for

- Sticky header on desktop and at 390.
- At 390: a sticky **Call | Request a quote** (or the site’s Book label) bar on **one line** at the bottom. Call uses the published `tel:` number. No hamburger that hides the phone number. Tap targets ≥ 44px. No horizontal scroll from 320px to 1440px (also check 1920). Honour `prefers-reduced-motion`.


---


---

## 4. Colours and type

Black and orange taken from the current badge. White on `#F15A12` fails body-size AA, so buttons use dark ink `#111111` on the orange.

| Token | Hex | Role |
|---|---|---|
| `--header-bg` / `--dark` | `#111111` | Header, dark field, footer, accent ink |
| `--accent` | `#F15A12` | Buttons and selected chips |
| `--mark` | `#FFD15C` | Kickers, from the yellow boom |
| `--paper` | `#FAFAFA` | Page background |
| `--ink` | `#161616` | Body text |
| `--muted` | `#3A3A3A` | Secondary text |
| `--line` | `#D0D0D0` | Rules |
| `--wash` | `#F0F0F0` | Soft fills |
| `--on-dark` | `#FAFAFA` | On-dark text |

**Type:** Manrope 700 for headings, `clamp(30px, 7.7vw, 56px)` on the H1; Manrope 400 and Source Sans 3 for body (18px desktop, 17px phone), self-hosted latin woff2, SIL OFL. A clean, normal-width bold sans — not Syne, and not an ultra-wide display face.

---

## 5. Copy and facts (published only)

- Name: RPL Crane Services / RPL Crane Services Pty Ltd
- Trade: crane and borer work, specialising in installing and removing power poles; can carry a pole up to 11 m; commercial and private work; support during maintenance, removal, relocation or installation of power poles, including holding the pole in place with their trucks
- Machine (one only — do not invent a second): “Proline CRANE & BORER mounted on a Scania.” 5/10 ton Proline continuous slewing crane, licensed up to 60 ton. Proline borer described as excellent for drilling up to 3.6 m. Standard augers 250–600 mm. Other sizes can be arranged, subject to terrain, soil and rock types. The crane is always certified and inspected daily. Operators and dogmen are well trained and fully licensed. All insurances and training certificates are current. A site inspection, and a pre-check on site before start, can be arranged.
- Experience: 14 years
- Hours: 24-hour service, 6 days a week, except Sunday (published — may be used)
- Area: Padstow, next to the M5. No invented suburbs list.
- Phone: 0418 672 546 (`tel:+61418672546`)
- Email: admin@rplcraneservices.com.au
- Licensing: Contract licence N-0371621/1; Insurance High Risk HRW 068323
- Quote terms that may be stated, without dollar amounts: minimum job 4 hours; night and emergency surcharges; cash or direct debit

**Home title:** `Power-pole crane and borer work, Padstow | RPL Crane Services` plus noindex.

**Meta:** `Power-pole crane and borer work from Padstow. Proline crane and borer on a Scania. Call 0418 672 546.`

**Nav:** About and machinery, Work, Quote, Book a lift, Contact, 0418 672 546, Request a quote, then the theme button on the right.

**Hero eyebrow:** Padstow, next to the M5

**H1:** Power-pole crane and borer work, based in Padstow.

**Hero lead (verbatim):** A mobile plant with experienced, authorised crane operators, specialising in the installation and removal of power poles. Our transport can also carry a pole up to 11 m.

**Hero proof row:** 14 years in operation · Contract licence N-0371621/1 · 24-hour service, six days (not Sunday)

**Hero CTAs:** Call 0418 672 546 / Request a quote

**Services heading / lead:** Overhead support for electrical industry projects / Available to the commercial and private sectors. We regularly work with other contractors on electrical industry projects.

**Service cards (job-type chips, used after the crane picker):** Installing and removing power poles; Relocation and maintenance support; Securing poles for underground work; Pole transport. Keep the short published blurbs from `wireframe.html`.

**About heading / copy:** A Proline crane and borer, mounted on a Scania / RPL Crane Services has been operating for 14 years. The crane and borer service we provide specialises in removing and installing power poles. / Then the published machine specs and the licensed-operators paragraph in §5, typo-corrected.

**Contact:** RPL Crane Services Pty Ltd · Padstow NSW, next to the M5 · 0418 672 546 · admin@rplcraneservices.com.au · Contract licence N-0371621/1 · Insurance: High Risk HRW 068323 · 24-hour service, six days a week (not Sunday). No street address, no ABN, no bank details, no map.

**Footer:** © 2026 RPL Crane Services Pty Ltd

No reviews block.

**Quote form** (in-page only, must not email the business): the same one-card picker as booking, then Name, Phone, Email, Suburb or address, a short description of the work, preferred time to talk. Submit: Request a quote. Honest in-page success only. Rewrite the wireframe walkthrough so it does not promise emails, calendars, or “you stay on this page,” and drop “There is no online price” and “This preview form does not send.”

---

## 6. Photographs (each used once)

Prefer the `.webp`; keep the `.jpg` as fallback. Native widths only — do not invent megapixel masters. Tiny thumbs in the production `source/` folder are not used. The CSS `:target` lightbox shows the larger derivative of a gallery image and does not count as a second use.

`hero-*` and `crane-side-*` are the **same photograph** (the branded truck side, from the same source file). Use it once as the hero, and the one-card picker may show that same machine photo (Liftrite does this). **Do not also put `crane-side-*` in the gallery.**

| Asset | Use once as |
|---|---|
| `hero-480` / `hero-600` | Home hero only — branded truck side |
| `crane-side-480` / `-600` | One-card picker only (same photo as the hero — not in the gallery) |
| `crane-pole-480` / `-600` | Gallery — truck carrying a pole |
| `crane-front-480` / `-600` | Gallery — front of the truck |
| `crane-yard-400` | Gallery — crane in the yard |
| `crane-auger-300` | Gallery — borer |
| `crane-cabin-300` | Gallery — cabin |

No stock, no empty panels, no “Your photo here” slots (real photographs of the truck were available).

---

## 7. Booking widget — Liftrite one-card crane picker, then date chips

Director’s job card: RPL uses the Liftrite one-card crane picker. That picker is **not a replacement that drops the date row**; it sits **ahead of** the date chips and time pills, as in Liftrite and in this pack’s own `wireframe.html` `#book` section.

**Definition of the Liftrite pattern**, from:

- `/workspace/crom/projects/crom-desk/02-working/production/outbound-spec-sites-2026-11-10/liftrite-crane-hire/wireframe.md` §10: “The booking control is a modern widget, not dropdowns or a native date field: **crane picker cards first**, then a scrollable row of day chips, then [time] pills, then name, phone, email, site address, what needs lifting, weight if known, and access notes.” It is “the same shape as the OJJM Hire hire-booking pattern (equipment first, then the hire period, then the job details), adapted to [the] real cranes and to a booking request rather than a cart.”
- The same pack’s `wireframe.html` `#book` (`.crane-pick` / `button.pick` cards with a photo, name, and published specs, then `.day-chips`, then `.time-pills`).
- Live read-only example: https://cromservices.github.io/liftrite-crane-hire-preview/ (do not edit that repo).

**RPL adaptation**, from this pack’s `wireframe.md` and `research-notes.md`: “The crane picker is reused from the Liftrite Crane Hire pack, with **one card only**: the Proline crane and borer mounted on a Scania, and only the specs published on About (5/10 ton, licensed up to 60 ton, borer to 3.6 m, augers 250–600 mm). A second machine is not invented.”

Required “Book a lift” shape on Home:

1. **One picker card**, already selected (it is the only machine): photo `crane-side-480`, heading “Proline crane and borer on a Scania”, published specs only: “5/10 ton continuous slewing crane, licensed up to 60 ton. Borer drills up to 3.6 m. Standard augers 250–600 mm.” No second card, no invented fleet.
2. Then **14 date chips** for the next 14 calendar days in **Australia/Sydney**. **Weekends disabled** (the live site is closed Sunday; Saturday is also not selectable under the shared date-chip standard). Do not invent clock opening hours. The published 24-hour / six-day (except Sunday) line may appear in the help text.
3. Time-window pills: **Morning, Midday, Afternoon** (not the wireframe’s “Either”).
4. Optional job-type chips from the four service labels in §5.
5. A summary line of the plant, day, window, and job type.
6. Name, phone, (email,) and a customer site-address field, plus what needs doing.
7. A **full-width Book** button (label: Book a lift / Request this lift).
8. A **success state** that only restates the saved summary. No step copy that promises emails or calendars, or says “you’ll stay on this page.” No “This form does not send.”

Safe help line, trimmed: “Pick the plant, a day and a time window, then tell us about the site. This holds a lift or a call. The job is confirmed once we reply. The minimum job period is 4 hours.” You may add that they publish 24-hour service six days a week, except Sunday. Do not invent a night-rate figure.

---

## 8. Verification to return

Save 1440 and 390 shots, light and dark, plus a booking success state (showing the one-card picker) and a lightbox-open shot, under the parent’s proof folder (`…/coder2/outbound-spec-sites-2026-11-10/rpl-crane-services/`), and as cloud-agent artifacts, with MD5SUMS. Compose `proofs/before-after-desktop.png` and `proofs/before-after-mobile.png`, and keep the existing logo before/after ready for a public URL.

Return:

- [ ] Repo URL, branch, and head SHA. Pages URL, HTTP 200, logged-out curl shows `<meta name="robots" content="noindex">`.
- [ ] Refreshed logo in the header.
- [ ] Theme button at the right of the nav, `aria-label="Switch light/dark"`, defaults to system. Shots of light and dark at 1440 and 390.
- [ ] Sticky header; at 390 the Call | Request a quote bar is one line.
- [ ] CSS `:target` big-image lightbox on the gallery; each photograph used once as in §6 (hero and picker may share the side shot; that shot is not also in the gallery).
- [ ] Booking: one-card Liftrite picker (Proline on a Scania, published specs only, no second crane), then 14 day chips, weekends disabled, Morning/Midday/Afternoon, summary line, full-width Book, success state. No email/calendar/“you’ll stay on this page” / “does not send” copy.
- [ ] Visible-text scan (L-103 / L-101): no builder notes, no sample/demo/template wording, no pricing, no street address, no ABN, **no BSB or account number**, no invented reviews or second crane, no bots/AI.
- [ ] No email was sent to the business.
