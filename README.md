# Rivet Knowledge Base

The customer-facing help site practitioners read at **[docs.getrivet.ca](https://docs.getrivet.ca)**. Built with [Mintlify](https://mintlify.com).

This repository is public because Mintlify's Starter plan syncs from public repositories only. Everything in it is already published at the URL above — there is nothing here that is not on the internet already.

Not to be confused with the internal engineering documentation (architecture, ADRs, runbooks), which lives in the private `rivet-worker` repository and is served separately by MkDocs. The two sites are independent and target different audiences.

## Local development

```bash
npm install -g mint     # one-time
mint dev                # hot-reloading preview at localhost:3000
```

To check the project builds without serving it:

```bash
mint dev --port 0 --no-open
```

## Publishing

Push to `main`. Mintlify rebuilds the public site automatically; there is no manual deploy step.

**Verify from outside the dashboard.** The dashboard has reported "all changes published" while the live site was two days stale, so it is not evidence:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -L https://docs.getrivet.ca/<page-path>
```

## Structure

```
docs.json                  # navigation, theme, footer
introduction.mdx           # landing page
what-is-rivet.mdx          # overview for evaluators
quick-start.mdx            # first 10 minutes
<section>/                 # one folder per product area
logo/                      # brand assets
```

`.mintignore` keeps internal files (`CLAUDE.md`, `AGENT-CONTRACT.md`, the search-index build script) out of the published site.

## Voice

Warm, plainspoken, problem-first. Lead with the practitioner's problem, not the feature. Short sentences, no jargon, no marketing words.

Never claim regulatory compliance — write "designed around PHIPA / PIPEDA", never "PHIPA-compliant". This vertical says **client**, never *patient*.

Full rules in `CLAUDE.md`.
