# PLAN.md — Ant's-Eye World (append-only)

New entries go at the bottom. Never delete old ones.

## 2026-11-08 — Overall plan
Goal: grades 3-5 students walk a residential yard as an ant (A-Frame, worm's-eye view, keyboard movement), click marked spots to read real ant hardships (English pop-ups), then design and make something that solves one. All output in English.

Stages (teacher approves each before the next):
0. Harness setup (agents: learning-designer opus, world-builder opus, qa-tester sonnet; skills: ant-world-orchestrator, ant-problem-cards, ant-world-qa, aframe).
1. Problem cards -> `js/problems.js` (8 cards).
2. Ground world at ant scale (x800 object size, compact yard).
3. Keyboard movement, obstacles, right-side minimap.
4. Hotspots + pop-ups; each card's spot numbered on the minimap; check mark once a card is read; movement frozen while a pop-up is open.
5. Final QA.
Later (only if teacher asks): student design activity/worksheet, in-headset pop-up panel, deployment (HTTPS) for headsets/phones, the other 5 places, performance merging for Quest.

## 2026-11-08 — Scope: 3-place test version
Only heavy-cracker, giant-feet (doormat), fence-web are built and placed. The other 5 cards (nest-guard, rain-flood, hot-driveway, lost-trail, sidewalk-gap) stay in `js/problems.js` with `placed:false` in `window.PLACES`; nothing is drawn for them. Walk order: cracker -> doormat -> web ("sidewalk -> house -> garden").

## 2026-11-08 — Built so far (stages 1-3)
- 8 cards written and QA-passed (<=70 words per card, no sentence >18 words, questions start "How could you").
- Ground world: place 1 cracker on gray sidewalk with asphalt edge and house details; place 2 doormat with steps, crumbs, giant sneaker; place 3 fence with friendly spider, empty web covering the only gap, strawberry behind it, red-bit trail, garden bed.
- Movement: arrow keys + WASD, mouse-drag look, `ant-walk` collision in `js/components.js`, shared `window.YARD.solids` list used by both collision and minimap. Speed `acceleration: 229.2` (~42 m/s); edge to edge ~59 s.
- Minimap: top right, ant-shaped marker, no text labels (except a small "N").
- Boundaries: east/south-lawn hedge; west brick border + parked red car; south white picket fence with closed gates.
- Preview shortcut: `index.html?place=giant-feet` / `?place=fence-web` / `?place=heavy-cracker`.

## 2026-11-08 — Stage 4 plan (next)
Per card among the 3 placed: glowing hotspot at its place; click opens an English pop-up (title, problem, why-hard, vocabulary words, design question; empty `words` must not break it; body text >=18px; Close button; Escape closes); movement keys frozen while open. Minimap: numbered marker per hotspot, check mark after the card is opened. QA: walk to each hotspot using only the minimap.
Open items to settle with the teacher: card 6 text says "porch door" not "doormat" (teacher may want the word); strawberry could be ~1.3x bigger for projectors; keep or remove the `?place=` shortcut; the small "N" on the map.

## 2026-11-08 (later) — Handoff system set up, new-session test pending
Added PLAN.md / DECISIONS.md / MEMORY.md at the project root and a "Session handoff rule" section at the end of CLAUDE.md. Plan: the teacher opens a new session and runs `/resume` (or pastes the start prompt in MEMORY.md) to check that work continues from the files. If the new session starts wrongly, fix the rule wording and MEMORY.md. No code changed since the stage 3 boundary work.

## 2026-11-08 (later) — Stage 4 built, waiting for teacher
- New `js/hotspots.js`: pink numbered badge (1 cracker, 2 doormat, 3 web) with pulsing ring and bobbing arrow above each place; faces the ant, grows with distance, drawn on top of objects; not solid.
- Click within 400 m opens an HTML card from `window.ANT_PROBLEMS` (title, problem, "Why is it hard?", "Words to know" hidden when empty, yellow "Your design challenge" box, 20px text, pinned Close, Escape). Farther away: "Walk closer to read this!" for 2.5 s.
- Walking and mouse-look frozen while a card is open; held keys cleared on open/close.
- Minimap: pink numbered circles -> green check after a card is opened (resets on reload). Help line adds "Read: click a pink number".
- QA PASS (`_workspace/04_qa-tester_report.md`). Next: teacher's gate, then Stage 5 final QA.

## 2026-11-08 (later) — Stage 4 revision 1: no numbers
Teacher asked to remove all numbers 1-3. World: numbered disc removed; pulsing ring + bobbing arrow kept; invisible hit circle (r 11.2 m) keeps the ring clickable. Map: pink dot with a continuous soft glow (~2 s), green check after reading. Pop-up title has no number. Help line: "Read: click a pink ring". Open: the title box still says "Place N" (from Stage 3); the ring fades to clear at each pulse end.

## 2026-11-08 (later) — Stage 4 revision 2: smaller centered marker
Ring 50% (outer 5.1 m, hit circle 5.6 m), arrow 70%, arrow centered in the ring, both bob together, arrow tip at its old height. Ring opacity 0.9 -> 0.4 (never clear). Title box: "Ant's-Eye World - <card title>" (no "Place N"). Open: place 2 start view (mat edge hides the arrow); far rings drawn through objects.

## 2026-11-08 (later) — Stage 4 revision 3
Place 2 start moved to `{x -505, z 5, yaw -10, tilt 4}` (390 m south of the mat) so ring + arrow show above the bristles. Rings farther than 420 m are hidden by objects; within 400 m drawn through objects (400-420 m hysteresis). Trade-off: the mat is a thin strip in the new first view. Teacher tests locally next; teacher also asked whether the arrow alone (no ring) is enough — decide after the test.

## 2026-11-08 (later) — Stage 4 revision 4: person, nest start, Read button
- Doormat: a giant person stepping into the house (right shoe on the first step = solid; left shoe lifted over the mat, sole visible, ant can walk under the heel). Replaces the loose sneaker.
- Game start: ant nest (soil crater + hole) in the SE lawn corner, facing north-west; `YARD.nest`; brown mound on the minimap.
- Rings show a white envelope (instead of the arrow). Within 400 m a pink "✉ Read the message / click or press Enter" button appears; ring click still works. Help line: "Read: walk to a pink ring".
- `?place=` shortcut and per-place start values removed.
- Measured walk: nest->cracker 38.9 s, cracker->mat 14.8 s, mat->web 27.3 s (~81 s total).
- Later (after Stage 5): an intro page before the VR world (purpose, classroom use, devices needed, controls).

## 2026-11-08 (later) — Stage 4 approved, Stage 5 final QA PASS
Teacher approved Stage 4 (rev 4). Stage 5 QA PASS, no blocking issues (`_workspace/05_qa-tester_report.md`). Full walk 61.7 s (~90 s with reading). Minor items: first place 35 s from the nest; nest start view heaviest (1579 draw calls, 28 ms render); at 400 px the design challenge is below the fold in the web card; "N" on the map; button says "Read the message" but opens a problem card; speed ~5% above 42 m/s at 30 fps. Next: teacher's Stage 5 decision, then the intro page.

## 2026-11-08 (later) — Stage 5 small fixes
Minimap "N" and north triangle removed (`js/components.js`). Narrow-screen scroll cue dropped: the world is not used on phones.

## 2026-11-08 (later) — Intro page built
index.html is now the intro page (bright cracker-scene background from the real world, title, bouncing pink 'Enter the Ant's-Eye World' button, marching ants, 3 picture cards 1. Explore / 2. Find / 3. Design, controls and 'What you need' pills incl. VR headset). The VR world moved to world.html. Narrow windows stack and scroll. Skills (aframe, orchestrator) updated for the new file names.

## 2026-11-08 (later) — Walking speed +20%
acceleration 229.2 -> 275 (~42 -> ~50 m/s, edge to edge ~49 s). Showing cards inside a VR headset is the next big task (teacher: next session).

## 2026-11-08 (later) — Walking speed +30%
acceleration 275 -> 357.5 (~50 -> ~65 m/s, edge to edge ~38 s).

## 2026-11-08 (later) — Cracker -> bitten M&M cookie
Place 1 now shows a round M&M cookie (3x, radius 72 m) propped on a stone, with a big bite on the side the ant approaches and crumbs/M&Ms on the sidewalk; nearby lawn-edge grass is short so it shows from the lawn. Card 1 title 'A Cookie Too Big' (text says cookie). Id stays heavy-cracker. Open: the minimap cookie hides under the pink dot; the intro background still shows the old cracker.

## 2026-11-08 (later) — Intro background retaken
assets/intro-bg.png now shows the bitten M&M cookie with crumbs, the red car and the house (rendered from world.html at x -425, z 470, yaw 68, tilt 14).

## 2026-11-08 (session end) — Handoff
State at the end of this session: 3-place version complete and approved through Stage 5, plus intro page (index.html), VR world in world.html, bitten M&M cookie at place 1, walking speed acceleration 357.5. Next big task: show the cards inside a VR headset (teacher said: next session). No new code since the intro background retake.

## 2026-11-08 (new session) — How to page for the tinker site
The ant world will be the example for the 'Prompt a 360° World' card on tinker-with-ai.vercel.app. Built how-to/index.html in the same pattern as the site's other How to pages (SDG Adventure, Tinkery Lab): 5 steps (Plan, Content, Assets, Build the world, Publish); each step opens a panel with one sentence, 3-4 chip buttons with 1-3 short English lines, and a real screenshot (how-to/shots/step1-5.png); guide 'Scout the Ant' speech bubble; 'Steps seen n/5' dots; Esc or X closes. Background = assets/intro-bg.png, pink + Baloo 2 + Nunito like the intro. Publish step shows 'Live address: Coming soon' until the site is online. Mockup: _workspace/10_howto_plan.png.

## 2026-11-08 (new session) — How to: Live address removed
Step 5 Publish now has two chips: Vercel, VR headsets.
