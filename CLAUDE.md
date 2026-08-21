# docs.getrivet.ca writing guide

Every `.mdx` file under `docs-kb/` is read by a Canadian
psychotherapist running a small practice. This file is the rule set for
how to write here — both for humans editing pages and for Claude /
agents asked to draft them.

Auto-loaded by Claude Code when working in this directory. Read it
before writing or editing any article; re-read it whenever you suspect
voice drift.

## The audience

Canadian psychotherapists. Small private practices, mostly solo. They
have clients, not customers. They've been doing this work for years and
they don't want a 22-year-old SaaS bro voice in their docs.

What that means:

- **Plain, calm, practical.** Not breezy. Not corporate. Not "powered
  by AI." Sentences read like a colleague explaining how a tool works.
- **Therapist-first framing.** *"Your callers leave a voicemail"* is
  right. *"Inbound voicemail is received"* is wrong.
- **No jargon they don't already use.** PHQ-9, GAD-7, EMDR, SUDS,
  Shapiro's 8 phases — those ARE the practitioner's vocabulary; keep
  them. WebRTC, addTransceiver, Cloudflare KV, Twilio Voice SDK —
  those are NOT; strip them.

## The one rule

Every sentence has to pass: *"would my therapist client actually care
about this?"*

If a sentence is there to flatter Rivet, show off the engineering, or
narrate the existence of the docs site itself — it doesn't pass.
Delete it.

## What never appears in user-facing pages

| Don't write | Why |
|---|---|
| GitHub links, "engineering changelog", repo references | Therapists don't care |
| "This page covers…" / "This article walks through…" / "This section is about…" | Meta voice — describe the thing, don't describe the description |
| "Phase X", "V1 ships", "in development", "deferred to backlog", "coming soon", "on the roadmap" | Roadmap leaks. Document what works today; if something doesn't exist, leave it out |
| "PR #N", ADR refs, file paths, code constants | Engineering internals |
| Twilio / Whisper / Ollama / Supabase / Cloudflare / Firebase / FCM / APNs | Vendor names. Use what the practitioner *sees* — "Canadian hardware", "the recording", "the practice line" |
| WebRTC / addTransceiver / requestAnimationFrame / contenteditable / AudioContext / API endpoint / SpeechRecognition | Engineering terms |
| "PHIPA-compliant", "HIPAA-compliant", "SOC2-certified" | Unqualified regulatory claim — see Compliance copy below |
| "powered by AI", "seamlessly", "industry-leading", "robust", "powerful" (in marketing context) | Marketing voice; calm down |
| "we're working on", "we'll be adding", "you'll soon see" | Future-tense planning. Write for now |
| "that's a bug" | Engineering jargon; say "we missed something" or "let us know" |

## What's OK to keep

- Therapeutic terminology — PHQ-9, GAD-7, EMDR, SUDS, Shapiro's
  8 phases, CBT, ITQ, the published clinical names of measures
- Product surface names exactly as the practitioner sees them — Inbox,
  Settings, Auto-Reply, Phone, Recents, Voicemail, Templates, Waiting
  Room, Whiteboard
- "Powerful" / "robust" *inside established clinical contexts* —
  e.g. *"robust signal"* in the ITQ scoring page, *"powerful images"*
  from EMDR literature. Strip only when used as marketing voice
- Concrete vendor names ONLY when the audience is a compliance
  reviewer reading where data physically flows (see Compliance pages
  below)

## Compliance pages — special-case audience

A small number of pages are written for College examiners, custodians'
counsel, or compliance reviewers who need to know exactly where data
flows. Those pages legitimately name Twilio, Whisper, Canadian
infrastructure providers, and protocol specifics because that IS the
audience's vocabulary. Don't strip vendor detail from these:

- `docs-kb/privacy/voicemail-transcription-canadian-processing.mdx`
- `docs-kb/privacy/encryption.mdx`
- `docs-kb/privacy/data-processing-agreement.mdx`
- `docs-kb/privacy/breach-response.mdx`

Everywhere else: vendor-neutral.

## Compliance copy — the unqualified-claim rule

Carry-over from `CLAUDE.md`: **never write "PHIPA-compliant" or any
unqualified regulatory claim.** Use the established phrasing:

- *"designed to be consistent with PHIPA"*
- *"designed around Canadian health privacy law"*
- *"built for PIPEDA / PHIPA contexts"*

Applies to PHIPA, PIPEDA, HIPAA, SOC2, GDPR, ISO27001, and any
framework Rivet isn't formally audited against.

## Voice examples

### Voicemail (bad → good)

Bad:

> The voicemail processing pipeline ingests the recording, dispatches
> a transcription request to the local Whisper instance, and emits a
> categorized event to the auto-reply subsystem.

Good:

> Your callers leave a voicemail. Rivet writes back within seconds
> with a text — based on what they said.

### EMDR setup (bad → good)

Bad:

> The BLS subsystem uses a WebRTC data channel to broadcast scene
> updates from the host to the client at ~60Hz via
> requestAnimationFrame.

Good:

> The visual moves at the speed you set. Your client sees the same
> animation you do, in real time, with no installation on their side.

### Don't describe the doc

Bad:

> This article walks through how to record a voicemail greeting.

Good:

> To record a greeting, open the app, tap **Settings → Greeting**,
> then tap **Record new greeting**.

## Article structure conventions

- **Frontmatter** is required. Two fields:
  ```yaml
  ---
  title: "Sentence-case title (no period at the end)"
  description: "One sentence, sentence-case, no period."
  ---
  ```
- **First paragraph** is the lead. State what the page is about by
  describing the thing itself, not the page. Two to four sentences.
- **Headings** — H2 for major sections, H3 for sub-points. Don't use
  H1 (the title comes from frontmatter).
- **Related articles** — when it helps the reader, end with a
  CardGroup linking to 2–4 adjacent topics. Optional.
- **Lengths** — most articles land between 80 and 250 lines.
  Long-form is fine when the topic warrants it; padding is not.

## MDX traps that will silently 404 your page

Mintlify drops a page from the deploy if its MDX fails to parse, and
the only way you'll notice is when the URL 404s in production. The
two traps that have actually bitten this repo:

1. **Bare `{X}` in body content** is parsed as a JavaScript expression.
   If `X` isn't valid JS, the page dies. The bug that took down
   `getting-started/test-your-line.mdx` was a literal `{caller
   number}` — *"caller number"* isn't valid JS, so Mintlify silently
   dropped the page.

   **Fix:** escape with backslash: `\{caller number\}` — or rephrase
   the sentence to avoid braces entirely.

2. **Pre-publication sweep** — run this before pushing:

   ```bash
   grep -rnE "\{[a-z]" docs-kb/ --include="*.mdx" | grep -v "\\\\{"
   ```

   Anything that returns has a raw brace that will probably break the
   page. Escape or rephrase before merging.

## Workflow for editing or adding an article

1. Read this file before you start.
2. Write or edit the article.
3. **Voice self-check**: re-read with the *"would my client care"*
   filter on. Delete anything that fails it.
4. **MDX self-check**: run the brace grep above.
5. **Search index**: if you added a new article (new `.mdx` file),
   regenerate the search index:
   ```bash
   node docs-kb/build-search-index.cjs
   ```
   Commit the resulting `docs-kb/search-index.json` alongside the
   article. (No-op for edits to existing articles unless the
   frontmatter `title` or `description` changed.)
6. **Mintlify nav**: if you added a new article, add it to
   `docs-kb/docs.json` under the right product group.
7. Push as a Tier 1 PR through the standard branch + PR workflow.

## When the audit needs to run again

The pattern audit that produced PR #1110 catches drift across the
whole site. Run it again if:

- A new contributor has written a batch of articles
- You've shipped 10+ new pages without a voice check
- You suspect AI-generated content has slipped in

The prompt that drove that audit is captured in the body of PR #1110;
the workflow is: branch off main, ask an agent to sweep every `.mdx`
file in `docs-kb/` against this guide, review the diff, ship as one
PR.

## When to update this file

Update this file when:

- A new vendor name needs to be added to the "don't include" list
- A new compliance page needs to be added to the special-case list
- A new pattern of voice drift surfaces and you want it captured
- The audience widens — e.g. if Rivet ever sells to a non-therapist
  market, this file needs a new audience section before the writing
  diverges

Don't update for one-off stylistic preferences on a single article.
Those go in the article. This file is for rules that apply across
every page.
