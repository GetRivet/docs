#!/usr/bin/env node
/**
 * docs-kb/build-search-index.cjs
 *
 * Generates docs-kb/search-index.json from the frontmatter of every
 * .mdx article in docs-kb/. Mintlify deploys docs-kb/ as the docs site,
 * so the generated file becomes a static asset at
 *   https://docs.getrivet.ca/search-index.json
 *
 * The unified app (apps/app/lib/docs-search.ts) fetches that JSON on
 * the first Cmd+K open per session, caches in localStorage for 24h, and
 * runs client-side substring search to surface docs hits in the
 * QuickSwitcher alongside conversations / contacts / templates.
 *
 * Mintlify doesn't expose a public search API; this is the workaround.
 * Index size: ~193 articles × ~150 bytes = ~30 KB. Negligible payload.
 *
 * Generated artifact:
 * {
 *   "version": 1,
 *   "entries": [
 *     {
 *       "id": "practice-phone/auto-response",          // file-path-derived stable ID
 *       "title": "How auto-reply works",                // frontmatter title
 *       "description": "When a caller leaves you a...", // frontmatter description
 *       "url": "/practice-phone/auto-response",         // public docs URL (relative)
 *       "section": "Practice phone"                     // human-readable parent section
 *     },
 *     ...
 *   ]
 * }
 *
 * NOTE: the output is deterministic — no timestamps, sorted entries —
 * so CI can verify it stays in sync via `git diff --exit-code` after
 * regeneration. Don't add wall-clock fields to this payload; that would
 * make every PR fail the regeneration check.
 *
 * Run locally:
 *   node docs-kb/build-search-index.cjs
 *
 * In CI:
 *   The same command. If the generated output differs from the committed
 *   search-index.json, the CI step diffs and fails — forcing developers
 *   to regenerate and commit before merge. Same model many monorepos
 *   use for codegen.
 */

'use strict'

const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname)
const OUTPUT = path.join(ROOT, 'search-index.json')

// Section labels — map a top-level directory name to a human-readable
// label for the QuickSwitcher result row pill. Kept here instead of
// derived because the directory names (e.g. "clinical-templates") are
// not always the same shape we want shown to users ("Clinical templates").
const SECTION_LABELS = {
  'getting-started': 'Getting started',
  'practice-phone': 'Practice phone',
  'video-sessions': 'Video sessions',
  whiteboard: 'Whiteboard',
  emdr: 'EMDR',
  'clinical-templates': 'Clinical templates',
  documentation: 'Documentation',
  'measurement-based-care': 'Measurement-based care',
  account: 'Account',
  billing: 'Billing',
  privacy: 'Privacy + security',
  troubleshooting: 'Troubleshooting',
  logo: null, // skip — assets, not content
  assets: null, // skip — future GIF directory
}

/** Extract YAML frontmatter (title + description) from an .mdx file.
 *  Returns null if frontmatter is malformed or missing — the caller
 *  reports those as errors. */
function parseFrontmatter(src) {
  if (!src.startsWith('---')) return null
  const end = src.indexOf('---', 3)
  if (end === -1) return null
  const block = src.slice(3, end)
  // Trivial line-by-line key:value parse. We only need title +
  // description; anything fancier (nested YAML, arrays) is out of scope.
  const out = { title: null, description: null }
  for (const line of block.split('\n')) {
    const m = line.match(/^(title|description):\s*(.+)$/)
    if (!m) continue
    let value = m[2].trim()
    // Strip surrounding quotes if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[m[1]] = value
  }
  return out
}

/** Walk docs-kb/ and yield every .mdx file with its relative path. */
function walk(dir, relPrefix = '') {
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      // Skip directories explicitly marked null (assets, logos).
      const topLevel = rel.split('/')[0]
      if (topLevel in SECTION_LABELS && SECTION_LABELS[topLevel] === null) continue
      results.push(...walk(full, rel))
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      results.push({ full, rel })
    }
  }
  return results
}

/** Derive the public URL from a file's relative path.
 *    practice-phone/auto-response.mdx → /practice-phone/auto-response
 *    introduction.mdx → /introduction
 *    getting-started/index.mdx → /getting-started (Mintlify resolves index to parent) */
function deriveUrl(rel) {
  let p = rel.replace(/\.mdx$/, '')
  if (p.endsWith('/index')) p = p.slice(0, -'/index'.length)
  return '/' + p
}

/** Derive the human-readable section from a relative path. Root-level
 *  articles (introduction.mdx, what-is-rivet.mdx, quick-start.mdx) live
 *  under "Welcome". */
function deriveSection(rel) {
  const parts = rel.split('/')
  if (parts.length === 1) return 'Welcome'
  const top = parts[0]
  return SECTION_LABELS[top] || top
}

function main() {
  const files = walk(ROOT)
  const entries = []
  const errors = []

  for (const { full, rel } of files) {
    const src = fs.readFileSync(full, 'utf8')
    const fm = parseFrontmatter(src)
    if (!fm || !fm.title) {
      errors.push(`${rel}: missing or unparseable frontmatter (need at least 'title')`)
      continue
    }
    const id = rel.replace(/\.mdx$/, '')
    entries.push({
      id,
      title: fm.title,
      description: fm.description || '',
      url: deriveUrl(rel),
      section: deriveSection(rel),
    })
  }

  if (errors.length > 0) {
    console.error('build-search-index: errors')
    for (const err of errors) console.error('  ' + err)
    process.exit(1)
  }

  // Stable sort so the generated file diffs cleanly between runs.
  entries.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))

  const output = {
    version: 1,
    entries,
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log(`build-search-index: wrote ${entries.length} entries to ${path.relative(process.cwd(), OUTPUT)}`)
}

main()
