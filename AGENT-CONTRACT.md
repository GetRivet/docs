# Wave 2 Agent Contract — Rivet Knowledge Base

Every Wave 2 content agent reads this before writing.

## Repo + branch

- Repo root: `/Users/adamsimmons/rivet/dev/worker`
- Your branch: see your section spec
- Your folder: `docs-kb/<section>/`
- Don't touch any file outside `docs-kb/<your-section>/`. The exception is `docs-kb/docs.json` — do NOT modify it; Wave 1 already laid out every article path. Match those paths exactly.

## Voice — confident, present-tense, problem-first

Read these BEFORE writing the first article (they're the brand voice ground truth):

- `strategy/docs/go-to-market/positioning.md` — the "Gmail for Voicemail" positioning
- `strategy/docs/go-to-market/website-copy-v2.md` — the marketing site voice (warm, plainspoken, no AI hype)
- `apps/app/DESIGN-LANGUAGE.md` — visual + voice principles
- `apps/app/app/(onboard)/start.tsx` + `apps/app/app/(app)/onboarding.tsx` — UI voice in-product
- `docs-kb/introduction.mdx` + `docs-kb/quick-start.mdx` — the established root-page voice for this KB

Voice rules:

- Address the practitioner as "you" / "your clients"
- Short sentences, active voice
- Lead with the practitioner's goal, not the feature name
- Specific facts, not vague claims ("Voicemail transcribed in under a minute" not "fast transcription")
- No marketing language ("delightful", "powerful", "revolutionary", "best-in-class")
- No AI hype — the tech is invisible
- Confident present tense — describe how things work
- **NEVER** use "draft", "coming soon", "we're working on", "pending counsel review", "under development", "currently being…", "version 2 will…"
- If a feature doesn't ship today, don't mention it. Don't write about future plans.

## Privacy + compliance phrasing (for any article that touches data)

| Use this | Never use this |
|---|---|
| "Designed to be consistent with PIPEDA / PHIPA" | "PHIPA-compliant", "HIPAA-compliant", "BAA-ready" |
| "Rivet acts as an agent of each practitioner-custodian (PHIPA s.2)" | "We're a HINP" |
| "Audio and transcription processed locally in Canada" | "Canadian data residency" (the database currently lives in a US region — describe what's true locally without making the broader claim) |
| "Voicemail audio + SMS metadata handled as PHI" | "End-to-end encrypted everything" |
| "Video sessions use WebRTC DTLS-SRTP encryption" | "We record sessions" — Rivet deliberately doesn't |
| "Practitioner-private notes never leave your browser" | Suggesting notes sync to a server |

Source-of-truth files for privacy facts (read these for any privacy/security article):
- `legal/phipa-characterization-analysis.md`
- `legal/privacy-policy.md`
- `legal/data-processing-agreement-template.md`
- `legal/channel-security-position.md`
- `legal/phipa-compliance-summary-2026-05-28.md`
- `security/breach-response-runbook/RUNBOOK.md`

## Reuse existing internal docs

The existing internal docs at `docs/clinical-platform/templates/` already have 71 per-measure write-ups with citations, severity bands, and scoring details. **Repurpose these for customer voice — don't reinvent.**

For every clinical-measure article you write:
1. Open the matching `docs/clinical-platform/templates/<category>/<measure>.md`
2. Pull citations + severity bands + scoring + clinical change thresholds from there
3. Open the actual template JSON at `packages/shared/src/clinical/templates/<measure>.json` to verify
4. Translate from internal-reference voice to practitioner-facing voice

## Article format

Standard frontmatter:

```mdx
---
title: "Concrete task-flavored title (not the feature name)"
description: "One-sentence summary that works as search preview"
---
```

Body structure:
- Lead paragraph: who this is for + what they'll get (1-2 sentences)
- Substance (300-1500 words; clinical articles trend longer)
- "Related articles" section at the end with 2-3 `<Card>` links

For clinical-measure articles, use this structure:
1. What it measures (plain language)
2. When to use it clinically
3. How clients fill it out (in-session vs async, time required)
4. How Rivet scores it (subscales, cutoffs, severity bands)
5. Clinical change thresholds if applicable
6. Risk flagging if applicable (e.g. PHQ-9 Item 9, C-SSRS items 4/5/6)
7. Citations
8. When NOT to use it (if relevant)
9. Related articles

## Mintlify components

Use where they earn their keep:

- `<Note>` — important context that's not a warning
- `<Warning>` — clinical safety, data handling caveats. **Mandatory** for: 2.0 Hz EMDR speed cap + photosensitive epilepsy, C-SSRS high-risk items, PHQ-9 Item 9 suicidal ideation flag
- `<Tip>` — helpful suggestions
- `<Steps>` / `<Step>` — numbered task flows
- `<CardGroup>` / `<Card>` — link grids in overview pages + Related articles sections
- `<Accordion>` — collapsible detail (use sparingly)

Don't over-decorate. A flat article that reads well beats a decorated one that breaks the flow.

## Commit + push protocol

When your section's articles are done:

```bash
cd <your worktree>
git add docs-kb/<your-section>/
git status   # confirm no files outside your section
git commit -m "feat(kb): wave 2.<N> <section name> — <count> articles

<short summary of what landed>

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
git push -u origin <your-branch>

gh pr create --base main --head <your-branch> \
  --title "feat(kb): wave 2.<N> <section name>" \
  --body "<body summarising the articles + key clinical/voice notes>"
```

Report back: branch name, PR URL, any blockers.

## Critical rules

- Match paths in `docs-kb/docs.json` EXACTLY. The navigation is already laid out; missing files will fail the build.
- No invented features. Verify every claim against repo source.
- No future-tense / draft / soon language anywhere.
- Cite by file path in your reasoning (you don't need to put `file:line` refs in customer-facing articles — but use them in PR body so reviewers can verify).
- One `index.mdx` per section folder — make it a real landing page, not a placeholder.
- If your section spec says 10 articles, write 10 — don't compress into 5 longer ones unless you flag it in the PR.
