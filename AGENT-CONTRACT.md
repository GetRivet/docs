# Writing contract — Rivet Knowledge Base

Read this before writing or editing an article here. It covers what is
specific to *this repository*; **`CLAUDE.md` owns the voice** and is the
authority on how sentences should read.

That split is deliberate. The previous version of this file duplicated the
voice rules, and the duplicate drifted: it went on asserting things that had
stopped being true, in a document whose whole purpose is to stop people
asserting things that are not true. Anything stated in two places will
eventually disagree, and the copy nobody edits is the one that lies.

## Where things are

- **Repo:** `GetRivet/docs` — public, Mintlify, serves `docs.getrivet.ca`.
- **Articles:** section folders at the repo root — `video-sessions/`,
  `emdr/`, `practice-phone/`, `clinical-templates/`,
  `measurement-based-care/`, `client-record/`, `privacy/`, `account/`,
  `billing/`, `getting-started/`, `documentation/`, `whiteboard/`,
  `troubleshooting/`, `changelog/`.
- **Navigation:** `docs.json` at the repo root. Article paths must match it
  exactly — a mismatch fails the build.
- **Root pages:** `introduction.mdx`, `quick-start.mdx`, `what-is-rivet.mdx`.

## The constraint that shapes everything else

**The product source lives in a different, private repository, and you cannot
read it from here.**

This repo is public. `rivet-worker` — which holds the app, the legal
documents, the clinical template definitions and the internal measure
write-ups — is private and separate. So the usual instruction to "verify every
claim against the source" is not something you can carry out from this
checkout.

What follows from that:

- **Do not invent a fact to fill a gap.** If you cannot confirm how something
  behaves, leave it out or ask. An article that is silent on a detail is
  recoverable; an article that is confidently wrong reaches a practitioner and
  a College reviewer.
- **Privacy, compliance and clinical-scoring claims cannot be drafted from
  here on their own.** Those need someone who can see `legal/`, `security/`,
  `docs/clinical-platform/templates/` and the template JSON. Draft them where
  those files are, or get the specific facts confirmed and quoted to you.
- **The existing pages are a reasonable reference for what is true**, but they
  are not a source. A page can go stale the moment the product changes — that
  is exactly what happened to `video-sessions/screen-sharing.mdx`, which said
  clients could not share their screen for the first day after they could.

## Facts that have moved, so nobody re-asserts the old ones

- **Records are stored in a Montreal data centre.** The database moved to a
  Canadian region in June 2026. An earlier version of this file told writers
  never to say so, on the grounds that the database was in a US region — that
  instruction was correct when written and is now wrong.
- **Voicemail audio is transcribed on Rivet's own hardware in Canada**, not by
  an outside service.
- **Video sessions are not recorded.** Nothing is stored.

Say those plainly, in the practitioner's language — "a Montreal data centre",
"Canadian hardware". Never claim compliance with a framework: **not**
"PHIPA-compliant", "HIPAA-compliant" or "SOC2-certified". "Designed around
PHIPA and PIPEDA" is the phrasing. `CLAUDE.md` has the full table.

## Article shape

- **Lead:** one or two sentences — who this is for, and what they get.
- **Body:** 300–1500 words. Clinical articles run longer.
- **Related articles:** a `<CardGroup>` with two or three `<Card>` links.
- **One `index.mdx` per section**, written as a real landing page.

### Clinical-measure articles

1. What it measures, in plain language
2. When to use it clinically
3. How clients fill it out — in session or by text, and how long it takes
4. How Rivet scores it — subscales, cutoffs, severity bands
5. Clinical change thresholds, where they exist
6. Risk flagging, where it applies
7. Citations
8. When *not* to use it, where that is worth saying
9. Related articles

Scoring, cutoffs and citations come from the private repo's measure write-ups
and template JSON. Do not reconstruct them from memory or from another
article.

## Mandatory safety callouts

These are not stylistic. Use `<Warning>` for:

- **EMDR** — the 2.0 Hz speed cap, and photosensitive epilepsy
- **C-SSRS** — the high-risk items
- **PHQ-9** — Item 9, suicidal ideation

If you are writing about any of the above and have not written the warning,
the article is not finished.

## Mintlify components

`<Note>` for context that is not a warning. `<Warning>` for clinical safety
and data-handling caveats. `<Tip>` for suggestions. `<Steps>` for numbered
flows. `<CardGroup>` / `<Card>` for link grids. `<Accordion>` sparingly.

Don't over-decorate. A flat article that reads well beats a decorated one that
breaks the flow.

## Shipping — a commit to `main` is a publish

**Mintlify publishes on any commit reaching `main`.** There is no separate
deploy step and no staging gate. A push to `main` is live on
`docs.getrivet.ca` within a couple of minutes.

So: work on a branch, open a PR, and let someone read it. That is cheap
insurance on pages a College reviewer may read.

```bash
git checkout -b docs/<short-name>
# edit
git add <the files you changed>
git status          # confirm nothing unrelated is staged
git commit -m "docs(<section>): <what changed and why>

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push -u origin docs/<short-name>
gh pr create --base main --title "..." --body "..."
```

**Verify against the live page, not the dashboard.** The Mintlify dashboard has
reported "all changes published" while the site served two-day-old content:

```bash
curl -s -L https://docs.getrivet.ca/<path> | grep -c "<a phrase you added>"
```

If a merge does not appear to publish, the call that diagnoses it is
check-**suites**, not check-runs — a missing check-run is ambiguous, while the
suite distinguishes "never received the event" from "received it and could not
act":

```bash
gh api repos/GetRivet/docs/commits/<sha>/check-suites \
  --jq '.check_suites[] | "\(.app.slug) \(.status)/\(.conclusion)"'
```

A suite stuck at `queued` means access or account state, never content.

## Hard rules

- Match the paths in `docs.json` exactly.
- No invented features, and no feature that does not ship today. No "coming
  soon", no "in development", no future tense.
- No engineering internals in an article — no repo links, PR numbers, file
  paths, vendor names or protocol names. `CLAUDE.md` has the list.
- Never claim compliance with a regulatory framework.
- If a section spec asks for ten articles, write ten. Flag it if you think
  fewer is right; don't just compress.
