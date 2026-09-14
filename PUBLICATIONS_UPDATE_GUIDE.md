# Updating the publication page

The publication page is generated from `data/publications.json`. Do not manually add publication cards to `pages/publications.html`.

## Add a publication

Copy an existing object in the matching category and update its fields:

```json
{
  "id": "journal-2026-short-unique-name",
  "category": "published-journal",
  "year": 2026,
  "title": "Full article title",
  "authors": "Hassan, M.*; Coauthor, A.; Coauthor, B.",
  "venue": "Journal Name",
  "details": "Volume(issue), article or page range",
  "doi": "10.xxxx/example",
  "topics": ["Topic one", "Topic two", "Method"],
  "visual": {
    "icon": "route",
    "label": "Short visual label",
    "theme": "systems"
  }
}
```

Valid `category` values:

- `published-journal`
- `accepted-journal`
- `book-chapter`
- `conference`

The totals, filters, search results, and ordering are calculated automatically.

## Accepted papers and inactive DOIs

For an accepted paper with an assigned but inactive DOI, include:

```json
"doi": "10.xxxx/example",
"doiStatus": "pending-activation"
```

The website will show the identifier as a non-clickable record with a proofing-stage note. After the article is published:

1. Change `category` to `published-journal`.
2. Remove `doiStatus`.
3. Update `details` with the final volume, issue, pages, or article number.

The DOI then becomes an active link automatically.

## Add a real paper image

Every publication receives a generated topic cover by default. To replace it with a graphical abstract or research figure:

1. Add an optimized WebP, PNG, or JPG file under `assets/publications/`.
2. Add the following field to the publication object:

```json
"image": "../assets/publications/short-image-name.webp"
```

Use only an image you own or have permission to publish. Do not hotlink copyrighted journal cover images.

## Update work under review

Keep manuscript titles and target journals private. Edit only the broad topic labels in `underReviewThemes`:

```json
"underReviewThemes": [
  "Road safety and risky driving behaviour",
  "Sustainable mobility and Mobility-as-a-Service"
]
```

## Update publisher highlights

The selective publisher strip is generated from `publishers`. Keep it short and publisher-level; individual journal names already appear on publication cards.

## Validation

Before publishing, run:

```bash
jq empty data/publications.json
node --check js/publications.js
```

Preview the page through a local web server rather than opening the HTML file directly, because browsers block local JSON requests from `file://` pages.
