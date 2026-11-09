# DECISIONS.md — Ant's-Eye World (append-only)

Each entry: decision, reason, and later changes. Never delete old entries; add a correction below.

## 2026-11-08 — Language and audience
Decision: everything (pop-ups, UI text, harness files) is in English, readable for grades 3-5 (short sentences, science words explained in a `words` list).
Reason: teacher's requirement; many students read below grade level.

## 2026-11-08 — Stage gates
Decision: show the result of every stage and get the teacher's approval before starting the next.
Reason: teacher asked for control at each step. Recorded in `_workspace/status.md` and memory.

## 2026-11-08 — Scale: objects x800, distances compressed
Decision: object sizes use real cm x8 = scene metres (x800); distances between places are compressed ("mini yard") and sized by walking time.
Reason: a real-scale yard would be kilometres wide and students would lose interest. Teacher's rule: all places in about 3 minutes or less.

## 2026-11-08 — Reduced to a 3-place test version
Decision: build only cracker, doormat, web first; keep the other 5 cards in data, unplaced.
Reason: teacher wants to test the whole flow sooner; building all 8 would take too long.

## 2026-11-08 — Card 8 rewritten: "A Web in the Way"
Decision: strawberry on the far side of the fence; the fence sits tight to the ground except one gap under the bottom rail; the web covers that gap; a pot blocks the way around the post.
Reason: teacher: students could just avoid the web, so there must be a visible reason the ant can't. Card text softened (spider friendly, ant "could get stuck"). Climbing the fence is "slow", not impossible, to keep the science true.

## 2026-11-08 — Minimap
Decision: right-side canvas map; ant-shaped marker (not an arrow); no English text labels; later numbered card markers and check marks for read cards.
Reason: teacher wants students to plan a route to the cards; labels not needed; prefers an ant icon.

## 2026-11-08 — Walking speed
Decision: reduced twice by the teacher: 75% (~52.5 m/s) then 80% of that; final `acceleration: 229.2` (~42 m/s, edge to edge ~59 s). Teacher tested locally and approved.
Reason: first builds felt too fast for children.

## 2026-11-08 — Visible boundaries on all four edges
Decision: east hedge (plus south lawn part); west brick border with a parked car; south white picket fence with closed gates; garage door made solid.
Reason: teacher: an invisible stop on open ground makes a child think it is broken. The ant stops at the brick border, not the tire, because at ant scale the gap under a car would leave open ground.

## 2026-11-08 — Technical choices
- Single `index.html` plus `js/components.js` and `js/problems.js`; A-Frame 1.7.0 from the CDN; primitives only (no downloaded models).
- Card data loaded with `<script src>` (not `fetch`) so the page also works from disk.
- Collision and minimap share one list (`window.YARD.solids`) so they cannot drift apart.
- Pop-ups are an HTML overlay (not visible inside a VR headset); an in-scene panel is a later step.
- New agents/skills load only in a new session; this session used general-purpose agents for the first stage 1 run.
- Known risk: ~1,000+ draw calls in wide views — fine on a laptop, too heavy for a standalone Quest until shapes are merged.

## 2026-11-08 — Handoff system
Decision: PLAN.md / DECISIONS.md / MEMORY.md at the project root, updated by the agent each work unit and at session end; rule added to the project CLAUDE.md (the global rule already existed).
Reason: context gets compressed or lost between sessions; the agent should record it automatically.

## 2026-11-08 (later) — /handoff run
No new design decisions since the entries above; stage 3 is still waiting for the teacher's formal approval. The new-session test of the handoff system is the only open item, and it is the teacher's to run.

## 2026-11-08 (later) — Stage 4 hotspot choices
- Teacher approved Stage 3 (recorded in `_workspace/status.md`).
- Hotspot badges draw through objects (like a game waypoint). Reason: at the doormat start the 15 m tall mat edge hid badge 2 completely. Trade-off: a badge behind an object can look like it sits on it.
- Click range 400 m (about 10 s walk) with a "Walk closer" hint. Reason: students should walk to the place, but all 3 start spots are inside the range.
- Check marks are not saved (reload clears them). Reason: simplest; each class run starts fresh.
- No "cards read" counter on the map, to keep it clean.

## 2026-11-08 (later) — Stage 4 revision 1: numbers removed
Decision: no 1-3 numbering on hotspots, minimap or pop-up; map markers are glowing pink dots. Reason: teacher's request (plan image `_workspace/04_change_plan.svg` approved first). Corrects the earlier "numbered markers" plan in the Stage 4 entries above.

## 2026-11-08 (later) — Stage 4 revision 2
Decision: ring 50%, arrow 70% and centered inside the ring; ring minimum opacity 40%; "Place N" removed from the title box. Reason: teacher found the marker too big; a smaller ring that fully fades would be hard to find (recommended and accepted). Plan image `_workspace/04_change_plan2.svg` approved before building.

## 2026-11-08 (later) — Stage 4 revision 3
Decision: move the place 2 start (not the arrow) and hide far rings behind objects. Reason: raising the ring would stop the arrow pointing at the mat; far rings drawn through objects looked like they belonged to the object in front. Correction: the old place 2 start `{x -188, z -205, yaw 25, tilt 12}` is replaced. Ring kept for now (bigger click target, catches the eye); arrow-only is an option after the teacher's test.

## 2026-11-08 (later) — Stage 4 revision 4
- Person at the doormat. Reason: teacher: "Giant Feet Coming" needs a real person; at x800 only shoes and legs fill the ant's view.
- Start at an ant nest in the far SE corner. Reason: teacher felt the start was too close to the rings; a nest also gives the story a home. Trade-off: first place ~30-39 s away (aframe skill said 10-15 s) and the start view is the heaviest (~1579 draw calls).
- Envelope icon + "Read the message" button (click or Enter). Reason: teacher found "click the ring" not intuitive; a visible button tells children what to do and keyboard users can press Enter.
- `?place=` shortcut removed (teacher). Correction: the earlier decision to keep it is replaced; testers now move the rig with JS.

## 2026-11-08 (later) — Stage 5 result
Stage 5 QA PASS. Minor issues are listed for the teacher, not fixed automatically. Reason: every change goes through the teacher's approval (plan image first).

## 2026-11-08 (later) — No phones; no north mark
Decision: target laptops/Chromebooks only (not phones), so the 400 px layout issue is not fixed. Minimap has no "N" or triangle. Reason: teacher.

## 2026-11-08 (later) — Intro page
Decision: student-facing intro page (no teacher section), bright real-world screenshot background instead of a dark overlay, pictures over text, button text 'Enter the Ant's-Eye World'. Reason: teacher found draft 3 too dark and wordy. The background is a static screenshot (assets/intro-bg.png), not the live 3D world, so the intro loads fast. index.html = intro, world.html = VR world, so the class URL stays the same.

## 2026-11-08 (later) — Walking speed +20%
Decision: acceleration 275 (~50 m/s). Reason: teacher found walking too slow after the nest start made the routes longer. Corrects the earlier 'final' 229.2.

## 2026-11-08 (later) — Walking speed +30%
Decision: acceleration 357.5 (~65 m/s). Reason: teacher: still too slow. Corrects 275.

## 2026-11-08 (later) — Cookie instead of cracker
Decision: replace the real-size square cracker with a 3x bitten M&M cookie. Reason: teacher: the cracker was invisible from the nest route (2-3 mm tall, hidden by lawn-edge grass) and did not look like a cracker. A bitten cookie with crumbs reads instantly as food for children. Card text changed from cracker to cookie (orchestrator, with teacher approval of the draft).

## 2026-11-08 (session end) — /handoff run
No new design decisions beyond the entries above. Working rule confirmed this session: show a one-image plan (real renders where possible, PNG) before every change, and get the teacher's yes.

## 2026-11-08 (new session) — How to page
Decision: separate page how-to/index.html, copying the tinker site's How to pattern (5 fixed steps, chips, screenshot, guide character). Reason: it will sit next to the other examples, so it should look and work the same. No 'What we changed after testing' section (teacher: not needed). Guide = Scout the Ant (an ant fits the world). Live address left as 'Coming soon' because the world is not online yet. Headset cards postponed again by the teacher's new request.

## 2026-11-08 (new session) — No live address on the How to page
Decision: remove the 'Live address' chip from step 5. Reason: teacher asked to drop it entirely (corrects the earlier 'Coming soon' placeholder).
