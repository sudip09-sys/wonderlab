# WonderLab with Rehearsal

Status: working first release, 31 October 2026. See PROJECT.md for setup, architecture, privacy, and limitations.

Objectives preserved: creative educational projects; purposeful collaboration; visible contributor recognition; a useful substantial product; complete frontend, backend, database, tests, and documentation.

Implemented: responsive website and installable PWA, solar simulation, ChatGPT sign-in, D1 persistence, project editor, revisions and restoration, collaboration permissions and comments, contributor credits, publishing and attributed adaptations, saved six-question guided rehearsal, and project PDF export.

Rehearsal currently uses authored questions and deterministic checks, with labelled text coverage hints. AI questions, voice recording, native app-store clients, and simultaneous editing remain future extensions.

Verification: seven model/PDF/API tests passed; type checking and production build checked. Desktop 1440x1000 and mobile 390x844 workflows exercised, including creation, saving, publication, rehearsal completion, errors and permission states. Local test identity is development-only. Production uses Sites identity.

Hosting identity: appgprj_6ae5990093488191a558e6cc4fd2ca2a. Intended private URL: https://wonderlab-rehearsal-studio.nuttyriver33.chatgpt.site . Deployment status must be read from Sites before claiming publication.

Deliverables in parent outputs/: proposal PPTX, technical PDF/Markdown, source ZIP after publication. Keep this file current when resuming; do not change the agreed objectives. Source implementation is in wonderlab/.

## Home page update — 31 October 2026
User reference: https://www.instagram.com/reel/DfHyZQoIH_U/ . Viewed the reel and its caption: cobalt curiosity cabinet, object collage, cursor-following spider and silk. Implemented an original WonderLab adaptation in components/Landing.tsx and components/landing.css. Root / now serves the landing page; /?view=studio and other existing query routes keep the complete app. Mobile layouts, interactive note, pointer following, motion pause and existing route responses checked. No new dependencies. Home page is static content; authentication and database permissions unchanged. GitHub remains public; hosted Site audience remains owner-private. Publish status below must be confirmed from native tool results.
