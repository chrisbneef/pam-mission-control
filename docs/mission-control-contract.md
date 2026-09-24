# PAM Mission Control — Internal Page Contract

> **INTERNAL DRAFT — NOT APPROVED FOR PUBLICATION**

## Page contract

| Field | Value |
|---|---|
| Surface mode | **Operate** — operators scan decisions, assign work, and monitor handoffs. |
| Audience / job | Michael, Chris, and authorized PAM operators coordinating revenue work. |
| Objective | Make current work, blocked approvals, and the Revenue Manager conversation legible in one screen. |
| Primary action | Create a task with an initial owner. |
| Secondary action | Send an operator message to the Revenue Manager chat. |
| Canonical URL | Not set; local internal prototype only. |
| Index state | `noindex` metadata; edge proxy blocks unauthenticated routes. |
| Measurement owner | Revenue Manager, subject to Chris-approved telemetry. |
| Substantive review | 2026-09-24. |

## Direction contract

**THESIS:** A calm, operator-first work surface makes decisions and ownership easier to scan than a generic analytics dashboard.

**OWN-WORLD:** Restrained evergreen navigation, pale operational surfaces, mint action color, compact Manrope labels, and a CSS floor-plan office that makes the workflow geography legible without claiming live data.

**STORY:** An operator sees the next decision, reviews work by approval state, creates a bounded task, and sends an internal message.

**FIRST VIEWPORT:** Persistent navigation at left on desktop; greeting and one decisive action above a two-panel signal/office composition; task chat follows before the Kanban board.

**FORM:** Native inputs and select in a modal dialog only for task creation; no custom widgets for standard actions.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Claim ledger

| Visible element | Status | Source / owner | Caveat |
|---|---|---|---|
| Specialist names and ownership | PAM fact | `operations/PAM-REVENUE-TEAM.md` | Displayed as representative internal work. |
| P1 work themes | PAM fact / draft representation | `operations/BACKLOG.md` | Task cards are illustrative local state, not a live backlog import. |
| Office rooms, animated markers, and workflow labels | Synthetic UI state | Web Experience prototype | Motion is illustrative and must not be presented as live without an approved integration. |
| Chat conversation and new tasks | Synthetic local state | Web Experience prototype | No external delivery or persistence occurs. |

## QA evidence

- Automated unit interaction tests: `npm test` (4 passing tests, including task creation, chat compose, Escape dismissal, and trigger-focus restoration).
- Type and production build: `npm run build` passed.
- Lint: `npm run lint` passed.
- Browser QA: desktop 1280px and mobile 390px inspected; task creation and message compose exercised in a live Vite server.
- Accessibility checks included semantic landmarks, headings, explicit input labels, visible focus rules, native dialog semantics, keyboard-capable controls, and reduced-motion styling.
- Independent staged-diff review completed. It found no application logic errors after the focus-management fix; public deployment without access control remains release-blocking.

## Known limitations and approvals

1. **No persistence or agent transport.** Requires Chris approval before any real Hermes/API/task-store wiring.
2. **No real-time activity.** The office floor plan and animated markers are intentionally synthetic.
3. **Authentication configuration required.** Deployment fails closed until `MISSION_CONTROL_USERNAME`, `MISSION_CONTROL_PASSWORD_HASH`, and `MISSION_CONTROL_SESSION_SECRET` are set as Vercel environment variables.
4. **Rate limiting required before public exposure.** Configure Vercel firewall/rate-limit controls; this single-account prototype does not include a distributed attempt store.
5. **No public SEO contract.** This is an authenticated/internal application; it must stay out of public search indexes.
6. **No approved external copy or claims.** Michael retains business/positioning approval; Chris retains production/integration approval.

## Recommended next reversible action

Have Chris define a read-only task/activity payload and transport boundary; then replace one synthetic board lane with a non-production fixture backed by that agreed contract.