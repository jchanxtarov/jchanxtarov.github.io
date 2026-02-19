#!/usr/bin/env node
/**
 * Fetches citation counts from Semantic Scholar and OpenAlex APIs,
 * updates js/data.js with the latest citation data.
 * Run via: node scripts/update-citations.js
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'js', 'data.js');
const AUTHOR_QUERY = 'Ryotaro+Shimizu+ZOZO';
const OPENALEX_AUTHOR_SEARCH = 'Ryotaro%20Shimizu';
const EMAIL = 'roy.taro.shimizu@gmail.com';

function normTitle(s) {
  if (!s) return '';
  return s.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 50);
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function fetchSemanticScholar() {
  console.log('Fetching from Semantic Scholar...');
  const search = await fetchJSON(`https://api.semanticscholar.org/graph/v1/author/search?query=${AUTHOR_QUERY}&limit=5`);
  if (!search.data?.length) throw new Error('No author found on S2');

  const authorId = search.data[0].authorId;
  console.log(`  Author ID: ${authorId}`);

  const papers = await fetchJSON(`https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?fields=title,citationCount,year&limit=200`);
  if (!papers.data) throw new Error('No papers from S2');

  console.log(`  Found ${papers.data.length} papers`);
  return papers.data.map(p => ({ title: p.title, citations: p.citationCount || 0 }));
}

async function fetchOpenAlex() {
  console.log('Fetching from OpenAlex...');
  const search = await fetchJSON(`https://api.openalex.org/authors?search=${OPENALEX_AUTHOR_SEARCH}&per_page=5&mailto=${EMAIL}`);
  if (!search.results?.length) throw new Error('No author found on OpenAlex');

  const author = search.results.find(a =>
    JSON.stringify(a).toLowerCase().includes('zozo') ||
    JSON.stringify(a).toLowerCase().includes('waseda')
  ) || search.results[0];

  console.log(`  Author ID: ${author.id}`);

  const works = await fetchJSON(`https://api.openalex.org/works?filter=author.id:${author.id}&per_page=200&mailto=${EMAIL}`);
  if (!works.results) throw new Error('No works from OpenAlex');

  console.log(`  Found ${works.results.length} works`);
  return works.results.map(w => ({ title: w.title, citations: w.cited_by_count || 0 }));
}

async function main() {
  let papers = [];

  // Try Semantic Scholar first, then OpenAlex as fallback
  try {
    papers = await fetchSemanticScholar();
  } catch (e) {
    console.log(`  S2 failed: ${e.message}, trying OpenAlex...`);
    try {
      papers = await fetchOpenAlex();
    } catch (e2) {
      console.error(`  OpenAlex also failed: ${e2.message}`);
      process.exit(1);
    }
  }

  // Also try to merge OpenAlex data for papers S2 might miss
  try {
    const oaPapers = await fetchOpenAlex();
    oaPapers.forEach(oap => {
      const existing = papers.find(p => normTitle(p.title) === normTitle(oap.title));
      if (existing) {
        existing.citations = Math.max(existing.citations, oap.citations);
      } else {
        papers.push(oap);
      }
    });
  } catch (e) {
    // OpenAlex merge is optional
  }

  // Read data.js
  let content = fs.readFileSync(DATA_FILE, 'utf-8');

  let updated = 0;
  papers.forEach(paper => {
    if (!paper.title || paper.citations <= 0) return;

    // Find matching publication entry by title and update citation count
    const normP = normTitle(paper.title);
    // Match pattern: title:"...", ... citations:N
    const regex = new RegExp(
      `(title:"[^"]*"[^}]*citations:)(\\d+)`,
      'g'
    );

    let match;
    while ((match = regex.exec(content)) !== null) {
      const entryTitle = match[1].match(/title:"([^"]*)"/)?.[1];
      if (entryTitle && normTitle(entryTitle) === normP) {
        const oldCit = parseInt(match[2]);
        const newCit = Math.max(oldCit, paper.citations);
        if (newCit > oldCit) {
          content = content.slice(0, match.index) +
            match[1] + newCit +
            content.slice(match.index + match[0].length);
          updated++;
          console.log(`  Updated: "${entryTitle}" ${oldCit} → ${newCit}`);
        }
        break;
      }
    }
  });

  // Update the comment timestamp
  const today = new Date().toISOString().split('T')[0];
  content = content.replace(
    /Citation counts via Semantic Scholar API \(partial coverage\)\./,
    `Citation counts via Semantic Scholar API (partial coverage). Last auto-update: ${today}.`
  );

  fs.writeFileSync(DATA_FILE, content, 'utf-8');
  console.log(`\nDone. Updated ${updated} citation counts.`);
}

main();
