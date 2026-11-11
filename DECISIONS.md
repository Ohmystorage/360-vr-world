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

## 2026-11-10 — Merging for speed may change the desktop view slightly
Decision: merging small same-material objects applies to desktop and headset alike; small look changes are OK (teacher). VR-only settings (fewer grass blades, no shadows/antialias, far culling) stay off on desktop. Keyboard/mouse unchanged. Reason: Quest 2 needs far fewer draw calls; desktop and slow school laptops also benefit. Before/after shots are still shown, and anything that looks wrong is not merged.

## 2026-11-10 — Other device's version wins
Decision: take the other device's how-to/index.html, .gitignore, .git and MEMORY.md (teacher approved overwriting MEMORY.md). Reason: it is newer (GitHub Pages deploy, tinker links, neutral How to wording). Local .claude/launch.json kept (it works here).

## 2026-11-10 — Stage 1 headset card design (plan, not built)
Decision (proposed): VR card = world-locked panel about 1 m ahead at the moment it opens (does not follow the head, less motion sickness); world dims; walking stops; rings hide while open. Open with A/X or laser + trigger on a ring when within 400 m; close with B/Y or laser + trigger on Close. Desktop view unchanged. Mini map and title box stay screen-only for now. Targets Quest 2, 3 and 3S (same browser and buttons).

## 2026-11-10 — Language rule clarified
Decision: only student-facing output is English (pages, cards, labels, buttons, How to). Notes for the teacher in plan images and chat are Korean. Reason: teacher clarified after first saying all work in English. Handoff files stay English.

## 2026-11-10 — Model
Decision: use Opus for the 3 Quest stages. Reason: scoped stages with a teacher approval at each step; Fable fits long autonomous work. Reconsider Fable only if stage 3 (performance) keeps failing.

## 2026-11-10 — Stage 1 built as planned, with small additions
Decision: build the approved plan in a separate file js/vr.js; hotspots.js only sends events and exposes 3 functions. Reason: keeps the desktop code path the same and easy to check. Additions not in the plan image: (1) the AR button is turned off (Quest 3/3S would show it; AR is not part of this project); (2) a ring grows while a laser points at it, because the visible laser line is short (3 m) and students need to see what they are pointing at; (3) A/X far from any place shows "Walk closer to a pink ring!". Correction to the plan image: the card help line reads "Point at Close and pull the trigger, or press B".

## 2026-11-10 — Keep this folder's MEMORY.md over the other device's
Decision: after fast-forwarding to GitHub, keep the local MEMORY.md and copy in the one new fact from the other device's version (stage 1 should include a controller guide page; open question whether it lists stick controls). Reason: the other device's MEMORY.md was written before stage 1 was built here, so it is older apart from that fact.

## 2026-11-10 — Stage 2 design (proposed)
Decision (proposed): snap turn (30 deg) instead of smooth turn, and a vignette while moving, because smooth turning and fast forward motion are the main causes of VR motion sickness for children. Walking speed starts equal to the keyboard (teacher-chosen), with a VR-only lower speed as the fallback. Recommend building stage 2 before pushing so the teacher can reach the places in the headset to test stage 1.

## 2026-11-10 — Card opens and closes with A/X only (corrects the stage 1 design)
Decision: A/X toggles the card; lasers, trigger and B/Y are not used. Reason: teacher — students only need to open the card, not point at rings; one button is simpler for grades 3-5. Replaces the 2026-11-10 stage 1 design (laser + trigger + B/Y).

## 2026-11-10 — Joysticks copy the keyboard; no stick turning
Decision: both thumbsticks = arrow keys (digital, same speed and feel as the keyboard); turning only by head/body. Reason: teacher wants the headset to work like the keyboard students already know, and either hand to work. Replaces the proposed proportional left-stick speed and the right-stick 30 deg snap turn.

## 2026-11-10 — Stages 1 + 2 built as the revised plan; cache-busting
Decision: build stage 2 together with the stage 1 revision (A/X only). Added ?v=20261110 to the four local script tags in world.html. Reason: while testing, the browser kept an old js/components.js from cache; GitHub Pages and the Quest browser cache files too, and a mix of old and new files would break walking. Change the version string whenever these files change.

## 2026-11-10 — Commit author for this public repo
Decision: commits from this computer use the name Ohmystorage (repo-local git config), like the other 9 commits. Reason: the teacher chose it so the work email is not published in a public repo.

## 2026-11-10 — Pointer line + trigger come back; left stick walks, right stick turns (corrects stage 2)
Decision: near a place each controller shows a line; trigger presses the ring, Close or Exit VR; A/X kept. Left joystick = arrow keys; right joystick left/right = 30 deg snap turn with a short blink, up/down = card zoom (only while open). Reason: after the first Quest test the teacher wanted to see exactly where to click, to turn without spinning the body, a way out of VR inside the headset, and a card that is not so close. Using the right stick for turns means it can no longer walk; the teacher accepted left-stick walking (same as most Quest games). Replaces "A/X only, no lasers" and "either joystick walks, no stick turning" from earlier on 2026-11-10.

## 2026-11-10 — Headset walking 70% of the keyboard
Decision: VR acceleration = keyboard acceleration x 0.7 (about 45 m/s); keyboard stays 357.5. Reason: teacher found the headset too fast. One constant (VR_SPEED in js/vr.js).

## 2026-11-10 — Easy ring aiming
Decision: the line counts as on the ring within 7 deg of its center and snaps to it, instead of needing to hit the small ring mesh. Reason: at 100-400 m the ring is only a few degrees wide; children would miss it.

## 2026-11-10 — Exit button copies the Enter VR button
Decision: the in-headset exit button is a copy of A-Frame Enter VR button (same shape, colours, white VR mark, pink on hover), no "Exit" word, at the top right of the view. Reason: teacher asked for the same place and design as Enter VR; students already know that button. Corrects the bottom-right "Exit VR" text button from earlier the same day (I had misread "same place" as bottom right). Placed about 31 deg right / 27 deg up, not the far corner, because Quest lens edges blur.

## 2026-11-11 — "Exit VR" text button instead of the VR mark
Decision: the in-headset exit button reads "Exit VR" with a white border, top right. Reason: teacher sees an "Enter VR" text button in the Quest view and wants the same wording; a word is clearer for students than the VR mark. Replaces the 2026-11-10 VR-mark copy. Colours/font can be matched later from a Quest screenshot.
