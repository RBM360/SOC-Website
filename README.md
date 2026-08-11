# SOC Campus Ministry Website

A simple static site for SOC Campus Ministry, a Christian campus ministry at Tennessee Tech connected with Sycamore Church of Christ.

## Pages

- `index.html`: Home page with hero, upcoming events, Instagram, and gallery sections.
- `activities.html`: Fall semester calendar and activity posters.
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

You can also open `index.html` directly in a browser. No build step is required.

## Validate Before Deploying

Run:

```bash
npm run validate
```

This checks the static site for missing local files, broken local image/script/CSS
references, required mobile viewport tags, and the required `index.html` entry
page.

## Deployment

This is a static website. There is no backend, database, build step, or required
environment variable.

To deploy, publish the repository root as the web root. The host should serve
`index.html` from the root directory, with these folders kept alongside it:

- `assets/`
- `scripts/`
- `styles/`

Good hosting options include GitHub Pages, Netlify, Cloudflare Pages, Vercel
static hosting, or any web server that can serve static HTML/CSS/JS files.

For GitHub Pages:

1. Push the repo to GitHub.
2. In the repository settings, enable Pages.
3. Set the source to the main branch and the repository root.

For Netlify or Cloudflare Pages:

- Build command: leave blank, or use `npm run validate` if the host supports a
  validation step.
- Publish directory: `.`

For a traditional server:

- Upload the repository contents to the public web root.
- No Node process is required in production.
