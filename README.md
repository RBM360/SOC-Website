# SOC Campus Ministry Website

A simple static site for SOC Campus Ministry, a Christian campus ministry at Tennessee Tech connected with Sycamore Church of Christ.

## Pages

- `index.html`: Home page with hero, upcoming events, Instagram, and gallery sections.
- `activities.html`: Fall semester calendar page.
- `trips.html`: Retreats, field trips, camps, and other off-campus memories.
- `gallery.html`: Full photo collection from SOC photos and trips.
- `about.html`: Ministry background, mission copy, and SOC poster.
- `contact.html`: Campus minister introduction and links for getting connected.
- `excursions.html`: Redirects to `trips.html` so old links do not break.
- `projects.html`: Redirects to `trips.html` so old links do not break.

## Assets

- Put homepage photos in `assets/images`.
- Put upcoming activity flyers in `assets/flyers`.
- Put retreat, camp, and field trip photos in `assets/Trips`.
- Put web-ready display images in `assets/optimized`.
- The club logo is `assets/Logo.jpg`.

## Preview

Run:

```bash
npm run dev
```

Then open `http://localhost:5173`.

If that port is already busy, the dev server will automatically choose the next
open port and print the exact URL.

To test from a phone on the same Wi-Fi, run:

```bash
npm run dev -- --host 0.0.0.0
```

The dev server will print both the local computer URL and the reachable network
URL for your phone.

You can also open `index.html` directly in a browser. No build step is required.

## Validate Before Deploying

Run:

```bash
npm run validate
```

This checks the static site for missing local files, broken local image/script/CSS
references, required mobile viewport tags, image alt text, safe external-link
attributes, required security headers, and the required `index.html` entry page.

Also run this before pushing:

```bash
git diff --check
```

That catches accidental trailing whitespace and other easy-to-miss formatting
issues.

## Deployment

This is a static website. There is no backend, database, build step, or required
environment variable.

To deploy, publish the repository root as the web root. The host should serve
`index.html` from the root directory, with these folders kept alongside it:

- `assets/`
- `scripts/`
- `styles/`
- `_headers`

Good hosting options include GitHub Pages, Netlify, Cloudflare Pages, Vercel
static hosting, or any web server that can serve static HTML/CSS/JS files.

The `_headers` file contains security headers for static hosts that support the
Netlify/Cloudflare Pages style header format. If the chosen host does not read
`_headers`, configure equivalent headers in that host's dashboard or server
config:

- `Content-Security-Policy`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy`
- `Strict-Transport-Security`

Keep HTTPS enabled. The Instagram embed and Google Fonts require outbound access
to their HTTPS domains.

For GitHub Pages:

1. Push the repo to GitHub.
2. In the repository settings, enable Pages.
3. Set the source to the main branch and the repository root.

For Netlify or Cloudflare Pages:

- Build command: leave blank, or use `npm run validate` if the host supports a
  validation step.
- Publish directory: `.`
- Keep the `_headers` file in the published root.

For a traditional server:

- Upload the repository contents to the public web root.
- No Node process is required in production.
- Configure the same security headers listed above in the web server.

## Semester Update Checklist

When the next semester schedule is ready:

1. Replace or add the new flyer image in `assets/flyers`.
2. Update the visible calendar cards in `activities.html`.
3. Update matching event data in `scripts/site.js` so homepage previews and
   `.ics` calendar files stay correct.
4. Run `npm run validate`. This regenerates the read-only calendar subscription
   files in `assets/calendars`.
5. Open the site locally with `npm run dev` and spot-check Home, Calendar,
   Trips, About, Contact, and Gallery on desktop and mobile widths.

Use `assets/optimized` for display photos when possible. Photos can be cropped
with `object-fit: cover` in framed cards, but flyers, calendars, and coordinator
graphics should use `object-fit: contain` so they are never stretched or cut off.

The semester calendar is published as a read-only subscribed calendar. Students
can subscribe from their calendar app, but they cannot edit the website's source
events. If they change or copy an event locally, that only affects their own
device. To update everyone, edit the website event data, run `npm run validate`,
and redeploy the updated `assets/calendars` files.
