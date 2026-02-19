# Ryotaro Shimizu — Personal Academic Website

Live site: **https://jchanxtarov.github.io/**

## Project Structure

```
taro_web/
├── index.html          # Main page (Vue 3 template)
├── style.css           # Global styles
├── js/
│   ├── app.js          # Vue 3 application logic
│   └── data.js         # Publications, translations, talks, media data
├── pics/               # Photos (profile, talks, projects)
├── docs/               # CV, Resume PDFs
├── scripts/            # Build & hook scripts
├── tests/              # Test suite
├── .github/workflows/  # GitHub Actions CI
├── .githooks/          # Git hook scripts (pre-push)
└── README.md           # This file
```

## Tech Stack

- **Vue.js 3** (CDN, no build step required)
- **CSS Custom Properties** for theming (light/dark mode)
- **Semantic Scholar API** for real-time citation counts
- **MapMyVisitors (ClustrMaps)** for visitor tracking map
- **Font Awesome 6** for icons
- **Inter** (Google Fonts) for typography

## Local Development

No build step is required. Simply open `index.html` in a browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server (recommended for API calls)
python3 -m http.server 8000
# Or use npm script:
npm run serve
# Then visit http://localhost:8000
```

Using a local server is recommended because the Semantic Scholar API requires CORS-compatible requests.

## Testing

This project includes a comprehensive test suite to ensure code quality and functionality.

### Running Tests

```bash
# Run all tests
npm test

# Or run directly with Node.js
node tests/run-tests.js
```

### Test Coverage

The test suite includes:
- **File Structure Tests**: Validates required files and directory structure
- **HTML Structure Tests**: Validates proper HTML structure, meta tags, and sections
- **CSS Tests**: Checks for CSS variables, dark mode support, and responsive design
- **JavaScript Tests**: Validates Vue.js setup and data structures
- **Image Reference Tests**: Checks all referenced images exist on disk
- **Publication Sorting Tests**: Ensures same-venue/same-date publications are grouped correctly
- **Translation Completeness Tests**: Verifies EN/JA key parity and critical section titles

### Git Hooks (Pre-push)

Tests run automatically before every `git push` via a pre-push hook:

```bash
# Install git hooks (also runs automatically via npm postinstall)
npm run install-hooks

# Or manually:
bash scripts/install-hooks.sh
```

Once installed, `git push` will first run the test suite. If any test fails, the push is aborted. To bypass (not recommended):

```bash
git push --no-verify
```

### Continuous Integration (GitHub Actions)

Tests also run on GitHub Actions for all pushes and pull requests to `main`/`master`/`develop`. See `.github/workflows/test.yml`.

## Deployment

This site is deployed on **GitHub Pages** from the `main` branch.

### Initial Setup (already done)

```bash
# 1. Install GitHub CLI
brew install gh

# 2. Authenticate (with workflow scope for GitHub Actions)
gh auth login --hostname github.com --git-protocol https --web
gh auth refresh -h github.com -s workflow

# 3. Initialize repo and push
git init
git add .
git commit -m "Initial commit: personal academic website"
git branch -M main
gh repo create jchanxtarov/jchanxtarov.github.io --public --source=. --push \
  --description "Personal academic website for Ryotaro Shimizu"

# 4. GitHub Pages is automatically enabled for <username>.github.io repos

# 5. Install pre-push test hook
npm run install-hooks
```

### Updating the Site

```bash
# Edit files, then:
git add <changed-files>
git commit -m "Description of changes"
git push origin main
# Tests run automatically before push; site updates within ~1 minute after push
```

### Custom Domain (optional)

1. Add a `CNAME` file in the root with your custom domain:
   ```
   yourdomain.com
   ```
2. Configure DNS settings at your domain registrar.

## Customization Guide

### Adding/Editing Publications

Edit `js/data.js` — the `PUBLICATIONS` array. Each entry:

```javascript
{
  title: "Paper Title",
  authors: ["Author 1", "Ryotaro Shimizu", "Author 3"],
  venue: "Conference/Journal Name",
  year: 2025,
  date: "Jul 2025",  // "Mon YYYY" format for month-level sorting
  type: "conference",  // "conference" | "journal" | "workshop" | "domestic"
  citations: 0,        // Updated automatically via Semantic Scholar API
  links: { paper: "https://..." }
}
```

### Adding Talks

Edit the `TALKS` array in `js/data.js`.

### Editing Translations

Edit the `TRANSLATIONS` object in `js/data.js`. Both `en` and `ja` keys must be updated.

### Profile Photo

Replace or add your profile photo in `pics/` and update the `hero-bg` image path in `index.html`.

### Google Analytics

Uncomment the GA4 block in `index.html` `<head>` and replace `GA_MEASUREMENT_ID` with your actual Google Analytics Measurement ID.

### Visitor Tracking (MapMyVisitors)

The visitor map widget is embedded in the footer of `index.html`. Statistics are available at:
https://mapmyvisitors.com/web/1c2n5

To change the widget, update the `src` attribute of the `#mapmyvisitors` script tag in the footer.

## Features

- **Bilingual** (English / Japanese) toggle
- **Dark/Light** theme toggle (respects system preference)
- **Real-time citation counts** via Semantic Scholar API
- **Publication filtering** by type (Conference / Journal / Workshop / Domestic)
- **Publication sorting** by date with month-level granularity
- **Show more/less** for publications, talks, awards, media, and news
- **Scroll animations** via Intersection Observer
- **Responsive** design (mobile, tablet, desktop)
- **Visitor tracking map** via MapMyVisitors
- **SEO** optimized (JSON-LD structured data, Open Graph tags)
- **Automated testing** via pre-push hook and GitHub Actions CI
