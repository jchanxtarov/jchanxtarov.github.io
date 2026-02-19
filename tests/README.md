# Testing Setup Guide

This document explains the testing infrastructure for the Ryotaro Shimizu personal website.

## Overview

The project includes a comprehensive automated testing system that validates:
- HTML structure and content
- CSS styling and theming
- JavaScript functionality
- Data integrity
- Accessibility
- Performance optimizations

## Test Files

### 1. `tests/test.html`
Interactive browser-based test suite that can be opened directly in a browser.

**Usage:**
```bash
open tests/test.html
```

**Features:**
- Visual test results with pass/fail indicators
- Categorized test sections
- Detailed error messages
- Pass rate statistics

### 2. `tests/run-tests.js`
Node.js-based automated test runner for command-line execution.

**Usage:**
```bash
node tests/run-tests.js
# Or use npm:
npm test
```

**Features:**
- Colored console output
- File structure validation
- Content verification
- Exit codes for CI/CD integration

## Automated Testing with Git Hooks

### Pre-Push Hook

The pre-push hook automatically runs tests before each `git push` to prevent broken code from being pushed.

**Installation:**
```bash
# Automatic (runs on npm install)
npm install

# Manual
bash scripts/install-hooks.sh
```

**What it does:**
1. Runs the full test suite before pushing
2. Blocks the push if tests fail
3. Shows detailed error messages
4. Can be bypassed with `--no-verify` flag (not recommended)

**Location:**
- Source: `.githooks/pre-push`
- Installed to: `.git/hooks/pre-push`

## Continuous Integration with GitHub Actions

### Workflow Configuration

File: `.github/workflows/test.yml`

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to these branches

**What it does:**
1. Checks out the repository
2. Sets up Node.js environment
3. Runs the test suite
4. Reports results in the Actions tab

**Viewing Results:**
1. Go to the "Actions" tab in your GitHub repository
2. Click on the latest workflow run
3. View test results and logs

## Test Categories

### HTML Structure Tests
- DOCTYPE validation
- Meta tags (viewport, description, Open Graph)
- Title tag
- Section structure

### CSS Tests
- CSS variables (`:root`)
- Dark mode support (`[data-theme="dark"]`)
- Timeline logo styling
- Responsive design media queries

### Navigation Tests
- Navigation bar presence
- Logo and menu items
- Language toggle
- Theme toggle
- Mobile menu

### Hero Section Tests
- Background image
- Name display (English and Japanese)
- Job title
- Social links (external links with proper attributes)

### Section Structure Tests
Validates the presence of all main sections:
- About
- Publications
- Talks
- Experience
- Education
- Teaching
- Awards
- Media
- Service
- Projects

### Logo Tests
- Logo file existence
- Timeline logo styling
- Dark mode visibility fix (background color)

### Image Tests
- Image paths
- Lazy loading attributes
- Alt text
- Background images

### JavaScript Tests
- Vue.js loading
- Data structures (TRANSLATIONS, PUBLICATIONS, TALKS, MEDIA)
- Both language versions

### Data Integrity Tests
- Required fields in publications
- Required fields in talks
- Required fields in media items

### Translation Tests
- "Non-Research Projects" title verification
- Navigation translation keys
- Both English and Japanese versions

### Accessibility Tests
- Main landmark
- Footer
- ARIA labels
- Section IDs

### Responsive Design Tests
- Viewport meta tag
- Mobile menu structure

### Performance Tests
- Image lazy loading
- External link security (rel="noopener")
- Favicon presence

### Content Tests
- Timeline dates
- Project card structure
- Copyright year

## Writing New Tests

### For `run-tests.js` (Node.js)

```javascript
// Add a new test
if (assert(condition, 'Error message if failed')) {
  log('  ✓ Test passed', 'green');
} else {
  log('  ✗ Test failed', 'red');
}
```

### For `test.html` (Browser)

```javascript
// Add a new test
test('Test name', () => {
  const element = document.querySelector('.my-element');
  assertExists(element, 'Element should exist');
  assertEquals(element.textContent, 'Expected text', 'Text should match');
});
```

## Troubleshooting

### Tests fail locally but pass in CI
- Ensure you're running tests from the project root
- Check that all files are committed

### Tests pass locally but fail in CI
- Check file paths (case sensitivity on Linux)
- Verify all dependencies are available

### Pre-push hook doesn't run
- Reinstall hooks: `npm run install-hooks`
- Check permissions: `chmod +x .githooks/pre-push`

### Bypassing tests (not recommended)
```bash
git push --no-verify
```

## Best Practices

1. **Run tests before committing**
   ```bash
   npm test
   ```

2. **Fix failing tests immediately**
   - Don't bypass tests with `--no-verify`
   - Address root cause of failures

3. **Update tests when adding features**
   - Add corresponding tests for new sections
   - Verify data structure changes

4. **Review CI results**
   - Check Actions tab after pushing
   - Fix any failures before merging PRs

## Maintenance

### Updating Test Suite

When making significant changes to the website:

1. Update test assertions in `run-tests.js`
2. Update browser tests in `test.html`
3. Run tests locally to verify
4. Commit test changes with feature changes

### Performance Monitoring

The test suite provides basic performance checks:
- Image lazy loading
- External link security
- Favicon presence

For more comprehensive performance testing, consider tools like:
- Lighthouse (Chrome DevTools)
- WebPageTest
- Google PageSpeed Insights

## Support

If you encounter issues with the test suite:

1. Check this documentation
2. Review test output for specific error messages
3. Verify file structure matches expectations
4. Ensure all dependencies are installed

## Future Enhancements

Potential improvements to the test suite:
- Visual regression testing
- Performance benchmarking
- Link checking (verify external URLs)
- Accessibility audit with axe-core
- Screenshot comparisons
- Load time measurements
