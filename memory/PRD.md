# KreteOps — Validation-Driven ICF Field Management System

## Original Problem Statement
User uploaded `Walls Abilene Intermediate SS.xlsx` — a sprawling, error-laden ICF production tracking spreadsheet — and asked: "build me something better for this."

After clarifying, the user articulated the vision: a **Validation Layer** baked into the construction workflow. Field crew enters production in real-time as they complete tasks; each task has a checklist of verifiable steps so errors are caught at the moment of work, not weeks later during inspection. Manager sees live truth from the dashboard. "The safety net is built into the process itself."

## User Choices Captured
- AI generation: **Hybrid** — AI suggests validation rules, manager approves
- Seed data: **Import Walls Abilene Intermediate SS** as the demo job
- Auth: **No auth** — role selection (Crew / Manager) on load
- Photo capture on validation steps: **Yes**
- Visual style: **Industrial / jobsite** — dark high-contrast with safety orange + hi-vis yellow

## Architecture
- **Frontend**: React 19 + Tailwind + Recharts + lucide-react. Dark industrial theme. Barlow Condensed (display) + IBM Plex Sans (body).
- **Backend**: FastAPI + Motor (MongoDB async).
- **LLM**: Claude Sonnet 4.6 via `emergentintegrations` (Emergent Universal Key).
- **Storage**: MongoDB collections: `jobs`, `tasks`, `validation_steps`, `task_entries`, `common_mistakes`. Photos stored as base64 data URLs inside the embedded `validations[]` array on each `TaskEntry`.

## Implemented (2026-06-24)
- Onboarding flow with name + role pick (stored in `localStorage`).
- Manager command center dashboard: earned/spent ratio, variance, task status, validation pass-rate, photos captured, 7-day production trend (LineChart), hours-by-phase Est-vs-Actual (BarChart), rework list, crew on site.
- Field view (mobile-first, glove-friendly): task list with status pills + progress bars, filter by category and course (1st–5th floor), search.
- TaskSheet: log hours + quantity + role, walk an oversized pass/fail validation checklist, snap photo proof (uses `<input capture="environment">`), get AI fix-it guidance when a check fails, optional crew notes.
- Tasks · AI Rules screen (manager): expand any task, generate 4-6 AI validation suggestions, approve/reject each, add manual rules with "requires photo" flag. Crew sees readonly version.
- Seed endpoint (`POST /api/seed`, idempotent) imports the Walls Abilene Intermediate SS job: 115 tasks across 8 categories × 5 courses, 427 default validation steps based on category templates.
- Auto-update of task status when entries are logged (`not_started → in_progress → validated`; flips to `rework` on any failed check).
- Aggregated dashboard endpoint computes earned hours by weighted quantity completion and 7-day rolling trend.

## Core Requirements (Static)
1. Real-time production entry from the field.
2. Validation checklist enforced per task before "validated" status is awarded.
3. AI suggests validation rules, manager approves (Hybrid).
4. Photo capture on critical validation steps.
5. Manager dashboard shows live earned-vs-spent ratio, ratio trend, rework count.
6. Multi-course tracking (1st–5th floor).
7. Mobile-first UI for field crews; readable in outdoor light.

## What's Been Implemented
- All 7 core requirements above ✅
- End-to-end tested by `testing_agent_v3` (iteration 1): backend 16/16 passing, frontend 100% — all user flows working including AI validation generation and AI fix-it suggestions.

## User Personas
- **Field Crew Member** (Foreman, Installer, Apprentice, Laborer, Forklift): mobile, gloves, outdoor, may not be a CS or domain expert.
- **Project Manager** (office or trailer laptop): tracks earned-vs-spent, hunts rework, defines what "right" looks like.

## Prioritized Backlog
### P1 (next session candidates)
- Add per-crew weekly recap view (filter dashboard by individual).
- PDF/Excel export of weekly recap (matching the original spreadsheet's "Recap" output).
- Multi-job support (currently single demo job; the data model already supports many).
- Common Mistakes / Fix Library browsable view per category (data is already seeded).

### P2
- Auth: introduce optional JWT login if user wants per-user audit trail.
- Offline-first PWA caching for spotty jobsite Wi-Fi.
- SMS / Slack alert when a task flips to "rework".
- Excel re-import: drop in a new job's SS spreadsheet and have it auto-parsed.
- Photo gallery / wall view across all entries.

## Next Action Items
- Show the user what was built; gather feedback.
- If they want, demo the AI generation flow live (Tasks · AI Rules → "Generate AI Suggestions" on any task).
- Iterate on whichever P1 item they value most.

## Tech Stack Verified
- React 19 + axios + react-router-dom 7 + recharts 3 + lucide-react.
- FastAPI 0.110 + Motor 3.3 + Pydantic 2 + emergentintegrations 0.2.0.
- MongoDB local via `MONGO_URL`.

## Endpoints
- `GET /api/` health
- `GET/POST /api/jobs`
- `GET /api/jobs/{id}/tasks`
- `GET /api/tasks/{id}/validation-steps`
- `POST /api/tasks/{id}/validation-steps` (manual create)
- `POST /api/tasks/{id}/validation-steps/generate` (AI suggest)
- `PATCH /api/validation-steps/{id}` (approve/edit)
- `DELETE /api/validation-steps/{id}`
- `GET /api/tasks/{id}/entries`
- `POST /api/tasks/{id}/entries` (production + validations + photos)
- `POST /api/validation/fix-suggestion` (AI fix-it text)
- `GET /api/jobs/{id}/dashboard` (aggregated metrics)
- `POST /api/seed` (idempotent demo seed)
