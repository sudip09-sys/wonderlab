# WonderLab with Rehearsal

[Open the deployed app](https://wonderlab-rehearsal-studio.nuttyriver33.chatgpt.site)

This repository is public. The deployed app currently requires owner access through Sites. Its API and database run on the existing Worker hosting; GitHub Pages alone cannot run this backend. GitHub uploads do not automatically deploy to Sites.

## Purpose
Help students and creative educators create interactive educational exhibits, collaborate on them, receive visible credit, and practise explaining their own work.

## Working release
- Responsive React/TypeScript studio and installable mobile web app.
- Correct, deterministic solar-energy exhibit with three live controls and accessible numeric results.
- Sites-managed ChatGPT sign-in and server-side owner/editor/viewer checks.
- Persistent D1 database, immutable project revisions, optimistic save conflicts, restoration, publishing and unpublishing.
- Email-based project access, team discussion, recorded contributor credits, and attributed adaptations.
- Six-question guided practice, saved progress, immutable attempt inputs, checked numeric/choice answers, and clearly labelled free-text coverage hints.
- Downloadable project PDF, source references, app icons, and a service worker with an offline notice.

## Deliberate boundaries
The solar model is a teaching example, not an installation forecast. Practice feedback uses authored reference answers and deterministic checks. It does not call an AI service, assess semantic correctness of free text, or issue academic grades. This version has no voice recording, arbitrary simulation generation, simultaneous editing, or file uploads. Project access does not grant access to a private Site: the Site owner must separately allow a teammate through Sites sharing.

## Local setup
Requires Node 24+, Git, and npm. The Sites starter supports Node 22.13+, but the tests use Node's built-in SQLite, so Node 24 is recommended.

```powershell
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_wakeful_mongu.sql
npm run dev
```

Open the URL printed by the server. The portable development profile provides local sign-in at `/signin-with-chatgpt?return_to=/` as the test identity `seedy@sites.test`. This mock sign-in is absent from production. Hosted identity comes from the Sites gateway, and the application trusts its server-injected identity headers. Do not deploy this Worker behind an untrusted gateway that lets visitors forge those headers.

Apply the initial local migration once. Local data lives in ignored `.wrangler/state/`; it is separate from hosted D1. Later schema changes require a new generated migration, not editing applied SQL. To create one after changing `db/schema.ts`, use `npm run db:generate`.

## Checks
```powershell
npm run typecheck
npm test
npm run build
```

Tests cover model reference cases and energy accounting, authentication, CSRF, roles, input validation, stale updates, publication snapshots, credits, adaptation, private comments, immutable rehearsals, version restoration, deletion, and PDF structure. Browser checks additionally exercise creation, sliders, saving, six-question practice, publishing, mobile layout, and recovery states.

## Structure
- `components/Studio.tsx`: working product interface and API interactions.
- `components/SolarScene.tsx`: responsive canvas exhibit.
- `lib/learning.ts`: model, curriculum, questions, and practice hints.
- `lib/service.ts`: authorized API operations and persistent workflow.
- `lib/pdf.ts`: self-contained PDF report export.
- `app/api/[...path]/route.ts`: Worker database and identity integration.
- `db/schema.ts`, `drizzle/`: schema and generated migrations.
- `worker/index.ts`: production Worker, response headers, and CSP nonces.
- `public/`: concept artwork, app manifest, service worker, and offline notice.
- `tests/`: integration and model tests.

## Publication
The configured target in `.openai/hosting.json` is a private Sites project. Use the Sites source workflow to push the exact tested source and package the Worker, then save and deploy that version. Sites provisions D1 and applies the generated migration. Preserve the configured project ID and audience. No API key is required for the guided practice release.

## Data and privacy
Private project content remains restricted to members. Published exhibits expose a saved snapshot and public comments to people who can access the Site. Publishing records contributor names and roles but not member email addresses. Removing a project cascades its versions and discussion; a learner's private rehearsal retains its own saved snapshot until that attempt is deleted. Authenticated API responses are not cached by the service worker. PDFs use standard PDF fonts and transliterate non-Latin characters.

## Next improvements
Validate the teaching model and rubric with educators. Extend the template library, add human rubric reviews and content moderation, and measure the cost and accuracy of optional AI/voice features before enabling them.

## Animated home page
The root URL opens a curiosity-cabinet landing page inspired by the interaction in https://www.instagram.com/reel/DfHyZQoIH_U/ . It uses original CSS/SVG objects and existing WonderLab illustrations; no reel media or third-party code is copied. A pointer-following spider and bounded silk trail, a rotating cassette, and a three-state curiosity note provide interaction. Motion can be disabled and respects reduced-motion preferences. Mobile uses a responsive two-column collection with the spider hidden. Every preview links to the functioning studio or sample exhibit; the installable app still starts directly in the studio.
