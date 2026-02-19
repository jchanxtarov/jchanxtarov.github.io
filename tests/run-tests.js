#!/usr/bin/env node

/**
 * Automated Test Runner for Ryotaro Shimizu Website
 * This script runs all tests and reports results
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failedTestDetails = [];

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    return true;
  } else {
    failedTests++;
    failedTestDetails.push(message);
    return false;
  }
}

function testFileStructure() {
  log('\n📁 Testing File Structure...', 'cyan');
  
  const requiredFiles = [
    'index.html',
    'style.css',
    'js/app.js',
    'js/data.js',
    'README.md'
  ];

  requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, '..', file));
    if (assert(exists, `File should exist: ${file}`)) {
      log(`  ✓ ${file} exists`, 'green');
    } else {
      log(`  ✗ ${file} is missing`, 'red');
    }
  });
}

function testDataFolder() {
  log('\n📊 Testing Data Folder...', 'cyan');
  
  const dataPath = path.join(__dirname, '..', 'data');
  const exists = fs.existsSync(dataPath);
  
  if (assert(exists, 'Data folder should exist')) {
    log('  ✓ Data folder exists', 'green');
    
    const csvFiles = fs.readdirSync(dataPath).filter(f => f.endsWith('.csv'));
    if (assert(csvFiles.length > 0, 'Data folder should contain CSV files')) {
      log(`  ✓ Found ${csvFiles.length} CSV files`, 'green');
    } else {
      log('  ✗ No CSV files found in data folder', 'red');
    }
  } else {
    log('  ✗ Data folder is missing', 'red');
  }
}

function testPicsFolder() {
  log('\n🖼️  Testing Pics Folder...', 'cyan');
  
  const picsPath = path.join(__dirname, '..', 'pics');
  const exists = fs.existsSync(picsPath);
  
  if (assert(exists, 'Pics folder should exist')) {
    log('  ✓ Pics folder exists', 'green');
    
    // Check for logos subfolder
    const logosPath = path.join(picsPath, 'logos');
    if (assert(fs.existsSync(logosPath), 'Logos subfolder should exist')) {
      log('  ✓ Logos subfolder exists', 'green');
      
      const requiredLogos = ['waseda.png', 'zozo.png', 'sophia.png'];
      requiredLogos.forEach(logo => {
        const logoPath = path.join(logosPath, logo);
        if (assert(fs.existsSync(logoPath), `Logo should exist: ${logo}`)) {
          log(`    ✓ ${logo} exists`, 'green');
        } else {
          log(`    ✗ ${logo} is missing`, 'red');
        }
      });
    } else {
      log('  ✗ Logos subfolder is missing', 'red');
    }
  } else {
    log('  ✗ Pics folder is missing', 'red');
  }
}

function testHTMLContent() {
  log('\n📄 Testing HTML Content...', 'cyan');
  
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Test DOCTYPE
  if (assert(html.includes('<!DOCTYPE html>'), 'HTML should have DOCTYPE')) {
    log('  ✓ DOCTYPE is present', 'green');
  } else {
    log('  ✗ DOCTYPE is missing', 'red');
  }
  
  // Test meta tags
  if (assert(html.includes('<meta name="viewport"'), 'HTML should have viewport meta tag')) {
    log('  ✓ Viewport meta tag is present', 'green');
  } else {
    log('  ✗ Viewport meta tag is missing', 'red');
  }
  
  if (assert(html.includes('<meta name="description"'), 'HTML should have description meta tag')) {
    log('  ✓ Description meta tag is present', 'green');
  } else {
    log('  ✗ Description meta tag is missing', 'red');
  }
  
  // Test sections
  const sections = ['about', 'publications', 'talks', 'experience', 'education', 'teaching', 'awards', 'media', 'service', 'projects'];
  sections.forEach(section => {
    if (assert(html.includes(`id="${section}"`), `HTML should have ${section} section`)) {
      log(`  ✓ Section "${section}" is present`, 'green');
    } else {
      log(`  ✗ Section "${section}" is missing`, 'red');
    }
  });
  
  // Test Vue.js
  if (assert(html.includes('Vue') || html.includes('vue'), 'HTML should include Vue.js')) {
    log('  ✓ Vue.js is included', 'green');
  } else {
    log('  ✗ Vue.js is not included', 'red');
  }
  
  // Test logo images use correct path
  const wasedaLogoMatches = html.match(/pics\/logos\/waseda\.png/g);
  if (assert(wasedaLogoMatches && wasedaLogoMatches.length > 0, 'HTML should reference Waseda logo')) {
    log(`  ✓ Waseda logo is referenced ${wasedaLogoMatches.length} times`, 'green');
  } else {
    log('  ✗ Waseda logo is not referenced', 'red');
  }
}

function testCSSContent() {
  log('\n🎨 Testing CSS Content...', 'cyan');
  
  const cssPath = path.join(__dirname, '..', 'style.css');
  const css = fs.readFileSync(cssPath, 'utf-8');
  
  // Test CSS variables
  if (assert(css.includes(':root'), 'CSS should define root variables')) {
    log('  ✓ Root CSS variables are defined', 'green');
  } else {
    log('  ✗ Root CSS variables are missing', 'red');
  }
  
  // Test dark mode
  if (assert(css.includes('[data-theme="dark"]'), 'CSS should support dark mode')) {
    log('  ✓ Dark mode styles are present', 'green');
  } else {
    log('  ✗ Dark mode styles are missing', 'red');
  }
  
  // Test timeline logo styling
  if (assert(css.includes('.timeline-logo'), 'CSS should style timeline logos')) {
    log('  ✓ Timeline logo styles are present', 'green');
    
    // Check for background color fix
    const logoStyles = css.match(/\.timeline-logo\s*{[^}]*}/s);
    if (logoStyles) {
      const hasBackground = logoStyles[0].includes('background');
      if (assert(hasBackground, 'Timeline logo should have background style for dark mode visibility')) {
        log('  ✓ Timeline logo has background style', 'green');
      } else {
        log('  ⚠ Timeline logo might not be visible in dark mode', 'yellow');
      }
    }
  } else {
    log('  ✗ Timeline logo styles are missing', 'red');
  }
  
  // Test responsive design
  if (assert(css.includes('@media'), 'CSS should include media queries for responsive design')) {
    log('  ✓ Responsive design media queries are present', 'green');
  } else {
    log('  ✗ Responsive design media queries are missing', 'red');
  }
}

function testJavaScriptContent() {
  log('\n⚙️  Testing JavaScript Content...', 'cyan');
  
  const dataPath = path.join(__dirname, '..', 'js', 'data.js');
  const data = fs.readFileSync(dataPath, 'utf-8');
  
  // Test data structures
  if (assert(data.includes('TRANSLATIONS'), 'data.js should define TRANSLATIONS')) {
    log('  ✓ TRANSLATIONS is defined', 'green');
  } else {
    log('  ✗ TRANSLATIONS is not defined', 'red');
  }
  
  if (assert(data.includes('PUBLICATIONS'), 'data.js should define PUBLICATIONS')) {
    log('  ✓ PUBLICATIONS is defined', 'green');
  } else {
    log('  ✗ PUBLICATIONS is not defined', 'red');
  }
  
  if (assert(data.includes('TALKS'), 'data.js should define TALKS')) {
    log('  ✓ TALKS is defined', 'green');
  } else {
    log('  ✗ TALKS is not defined', 'red');
  }
  
  if (assert(data.includes('MEDIA'), 'data.js should define MEDIA')) {
    log('  ✓ MEDIA is defined', 'green');
  } else {
    log('  ✗ MEDIA is not defined', 'red');
  }
  
  // Test for "Non-Research Projects"
  const projectsTitleMatch = data.match(/"projects\.title":\s*"([^"]+)"/g);
  if (projectsTitleMatch) {
    const hasNonResearch = projectsTitleMatch.some(match => 
      match.includes('Non-Research Project')
    );
    if (assert(hasNonResearch, 'Projects title should be "Non-Research Projects"')) {
      log('  ✓ Projects title is "Non-Research Projects"', 'green');
    } else {
      log('  ✗ Projects title is not updated to "Non-Research Projects"', 'red');
    }
  }
  
  // Test app.js
  const appPath = path.join(__dirname, '..', 'js', 'app.js');
  const app = fs.readFileSync(appPath, 'utf-8');
  
  if (assert(app.includes('createApp'), 'app.js should create Vue app')) {
    log('  ✓ Vue app is created in app.js', 'green');
  } else {
    log('  ✗ Vue app creation is missing in app.js', 'red');
  }
  
  if (assert(app.includes('localStorage'), 'app.js should use localStorage for preferences')) {
    log('  ✓ localStorage is used for user preferences', 'green');
  } else {
    log('  ✗ localStorage is not used', 'red');
  }
}

function loadDataFile() {
  const vm = require('vm');
  const dataPath = path.join(__dirname, '..', 'js', 'data.js');
  const dataContent = fs.readFileSync(dataPath, 'utf-8');
  // Replace const/let declarations with var so they become sandbox properties
  const execContent = dataContent.replace(/^(const|let)\s+/gm, 'var ');
  const sandbox = {};
  vm.runInNewContext(execContent, sandbox);
  return sandbox;
}

function testPublicationSorting() {
  log('\n📚 Testing Publication Sorting...', 'cyan');

  const sandbox = loadDataFile();
  const pubs = sandbox.PUBLICATIONS;
  if (!assert(Array.isArray(pubs) && pubs.length > 0, 'PUBLICATIONS should be a non-empty array')) {
    log('  ✗ PUBLICATIONS is missing or empty', 'red');
    return;
  }
  log(`  ✓ Found ${pubs.length} publications`, 'green');

  // Test: every publication with a date field must have a valid "Mon YYYY" format
  const VALID_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const invalidDates = pubs.filter(p => {
    if (!p.date) return false; // date is optional (year-only is allowed)
    const parts = p.date.split(' ');
    return parts.length !== 2 || !VALID_MONTHS.includes(parts[0]) || isNaN(Number(parts[1]));
  });
  if (assert(invalidDates.length === 0, 'All publication dates should be in "Mon YYYY" format')) {
    log('  ✓ All date fields are valid', 'green');
  } else {
    invalidDates.forEach(p => log(`    ✗ Invalid date "${p.date}" in: ${p.title.slice(0,50)}`, 'red'));
  }

  // Test: sorting by newest should group same-venue same-date publications together
  const MONTH_ORDER = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  function sortKey(p) {
    if (p.date) {
      const parts = p.date.split(' ');
      if (parts.length === 2 && MONTH_ORDER[parts[0]] !== undefined) {
        return p.year * 12 + MONTH_ORDER[parts[0]];
      }
    }
    return p.year * 12;
  }

  const sorted = [...pubs].sort((a, b) => sortKey(b) - sortKey(a));

  // Build groups: publications with the same venue and date should be contiguous
  const seen = new Map(); // key -> last index
  let nonContiguousGroups = [];
  sorted.forEach((p, i) => {
    if (!p.date) return;
    const key = `${p.venue}|${p.date}`;
    if (seen.has(key) && seen.get(key) !== i - 1) {
      // Check if all entries between last seen and current are also the same group
      let contiguous = true;
      for (let j = seen.get(key) + 1; j < i; j++) {
        const jKey = `${sorted[j].venue}|${sorted[j].date}`;
        if (jKey !== key) { contiguous = false; break; }
      }
      if (!contiguous) {
        nonContiguousGroups.push(key);
      }
    }
    seen.set(key, i);
  });

  if (assert(nonContiguousGroups.length === 0, 'Same-venue same-date publications should be contiguous after sorting')) {
    log('  ✓ Publications with same venue and date are grouped together after sorting', 'green');
  } else {
    nonContiguousGroups.forEach(g => log(`    ✗ Non-contiguous group: ${g}`, 'red'));
  }

  // Test: MIRU 2025 papers specifically
  const miru2025 = sorted.filter(p => p.venue === 'MIRU 2025');
  if (miru2025.length > 0) {
    const indices = sorted.reduce((acc, p, i) => {
      if (p.venue === 'MIRU 2025') acc.push(i);
      return acc;
    }, []);
    const isContiguous = indices.every((idx, j) => j === 0 || idx === indices[j-1] + 1);
    if (assert(isContiguous, 'MIRU 2025 papers should appear contiguously in sorted output')) {
      log(`  ✓ All ${miru2025.length} MIRU 2025 papers are contiguous in sorted order`, 'green');
    } else {
      log(`  ✗ MIRU 2025 papers at indices [${indices.join(', ')}] are not contiguous`, 'red');
    }
  }
}

function testTranslationCompleteness() {
  log('\n🌐 Testing Translation Completeness...', 'cyan');

  const sandbox = loadDataFile();
  const en = sandbox.TRANSLATIONS.en;
  const ja = sandbox.TRANSLATIONS.ja;

  if (!assert(en && ja, 'Both EN and JA translations should exist')) {
    log('  ✗ Translation objects missing', 'red');
    return;
  }

  // Keys that are expected to match between EN and JA (excluding arrays which have different structures)
  const enKeys = Object.keys(en).filter(k => typeof en[k] === 'string');
  const jaKeys = Object.keys(ja).filter(k => typeof ja[k] === 'string');

  const missingInJa = enKeys.filter(k => !(k in ja));
  const missingInEn = jaKeys.filter(k => !(k in en));

  if (assert(missingInJa.length === 0, 'All EN string keys should exist in JA')) {
    log(`  ✓ All ${enKeys.length} EN string keys have JA translations`, 'green');
  } else {
    missingInJa.forEach(k => log(`    ✗ Missing JA translation for: "${k}"`, 'red'));
  }

  if (assert(missingInEn.length === 0, 'All JA string keys should exist in EN')) {
    log(`  ✓ All JA-only string keys also exist in EN`, 'green');
  } else {
    missingInEn.forEach(k => log(`    ✗ Missing EN translation for: "${k}"`, 'red'));
  }

  // Check critical section titles
  const criticalKeys = ['pub.title', 'pub.subtitle', 'exp.title', 'edu.title', 'awards.title', 'service.title', 'news.title', 'media.title', 'teaching.title', 'talks.title'];
  criticalKeys.forEach(key => {
    const hasEn = key in en && en[key];
    const hasJa = key in ja && ja[key];
    if (assert(hasEn && hasJa, `Critical key "${key}" should exist in both EN and JA`)) {
      log(`  ✓ "${key}" present in both languages`, 'green');
    } else {
      if (!hasEn) log(`    ✗ "${key}" missing in EN`, 'red');
      if (!hasJa) log(`    ✗ "${key}" missing in JA`, 'red');
    }
  });
}

function testNewsItemLayout() {
  log('\n📰 Testing News Item Layout (narrow-screen wrapping)...', 'cyan');

  const cssPath = path.join(__dirname, '..', 'style.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // .news-item should use flexbox with min-width: 0 to allow text truncation
  const newsItemBlock = css.match(/\.news-item\s*\{[^}]*\}/s);
  if (assert(newsItemBlock, 'CSS should have .news-item rule')) {
    log('  ✓ .news-item rule exists', 'green');

    const rule = newsItemBlock[0];
    if (assert(rule.includes('display: flex') || rule.includes('display:flex'), '.news-item should use display: flex')) {
      log('  ✓ .news-item uses display: flex', 'green');
    } else {
      log('  ✗ .news-item does not use display: flex', 'red');
    }

    if (assert(rule.includes('min-width: 0') || rule.includes('min-width:0'), '.news-item should have min-width: 0 to prevent overflow')) {
      log('  ✓ .news-item has min-width: 0', 'green');
    } else {
      log('  ✗ .news-item missing min-width: 0 (text may overflow on narrow screens)', 'red');
    }
  } else {
    log('  ✗ .news-item rule not found', 'red');
  }

  // .news-item > p should have flex: 1 and word-wrap for proper wrapping
  const newsItemPBlock = css.match(/\.news-item\s*>\s*p\s*\{[^}]*\}/s);
  if (assert(newsItemPBlock, 'CSS should have .news-item > p rule for text wrapping')) {
    log('  ✓ .news-item > p rule exists', 'green');

    const pRule = newsItemPBlock[0];
    if (assert(pRule.includes('flex: 1') || pRule.includes('flex:1'), '.news-item > p should have flex: 1')) {
      log('  ✓ .news-item > p has flex: 1', 'green');
    } else {
      log('  ✗ .news-item > p missing flex: 1', 'red');
    }

    if (assert(pRule.includes('min-width: 0') || pRule.includes('min-width:0'), '.news-item > p should have min-width: 0')) {
      log('  ✓ .news-item > p has min-width: 0', 'green');
    } else {
      log('  ✗ .news-item > p missing min-width: 0', 'red');
    }

    const hasWordWrap = pRule.includes('word-wrap: break-word') || pRule.includes('overflow-wrap: break-word');
    if (assert(hasWordWrap, '.news-item > p should have word-wrap/overflow-wrap: break-word')) {
      log('  ✓ .news-item > p has word-wrap: break-word', 'green');
    } else {
      log('  ✗ .news-item > p missing word-wrap: break-word', 'red');
    }
  } else {
    log('  ✗ .news-item > p rule not found', 'red');
  }

  // .news-date should have flex-shrink: 0 so date column stays fixed width
  const newsDateBlock = css.match(/\.news-date\s*\{[^}]*\}/s);
  if (assert(newsDateBlock, 'CSS should have .news-date rule')) {
    const dateRule = newsDateBlock[0];
    if (assert(dateRule.includes('flex-shrink: 0') || dateRule.includes('flex-shrink:0'), '.news-date should have flex-shrink: 0')) {
      log('  ✓ .news-date has flex-shrink: 0', 'green');
    } else {
      log('  ✗ .news-date missing flex-shrink: 0 (date column may shrink on narrow screens)', 'red');
    }
  } else {
    log('  ✗ .news-date rule not found', 'red');
  }
}

function testContactSectionMobile() {
  log('\n📱 Testing Contact Section Mobile Layout...', 'cyan');

  const cssPath = path.join(__dirname, '..', 'style.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // .collab-links should have flex-wrap: wrap
  const collabLinksBlock = css.match(/\.collab-links\s*\{[^}]*\}/s);
  if (assert(collabLinksBlock, 'CSS should have .collab-links rule')) {
    log('  ✓ .collab-links rule exists', 'green');

    const rule = collabLinksBlock[0];
    if (assert(rule.includes('flex-wrap: wrap') || rule.includes('flex-wrap:wrap'), '.collab-links should have flex-wrap: wrap')) {
      log('  ✓ .collab-links has flex-wrap: wrap', 'green');
    } else {
      log('  ✗ .collab-links missing flex-wrap: wrap (buttons may overflow on mobile)', 'red');
    }
  } else {
    log('  ✗ .collab-links rule not found', 'red');
  }

  // Mobile media query should include .collab-btn styles
  const mobileSection = css.match(/@media\s*\(\s*max-width:\s*768px\s*\)\s*\{([\s\S]*?)\n\}/);
  if (assert(mobileSection, 'CSS should have 768px mobile media query')) {
    log('  ✓ 768px media query exists', 'green');

    const mobileCSS = mobileSection[1];

    // .collab-links should go column direction on mobile
    if (assert(mobileCSS.includes('collab-links'), 'Mobile styles should include .collab-links adjustments')) {
      log('  ✓ Mobile .collab-links styles exist', 'green');
    } else {
      log('  ✗ Mobile .collab-links styles missing', 'red');
    }

    // .collab-btn should have full width on mobile
    if (assert(mobileCSS.includes('collab-btn'), 'Mobile styles should include .collab-btn adjustments')) {
      log('  ✓ Mobile .collab-btn styles exist', 'green');

      if (assert(mobileCSS.includes('white-space: normal') || mobileCSS.includes('white-space:normal'), '.collab-btn should allow text wrapping on mobile')) {
        log('  ✓ .collab-btn allows text wrapping on mobile', 'green');
      } else {
        log('  ✗ .collab-btn may truncate text on mobile (missing white-space: normal)', 'red');
      }
    } else {
      log('  ✗ Mobile .collab-btn styles missing', 'red');
    }
  } else {
    log('  ✗ 768px media query not found', 'red');
  }
}

function testImageReferences() {
  log('\n🖼️  Testing Image References...', 'cyan');
  
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Extract image references
  const imgMatches = html.match(/src="pics\/[^"]+"/g) || [];
  const bgMatches = html.match(/url\('pics\/[^']+'\)/g) || [];
  
  const allImages = [
    ...imgMatches.map(m => m.match(/pics\/([^"]+)/)[0]),
    ...bgMatches.map(m => m.match(/pics\/([^']+)/)[0])
  ];
  
  log(`  Found ${allImages.length} image references in HTML`, 'blue');
  
  let existingImages = 0;
  let missingImages = 0;
  
  allImages.forEach(imgPath => {
    const fullPath = path.join(__dirname, '..', imgPath);
    if (fs.existsSync(fullPath)) {
      existingImages++;
    } else {
      missingImages++;
      log(`    ⚠ Image not found: ${imgPath}`, 'yellow');
    }
  });
  
  log(`  ✓ ${existingImages} images exist`, 'green');
  if (missingImages > 0) {
    log(`  ⚠ ${missingImages} images are missing`, 'yellow');
  }
}

function testDateSortOrder() {
  log('\n📅 Testing Date Sort Order (descending)...', 'cyan');

  const MONTH_MAP = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
  const JA_MONTH_RE = /(\d{4})年(?:(\d{1,2})月)?/;
  const EN_MONTH_RE = /^([A-Z][a-z]{2})\s+(\d{4})$/;
  const YEAR_ONLY_RE = /^(\d{4})$/;

  // Parse date string to {year, month} for comparison. month=0 means year-only.
  function parseDate(dateStr) {
    let m;
    if ((m = dateStr.match(JA_MONTH_RE))) {
      return { year: parseInt(m[1]), month: m[2] ? parseInt(m[2]) : 0 };
    }
    if ((m = dateStr.match(EN_MONTH_RE))) {
      return { year: parseInt(m[2]), month: MONTH_MAP[m[1]] || 0 };
    }
    if ((m = dateStr.match(YEAR_ONLY_RE))) {
      return { year: parseInt(m[1]), month: 0 };
    }
    return null;
  }

  function toSortValue(d) {
    return d.year * 100 + d.month;
  }

  function checkSorted(items, dateField, label) {
    const errors = [];
    for (let i = 1; i < items.length; i++) {
      const prev = parseDate(items[i - 1][dateField]);
      const curr = parseDate(items[i][dateField]);
      if (!prev || !curr) {
        errors.push(`  Unparseable date at index ${!prev ? i - 1 : i}: "${items[!prev ? i - 1 : i][dateField]}"`);
        continue;
      }
      if (toSortValue(prev) < toSortValue(curr)) {
        errors.push(`  [${i-1}] "${items[i-1][dateField]}" comes before [${i}] "${items[i][dateField]}"`);
      }
    }
    if (assert(errors.length === 0, `${label} should be sorted by date descending`)) {
      log(`  ✓ ${label} is sorted correctly (${items.length} items)`, 'green');
    } else {
      log(`  ✗ ${label} is NOT sorted correctly:`, 'red');
      errors.forEach(e => log(`    ${e}`, 'red'));
    }
  }

  const sandbox = loadDataFile();
  const en = sandbox.TRANSLATIONS.en;
  const ja = sandbox.TRANSLATIONS.ja;
  const talks = sandbox.TALKS;

  // News (EN)
  if (en['news.items'] && en['news.items'].length > 0) {
    checkSorted(en['news.items'], 'date', 'EN news.items');
  }
  // News (JA)
  if (ja['news.items'] && ja['news.items'].length > 0) {
    checkSorted(ja['news.items'], 'date', 'JA news.items');
  }
  // Awards (EN)
  if (en['awards.items'] && en['awards.items'].length > 0) {
    checkSorted(en['awards.items'], 'year', 'EN awards.items');
  }
  // Awards (JA)
  if (ja['awards.items'] && ja['awards.items'].length > 0) {
    checkSorted(ja['awards.items'], 'year', 'JA awards.items');
  }
  // Talks (EN year field)
  if (Array.isArray(talks) && talks.length > 0) {
    checkSorted(talks, 'year', 'TALKS (EN year)');
    checkSorted(talks, 'yearJa', 'TALKS (JA yearJa)');
  }
}

function printSummary() {
  log('\n' + '='.repeat(60), 'blue');
  log('TEST SUMMARY', 'blue');
  log('='.repeat(60), 'blue');
  
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;
  
  log(`Total Tests: ${totalTests}`, 'cyan');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`Pass Rate: ${passRate}%`, passRate >= 90 ? 'green' : (passRate >= 70 ? 'yellow' : 'red'));
  
  if (failedTests > 0) {
    log('\n❌ Failed Tests:', 'red');
    failedTestDetails.forEach(detail => {
      log(`  - ${detail}`, 'red');
    });
  } else {
    log('\n✅ All tests passed!', 'green');
  }
  
  log('\n' + '='.repeat(60), 'blue');
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run all tests
function runAllTests() {
  log('\n🧪 Starting Test Suite for Ryotaro Shimizu Website...', 'cyan');
  log('='.repeat(60), 'blue');
  
  try {
    testFileStructure();
    testDataFolder();
    testPicsFolder();
    testHTMLContent();
    testCSSContent();
    testJavaScriptContent();
    testImageReferences();
    testNewsItemLayout();
    testContactSectionMobile();
    testPublicationSorting();
    testTranslationCompleteness();
    testDateSortOrder();
  } catch (error) {
    log(`\n❌ Error running tests: ${error.message}`, 'red');
    log(error.stack, 'red');
    process.exit(1);
  }
  
  printSummary();
}

// Run tests
runAllTests();
