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
