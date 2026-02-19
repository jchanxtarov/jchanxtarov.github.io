# Ryotaro Shimizu — Personal Academic Website

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
└── README.md           # This file
```

## Tech Stack

- **Vue.js 3** (CDN, no build step required)
- **CSS Custom Properties** for theming (light/dark mode)
- **Semantic Scholar API** for real-time citation counts
- **ClustrMaps** for visitor tracking map
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
- **HTML Structure Tests**: Validates proper HTML structure, meta tags, and sections
- **CSS Tests**: Checks for CSS variables, dark mode support, and responsive design
- **Navigation Tests**: Verifies navigation bar, menu items, and language/theme toggles
- **Hero Section Tests**: Validates hero section content and social links
- **Section Structure Tests**: Ensures all required sections exist (About, Publications, Talks, etc.)
- **Logo Tests**: Verifies logo files and styling (including Waseda logo dark mode fix)
- **Image Tests**: Checks image paths, lazy loading, and alt text
- **JavaScript Tests**: Validates Vue.js setup and data structures
- **Data Integrity Tests**: Ensures all publications, talks, and media have required fields
- **Translation Tests**: Verifies both English and Japanese translations
- **Accessibility Tests**: Checks for proper semantic HTML and ARIA labels
- **Responsive Design Tests**: Validates mobile-friendly design
- **Performance Tests**: Checks for lazy loading and secure external links

### Browser Tests

Open `tests/test.html` in a browser to run interactive tests with visual results.

### Git Hooks

Automated tests run before each push to prevent broken code:

```bash
# Install git hooks
npm run install-hooks

# Or manually:
bash scripts/install-hooks.sh
```

Once installed, tests will automatically run before every `git push`. To bypass (not recommended):

```bash
git push --no-verify
```

### Continuous Integration

Tests also run automatically on GitHub Actions for all pushes and pull requests. See `.github/workflows/test.yml` for configuration.

## Deploying to GitHub Pages

### Method 1: Deploy from root of `main` branch

1. Push all files to the `main` branch of your GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit: personal academic website"
git branch -M main
git remote add origin https://github.com/jchanxtarov/taro_web.git
git push -u origin main
```

2. Go to **Settings > Pages** in your GitHub repository.
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**
4. Click **Save**.
5. Your site will be live at: `https://jchanxtarov.github.io/taro_web/`

### Method 2: Custom domain (optional)

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

Replace or add your profile photo in `pics/` and update the `hero-bg` image path in `index.html` (line ~64).

### Google Analytics

Uncomment the GA4 block in `index.html` `<head>` and replace `GA_MEASUREMENT_ID` with your actual Google Analytics Measurement ID.

### ClustrMaps

The current site uses ClustrMaps ID `1bv7x`. To change it, update the `src` attribute of the ClustrMaps script tag in the footer of `index.html`.

## Features

- **Bilingual** (English / Japanese) toggle
- **Dark/Light** theme toggle (respects system preference)
- **Real-time citation counts** via Semantic Scholar API
- **Publication filtering** by type (Conference / Journal / Workshop / Domestic)
- **Show more/less** publications (top 5 by default)
- **Scroll animations** via Intersection Observer
- **Responsive** design (mobile, tablet, desktop)
- **ClustrMaps** visitor tracking map
- **SEO** optimized (JSON-LD structured data, Open Graph tags)
