#!/usr/bin/env python3
"""
Build js/data.js from CSV source files in data/ directory.

Usage:
    python scripts/build-data.py

CSV files read:
    data/publications.csv          - Publications (title, authors, venue, year, date, type, citations, paper_link)
    data/talks.csv                 - Talks (year, yearJa, type, title, titleJa, desc, descJa, link, image)
    data/media.csv                 - Media coverage (source, title, titleJa, url, date, category)
    data/awards_en.csv             - Awards in English (year, title, desc)
    data/awards_ja.csv             - Awards in Japanese (year, title, desc)
    data/news_en.csv               - News in English (date, text, isNew)
    data/news_ja.csv               - News in Japanese (date, text, isNew)
    data/translations_template.txt - TRANSLATIONS object body with __NEWS_EN__, __NEWS_JA__,
                                     __AWARDS_EN__, __AWARDS_JA__ placeholders.

CSV rows must be ordered in the desired output order. For publications, that
means: 2026 entries, then 2025, 2024, then arXiv preprints (year change per
preprint), then 2023, 2022, …, with section comments emitted on year change.
"""

import csv
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(ROOT_DIR, "data")
OUTPUT = os.path.join(ROOT_DIR, "js", "data.js")


def read_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


def js_str(s):
    """Escape a string for JS output using double quotes."""
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{s}"'


def build_publications(rows):
    lines = []
    current_year = None
    # Header rules, matching the historical data.js layout:
    #  - emit "// ── {year} ──" when the year changes to a non-preprint row;
    #  - emit "// ── Preprints (arXiv) ──" when the year changes to a preprint row;
    #  - a preprint sharing its year with the surrounding section is left inline
    #    with no header (e.g. a 2026 preprint nested inside the 2026 block);
    #  - consecutive preprints with different years each get their own header.
    for row in rows:
        year = int(row["year"])
        if year != current_year:
            current_year = year
            if row["type"] == "preprint":
                lines.append("  // ── Preprints (arXiv) ──")
            else:
                lines.append(f"  // ── {year} ──")

        authors = row["authors"].split("|")
        authors_js = "[" + ",".join(js_str(a) for a in authors) + "]"

        parts = [
            f"title:{js_str(row['title'])}",
            f"authors:{authors_js}",
            f"venue:{js_str(row['venue'])}",
            f"year:{year}",
        ]
        if row.get("date"):
            parts.append(f"date:{js_str(row['date'])}")
        parts.append(f"type:{js_str(row['type'])}")
        parts.append(f"citations:{row['citations'] or 0}")

        link = row.get("paper_link", "").strip()
        if link:
            parts.append(f"links:{{paper:{js_str(link)}}}")
        else:
            parts.append("links:{}")

        lines.append("  { " + ", ".join(parts) + " },")

    return "const PUBLICATIONS = [\n" + "\n".join(lines) + "\n];"


def build_talks(rows):
    lines = []
    for row in rows:
        parts = [
            f"year:{js_str(row['year'])}",
            f"yearJa:{js_str(row['yearJa'])}",
            f"type:{js_str(row['type'])}",
            f"title:{js_str(row['title'])}",
            f"titleJa:{js_str(row['titleJa'])}",
            f"desc:{js_str(row['desc'])}",
            f"descJa:{js_str(row['descJa'])}",
        ]
        link = row.get("link", "").strip()
        parts.append(f"link:{js_str(link) if link else 'null'}")
        image = row.get("image", "").strip()
        parts.append(f"image:{js_str(image) if image else 'null'}")
        lines.append("  { " + ", ".join(parts) + " },")

    return "const TALKS = [\n" + "\n".join(lines) + "\n];"


def build_media(rows):
    lines = []
    for row in rows:
        section_comment = row.get("section_comment", "").strip()
        if section_comment:
            lines.append(f"  // {section_comment}")
        parts = [
            f"source:{js_str(row['source'])}",
            f"title:{js_str(row['title'])}",
            f"titleJa:{js_str(row['titleJa'])}",
            f"url:{js_str(row['url'])}",
            f"date:{js_str(row['date'])}",
        ]
        cat = row.get("category", "").strip()
        if cat:
            parts.append(f"category:{js_str(cat)}")
        lines.append("  { " + ", ".join(parts) + " },")

    return "const MEDIA = [\n" + "\n".join(lines) + "\n];"


def build_awards(rows):
    items = []
    for row in rows:
        items.append(
            f'      {{year:{js_str(row["year"])},title:{js_str(row["title"])},desc:{js_str(row["desc"])}}}'
        )
    return ",\n".join(items)


def build_news(rows):
    items = []
    for row in rows:
        is_new = row["isNew"].strip().lower() in ("true", "1", "yes")
        # text uses single quotes so HTML attribute double-quotes are kept verbatim;
        # callers must not include unescaped single quotes in news text.
        items.append(
            f"      {{date:{js_str(row['date'])},text:'{row['text']}',isNew:{'true' if is_new else 'false'}}}"
        )
    return ",\n".join(items)


def main():
    print("Reading CSV files...")
    pubs = read_csv("publications.csv")
    talks = read_csv("talks.csv")
    media = read_csv("media.csv")
    awards_en = read_csv("awards_en.csv")
    awards_ja = read_csv("awards_ja.csv")
    news_en = read_csv("news_en.csv")
    news_ja = read_csv("news_ja.csv")

    template_path = os.path.join(DATA_DIR, "translations_template.txt")
    with open(template_path, "r", encoding="utf-8") as f:
        translations_template = f.read()

    print(f"  publications: {len(pubs)} entries")
    print(f"  talks: {len(talks)} entries")
    print(f"  media: {len(media)} entries")
    print(f"  awards (EN): {len(awards_en)} entries")
    print(f"  awards (JA): {len(awards_ja)} entries")
    print(f"  news (EN): {len(news_en)} entries")
    print(f"  news (JA): {len(news_ja)} entries")

    print("Building js/data.js...")

    pubs_js = build_publications(pubs)
    talks_js = build_talks(talks)
    media_js = build_media(media)
    awards_en_js = build_awards(awards_en)
    awards_ja_js = build_awards(awards_ja)
    news_en_js = build_news(news_en)
    news_ja_js = build_news(news_ja)

    translations_js = (
        translations_template
        .replace("__NEWS_EN__", news_en_js)
        .replace("__NEWS_JA__", news_ja_js)
        .replace("__AWARDS_EN__", awards_en_js)
        .replace("__AWARDS_JA__", awards_ja_js)
    )

    output = (
        "// ===== Publications Data =====\n"
        "// Auto-generated from data/publications.csv — do not edit directly.\n"
        "// Run: python scripts/build-data.py\n"
        f"{pubs_js}\n\n"
        "// ===== Translations =====\n"
        f"{translations_js}\n\n"
        "// ===== Talks Data =====\n"
        f"{talks_js}\n\n"
        "// ===== Media Data =====\n"
        f"{media_js}\n"
    )

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(output)

    print(f"Written to {OUTPUT}")
    print("Done!")


if __name__ == "__main__":
    main()
