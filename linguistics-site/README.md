# Linguistics I site

Static site (HTML + CSS + JS, no build step) for GitHub Pages.

## Publish
1. Create a public repo on GitHub (e.g. `linguistics-i`).
2. Upload everything in this folder to the root of the repo (or `git push`).
3. Repo **Settings > Pages > Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`.
4. The site goes live at `https://USERNAME.github.io/linguistics-i/` in a minute or two.

## Before submitting
- Replace `STUDENT NAME` in the footer of every page (search the project for it).
- Replace every "My notes" prompt and the reflection page with her own writing.
- Fill or delete the dashed "Add an image / Add a podcast" slots.

## Add a new unit
1. Copy `unit-template.html` and rename it (e.g. `phonology.html`).
2. Add it to the `<nav>` on every page and as a card in `index.html`.
3. Put images in `assets/`.

## Files
- `index.html` home, `semantics.html` Unit 6, `pragmatics.html` Unit 7, `variation.html` language variation, `presentations.html` three group presentations and the research report, `portfolio.html` linguistic analysis portfolio, `reflection.html`
- `assets/slides/` slide images for the presentations page
- `assets/portfolio/` source images for the portfolio
- `assets/morphology-report.pdf` the full research report
- `css/style.css` all styles; colors are the variables at the top
- `js/main.js` word flip, entailment quiz, switchers, spelling switch, slide galleries
