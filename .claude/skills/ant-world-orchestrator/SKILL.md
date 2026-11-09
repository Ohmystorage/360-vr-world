---
name: ant-world-orchestrator
description: Runs the Ant's-Eye World build - an English A-Frame VR world for grades 3-5 where students walk a residential yard as an ant (worm's-eye view, keyboard movement), click marked spots to read ant hardships, then design something to solve one. Use for any request to build, continue, redo, update, fix or improve a stage of the ant world (problem cards, ground world, movement, hotspots/pop-ups, QA), "next stage", "redo stage 2", "only change the pop-ups", or "continue the ant project".
---

# Ant's-Eye World Orchestrator

## Goal
Grades 3-5 students live as a tiny ant in a residential yard, meet real ant hardships, then design and make one thing that solves one of them. All output is in English.

## Execution mode
**Sub-agent delegation, one stage at a time, with a teacher approval gate after every stage.** Why: the teacher must see and approve each stage before the next begins, so stages cannot be chained in one automated run. Each agent returns once per task; no agent-to-agent chat is needed.

| Agent | Model | Owns |
| --- | --- | --- |
| `learning-designer` | opus | `js/problems.js`, lesson text |
| `world-builder` | opus | `index.html` (intro), `world.html`, `js/*.js` except `problems.js` |
| `qa-tester` | sonnet | reports only, edits nothing |

## The approval gate (never skip)
After every stage:
1. Show the teacher the stage's result: card text in full (stage 1), or a screenshot plus how to open and try the page (stages 2-4), or the QA table (stage 5).
2. Ask one question: approve, or what to change.
3. Do not start the next stage until the teacher says yes. Changes requested at the gate are fixed inside the same stage, then shown again.
4. Record the decision in `_workspace/status.md`.

## Stage 0 - Check context
- Read `_workspace/status.md` if it exists; it says which stages are approved.
- No `_workspace/`: start at stage 1.
- Request names one stage or one part ("only the pop-ups"): rerun just that stage's agent with the feedback, then QA, then the gate.
- Request brings new direction for an approved stage: move the old `_workspace/` notes for that stage to `_workspace/archive/{YYYY-MM-DD}/` before redoing it.

## Stages
| Stage | Agent(s) | Deliverable | Shown at gate |
| --- | --- | --- | --- |
| 1. Problem cards | `learning-designer`, then `qa-tester` (stage 1 checks) | 6-8 cards in `js/problems.js` | Full card text |
| 2. Ground world | `world-builder`, then `qa-tester` | Residential yard at ant scale, worm's-eye view | Screenshot + how to open |
| 3. Keyboard movement + minimap | `world-builder`, then `qa-tester` | WASD/arrows, mouse look, bounds, on-screen key help; minimap on the right showing the whole yard from above, with an ant marker that follows the player's position and facing | Screenshot + keys to try |
| 4. Hotspots + pop-ups | `world-builder`, then `qa-tester` | One marked spot per card, click opens its English pop-up; each card's spot also marked on the minimap so students can plan a route; a card's map marker shows a check mark once its pop-up has been opened | Pop-up + minimap screenshot |
| 5. Final check | `qa-tester` (all stages), orchestrator browser pass | QA table | QA table + open issues |

**Current scope (teacher, 2026-11-08): 3-place test version.** Only `heavy-cracker`, `giant-feet`, `fence-web` are built and placed; stages 3-5 run on these 3. The other 5 cards stay in `js/problems.js` but get no scene, hotspot or map marker until the teacher asks. QA "every card has a hotspot" checks apply to these 3 only.

Later (not started without the teacher asking): student design activity, in-headset pop-up panel, deployment for headsets/phones.

## How to call agents
- `Agent(subagent_type: "learning-designer" | "world-builder" | "qa-tester", prompt: …)`. The prompt states the stage number, what to build, the teacher's feedback in their own words, and the file paths to read.
- Run builder/designer first, then QA on the result. If QA fails, send each issue to its owner, re-run QA once, then go to the gate. Do not loop more than twice; show remaining issues at the gate instead.
- If `qa-tester` reports it had no browser tools, the orchestrator runs the browser checks itself (serve the folder, open `index.html`, screenshot, console) before the gate.

## Data passing
Files only.
- Final: `index.html` (intro page), `world.html` (VR world), `js/`, `assets/`.
- Working notes: `_workspace/{stage}_{agent}_{artifact}.md` (e.g. `02_world-builder_changes.md`, `02_qa-tester_report.md`).
- Status: `_workspace/status.md` - one row per stage: stage, state (building / waiting for teacher / approved), date, teacher's notes.

## Errors
- Agent fails once: retry once with the same prompt. Fails again: stop the stage, tell the teacher what is missing.
- Usage limit, auth or permission errors: do not retry. Check what files were actually written, note the gap in `status.md`, tell the teacher (and when the limit resets, if known).
- Never fill an agent's missing output with guesses; only record facts you checked.
- Conflicting info (e.g. card `id` not matching a hotspot): keep both, report it, ask the owner to resolve.

## Test scenarios
- Normal: "Start the ant project" -> no `_workspace/` -> stage 1 -> designer writes 7 cards -> QA PASS -> gate shows all cards -> teacher approves -> status row "1 approved" -> wait for teacher's go before stage 2.
- Revision: at the stage 4 gate the teacher says "make the pop-up text bigger" -> only `world-builder` reruns with that note -> QA stage 1-4 checks -> gate again.
- Error: QA cannot load the page (console error) -> report goes to `world-builder` -> one fix attempt -> still failing -> gate shows the error and asks the teacher how to proceed.
