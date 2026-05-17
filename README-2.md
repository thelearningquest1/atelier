# Atelier — Capsule Wardrobe Guide

A self-contained web app to help you build a classic, timeless capsule wardrobe with the right material compositions for longevity.

## What it does

Five tools in one app:

1. **The Fabric Check** — paste a label composition in the shop, get an instant verdict on whether to buy
2. **Material Atlas** — what to look for in t-shirts, jeans, blazers, coats, knitwear, shirts, dresses, skirts and trousers
3. **The Four-Season Capsule** — every piece you need for Foundation / Spring / Summer / Autumn / Winter, with material specs
4. **Wardrobe Inventory** — tick what you own, see your progress, saves automatically
5. **The Rules of Acquiring** — how to shop the capsule without breaking it (or your budget)

## How to host on GitHub Pages

1. Go to [github.com](https://github.com) and click **New repository**
2. Name it something like `atelier` (anything works) — make it **public**
3. Upload all five files at once: `index.html`, `styles.css`, `app.js`, `data.js`, `README.md`
4. Commit
5. Go to **Settings → Pages**
6. Under **Source**, choose **Deploy from a branch** → **main** → **/(root)**
7. Save. Wait 1–2 minutes
8. Your app will be live at `https://[your-username].github.io/[repo-name]/`

## Add to phone home screen

**iPhone (Safari):** open the URL → tap Share → "Add to Home Screen"
**Android (Chrome):** open the URL → menu → "Add to Home screen"

It will open like a real app, work offline once loaded, and remember your checklist.

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure and tabs |
| `styles.css` | Editorial / Parisian visual design |
| `data.js` | All material rules, capsule items, shopping rules |
| `app.js` | Interactive logic, fabric analyser, checklist |

## To edit the data

Open `data.js`. Everything is there:
- Add a new garment type to `MATERIAL_GUIDES`
- Add/edit capsule items in `CAPSULE` (under each season)
- Add a shopping rule in `RULES`

No build step. Just edit and re-upload.
