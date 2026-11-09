## Harness: Ant's-Eye World (A-Frame VR, grades 3-5)

**Goal:** Students walk a residential yard as an ant (worm's-eye view, keyboard movement), click marked spots to learn real ant hardships, then design and make something that solves one. All output is in English.

**Trigger:** For any request to build, continue, redo or fix the ant world, use the `ant-world-orchestrator` skill. Simple questions can be answered directly.

**Rule:** Show the teacher every stage's result and get approval before starting the next stage.

**Change log:**
| Date | Change | Target | Reason |
| --- | --- | --- | --- |
| 2026-11-08 | Initial Harness v2 setup | All | - |
| 2026-11-08 | Added minimap (stage 3 ant marker, stage 4 card markers) | orchestrator, ant-world-qa, aframe | Teacher wants students to find card spots by route on a map |
| 2026-11-08 | Map check marks for read cards; compact world sized by walking time (all 8 spots in about 3 min) | orchestrator, ant-world-qa, aframe | Teacher: long distances lose students' interest |
| 2026-11-08 | Scope cut to 3-place test version (cracker, doormat, web) | orchestrator | Teacher wants to test the full flow sooner |
| 2026-11-08 | Walking speed 75% (~52.5 m/s); ant-shaped map marker; no map labels | aframe, ant-world-qa | Teacher: too fast; prefers ant icon |
| 2026-11-08 | Walking speed cut again to 80% (~42 m/s) | aframe, ant-world-qa | Teacher tested locally: still too fast |
| 2026-11-08 | Intro page (index.html), world moved to world.html; walking speed +20% (~50 m/s, acceleration 275) | aframe, orchestrator, ant-world-qa | Teacher: needs a start page; walking now felt too slow |
| 2026-11-08 | Walking speed +30% (~65 m/s, acceleration 357.5) | aframe, ant-world-qa | Teacher: still too slow |

## Session handoff rule

After every unit of work that changes code or design, and whenever the session seems to be ending (teacher says goodbye, "let's stop here", mentions a next session), update three files in the project root:
- `PLAN.md`: detailed plan. Append only; never delete.
- `DECISIONS.md`: decisions, reasons, and corrections. Append only; never delete.
- `MEMORY.md`: current snapshot (done / in progress / next / blocked). Overwrite with the latest state, and end it with a copy-paste "Next-session start prompt" (one-line goal, files to read first, first task, 1-2 cautions).
Also update `_workspace/status.md` at each stage gate. Never write secrets (API keys, passwords, tokens) in any of these files. Ask the teacher before deleting or fully overwriting any of the three files. `/handoff` updates them now; `/resume` continues from `MEMORY.md`.
