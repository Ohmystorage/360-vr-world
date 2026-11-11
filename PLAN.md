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

## 2026-11-10 — Quest 2 plan (3 stages, plan image + approval each)
1. Headset cards + controller use (trigger on the pink ring or a controller button opens the card inside VR).
2. Thumbstick walking: left stick moves (same speed as keyboard, acceleration 357.5 untouched), right stick snap-turns 30 deg, same ant-walk collision.
3. Lighter scene: measure first (start view ~1560 draw calls; Quest 2 target ~100-300), merge same-material small objects, VR-only lower quality (fewer grass blades, no shadows/antialias, far culling). Show before/after desktop shots from the same spot.

## 2026-11-10 — Synced from the other device; stage 1 plan image
- Restored the other device's work from Downloads (360-vr-world_2026-11-10.zip): how-to/index.html with neutral wording (no we/our, no greetings or exclamation marks), .gitignore, the git history (origin https://github.com/Ohmystorage/360-vr-world), and its MEMORY.md (GitHub Pages + tinker site links done).
- Quest 2 / 3 / 3S work planned in 3 stages (see the earlier 2026-11-10 entry). Stage 1 plan image made from real renders with a test card: _workspace/11_vr_card_plan.png (source 11_vr_card_plan.html, views 11_vr_hint.png, 11_vr_card.png). Prototype: card drawn on a canvas texture, panel ~1 m in front of the camera, world dimmed behind it, pink "Read the message / press A or point and pull the trigger" label below the view. Not built into the project yet; waiting for the teacher's yes.
- Time estimates given: stage 1 ~1-1.5 h, stage 2 ~1 h, stage 3 ~2.5-3.5 h (my work only; plus a 5-10 min Quest check by the teacher per stage).

## 2026-11-10 — Quest stage 1 built: cards inside the headset
Teacher said yes ("1단계 시작 해"). Built (I did it directly, small change):
- New js/vr.js (loaded after js/hotspots.js). Only active in VR mode (enter-vr / exit-vr):
  - Pink label "Read the message / press A or point and pull the trigger" as a child of the three.js camera (scene.camera), 1.2 m ahead, 0.42 m below; shows while antNearest() finds a place within 400 m and no card is open. Other short messages ("Walk closer to a pink ring!", "Walk closer to read this!") show there in grey for 2.5 s.
  - Card panel: canvas texture (1024 px = 1 m wide, height from the text: title, problem, Why is it hard?, Words to know, design challenge, help line), entity #vr-card placed at the head position at open time, facing the view direction (yaw only), card 1 m ahead (a little farther if taller than 1.2 m). Dark see-through ball (radius 4 m, opacity 0.45) dims the world. Separate Close button entity (class vr-ui vr-close) with hover look (yellow ring, 1.08x). Hidden meshes get a no-op raycast so lasers pass through.
  - Rings hide while a card is open (VR only); a ring grows 1.3x while a controller laser points at it (hover flag read in the hotspot tick).
  - Controllers: world.html #rig gets #hand-left / #hand-right with laser-controls and raycaster (objects .hotspot, .vr-ui; far 6000; enabled only in VR). The visible line is cut to 3 m unless it hits something within 30 m (the ray itself still reaches the rings); the line draws on top of the card. A/X = read nearest (or "Walk closer..." if none), B/Y = close.
- js/hotspots.js: sends events ant-card-open (detail = card), ant-card-close, ant-hint; exposes window.antNearest, antReadNearest, antCloseCard; hotspot tick multiplies scale by 1.3 when hover is set. Desktop behavior unchanged.
- world.html: loads js/vr.js; a-scene gets xr-mode-ui="enterAREnabled: false" (Quest 3 / 3S would otherwise also offer an AR button); the two hand entities.
- Checked in the browser on 8123 (server stopped afterwards) with simulated VR (vr-mode state + enter-vr event, emitted button/trigger events, a cursor added to the right hand): label shows near the cookie, laser hover grows the ring, trigger opens the card, Close hover + trigger closes, X/Y and A/B open/close, far from places A shows the grey hint, exit-vr hides everything and turns lasers off, desktop Enter/Escape still work, fresh desktop view has nothing new, console clean. All 3 cards fit (heights 1.04-1.29 m). Result image: _workspace/12_vr_card_result.png.
- Found for stage 2: in VR A-Frame look-controls resets the camera entity to position 0 / rotation 0 and turns off matrixAutoUpdate, so the start yaw (45 deg) is lost and wasd-controls on #cam cannot move the view in VR. Stick walking must move #rig (and snap turn must rotate #rig, then ant-walk must accept a rotated rig).

## 2026-11-10 — Synced with GitHub again
GitHub had 3 new commits from the other device (MEMORY.md only: the teacher's Quest stages; stage 1 also names a controller guide page). Downloads/360-vr-world_light.zip is identical to GitHub main (plus old _other-device notes). Fast-forwarded this folder to 9702479; local uncommitted stage 1 work kept; local MEMORY.md kept (newer) with the controller guide page added as an open item.

## 2026-11-10 — Quest stage 2 plan image (thumbstick walking)
Teacher's feedback from the Quest (recorded on the other device): in VR you can only look around (no walking) and the cards are invisible. Stage 1 fixes the cards; stage 2 fixes walking. Recommended: build stage 2, then push stages 1 + 2 together so one Quest test covers both.
Plan image: _workspace/13_vr_walk_plan.png (source 13_vr_walk_plan.html, view 13_vr_walk_view.jpg). Design:
- Left stick walks in the pushed direction (forward = where the head looks, yaw only); speed proportional to tilt, top speed = keyboard top speed (~65 m/s); dead zone ~0.2.
- Right stick left/right = snap turn 30 deg (once per push; release to turn again), turning around the head position.
- Comfort vignette: edges darken only while moving.
- In VR, move and turn #rig (A-Frame zeroes #cam and turns off its matrixAutoUpdate in VR). ant-walk must clamp #rig against YARD.solids and bounds in VR (same walls as keyboard). No walking while a card is open.
- On enter-vr, rotate #rig so the view starts in the direction the computer view was facing (today VR always starts facing north).
- Desktop unchanged (keyboard speed, positions, card text).
- Open: VR speed may feel too fast; start equal to keyboard, lower in VR only if the teacher feels sick.

## 2026-11-10 — Stage 2 plan revised (teacher)
Teacher: open and close the card only with A/X (press once = open, again = close); no need to open the ring. Revised plan image _workspace/13_vr_walk_plan.png: controls are only left stick (walk), right stick (30 deg turn), A/X (toggle card). Stage 1 changes to make together with stage 2: remove controller lasers and trigger use (no laser-controls hands, no Close button entity, no ring hover), remove B/Y close; label text "Read the message / press A or X"; card help line "Press A or X again to close" instead of the Close button. The word "새로" (new in stage 2) was removed from the table because it confused the teacher.

## 2026-11-10 — Stage 2 plan revised again (teacher)
Teacher: either joystick (left or right) does the keyboard's 4 moves; no 30 deg snap turn; looking around and turning only with the headset (head and body). Revised plan image _workspace/13_vr_walk_plan.png:
- Both thumbsticks act like the arrow keys / WASD: up = forward, down = back, left/right = side-step. Digital like keys (same top speed, same acceleration and easing as wasd-controls), diagonal = two keys. Forward = where the head looks (yaw). Dead zone ~0.5 so a light touch does nothing.
- No snap turn, no smooth turn. Vignette while walking (kept).
- A/X toggles the card; B/Y, trigger, grip unused; no lasers.
- In VR move #rig (cam is frozen by A-Frame); same walls via ant-walk; no walking while a card is open; start facing the computer view's direction.

## 2026-11-10 — Quest stages 1 (revised) + 2 built
Teacher said "네, 만들어줘" to the revised plan _workspace/13_vr_walk_plan.png. Built:
- js/vr.js rewritten (stage 1 revised + stage 2):
  - A or X toggles the card (nearest place within 400 m; far away shows "Walk closer to a pink ring!"). No lasers, no trigger, no B/Y, no Close button entity; card panel is a plain three.js group (dim ball + canvas card) added to the scene; card bottom shows a blue pill "Press A or X again to close". Label: "Read the message / press A or X".
  - System vr-walk: either thumbstick acts as arrow keys (dead zone 0.5; up forward, down back, left/right side-step; diagonal = two keys). Same physics as wasd-controls (acceleration read from #cam's wasd-controls = 357.5, easing 1.1, 0.2 s max delta). Direction = head world yaw. Moves #rig. Reads live gamepad axes (tracked-controls) with thumbstickmoved events as fallback. No walking while a card is open.
  - Vignette: head-locked plane (2.2 m at 0.5 m) with a radial gradient (clear to 18%, dark 0.85 from 55%), fades in/out over ~0.2 s while walking.
  - enter-vr: #rig rotation.y = look-controls yaw, so the headset starts facing the computer view's direction; exit-vr: rig rotation back to 0.
- js/components.js ant-walk: in VR clamps #rig (A-Frame freezes #cam in VR); on the computer clamps #cam as before.
- js/hotspots.js: ring hover removed (no lasers); events and window.antNearest / antReadNearest / antCloseCard kept.
- world.html: hands are plain meta-touch-controls entities (no laser-controls); script tags get ?v=20261110 so browsers (and the Quest) load the new files instead of cached ones.
- Checks on 8123 (stopped) with simulated VR (checkHeadsetConnected forced true, vr-mode state, enter-vr, emitted thumbstick/button events, scene.tick loops): joystick distance = keyboard distance (65.5 m for 1 s held + coast); directions right (facing west: up -> west, down -> east, left -> south); light touch 0.3 does nothing; right stick works the same; stops at the cookie at x -465 like the keyboard and at the yard edge; card toggles with A then X; B/Y/trigger/grip do nothing; no walking with the card open; exit-vr resets the rig; desktop keyboard, Read button, Enter/Escape unchanged; console clean. Result image _workspace/14_vr_walk_result.png.
- Not checked: a real Quest (WebXR head pose, controller models, real gamepad axes, comfort of the speed).

## 2026-11-10 — Stages 1 + 2 pushed
Teacher asked to upload. Commit 05fb0b3 pushed to GitHub main (author Ohmystorage, set in this repo's local git config on the teacher's choice; the zips and .claude/launch.json were left out). GitHub Pages: https://ohmystorage.github.io/360-vr-world/world.html . Next: teacher tries it on a Quest.

## 2026-11-10 — Handoff
GitHub Pages confirmed live about 40 s after the push (world.html loads js/vr.js?v=20261110; vr.js has "press A or X"). The handoff notes written after the push (PLAN, DECISIONS, MEMORY, status) are not committed yet; commit them with the next change. Waiting for the teacher's Quest test.

## 2026-11-10 — Quest fixes after the first headset test (plan + build)
Teacher tried stages 1 + 2 on a Quest and asked for 5 fixes: (1) card too close, zoom with a joystick; (2) near a place a pointer line shows exactly where to click; (3) 30 deg turns right and left; (4) Exit VR inside the headset, where Enter VR is; (5) headset walking 30% slower. Plan image _workspace/15_vr_fix_plan.png (option "ga": line + trigger clicks the ring, Close and Exit VR; blink on turn; left stick walks, right stick turns/zooms). Teacher: "네, 만들어줘". Built in js/vr.js:
- Card opens at 1.6 m (was 1.0; tall cards a bit farther). Right stick up/down while the card is open: closer/farther, 1 m/s, 0.8 - 3.0 m. Card bottom: blue "Close" button + "or press A or X · right stick ↑ ↓ to zoom".
- Pointer lines (system vr-pointer): one per controller, start/direction from controllermodelready rayOrigin (Quest 2 default in code). Shown near a place (no card), while a card is open, or when pointing at Exit VR. Ring hit = within 7 deg of the ring center (easy to hit); line snaps to the ring, turns pink, a pink glow sits on the ring. Card hit = raycast on the card plane; Close area = the button rect (uv), pink outline over it. Trigger presses the target (ring -> antReadNearest, Close -> antCloseCard, Exit -> scene.exitVR). A/X toggle kept. Label: "Read the message / point at ✉ and pull the trigger · or press A / X".
- Exit VR: head-locked button 0.18 x 0.07 m at (0.46, -0.30, -1.0), pink while pointed at.
- Right stick left/right (card closed): one 30 deg snap turn per push (re-arm below 0.3, fire above 0.7), around the head; blink = black head-locked plane, dark in 0.06 s, turn, light again by 0.18 s. No turning while the card is open.
- Walking: left stick only (was either), acceleration x0.7 in VR only (keyboard stays 357.5).
- world.html script tags ?v=2026111002; hotspots.js comment only.
- Checks on 8123 (stopped) with simulated VR: line pink + ring glow when aimed, white otherwise; trigger opens/closes; trigger on card text does nothing; zoom clamps at 0.8 and 3.0; no walking with card open; turns exactly 30 deg once per push both ways, blink opacity 0.55/0.93/0.79/0.41/0.08/0; right stick up does not walk; VR distance / keyboard-speed distance = 0.69; lines hidden far from places, shown on Exit VR; trigger on Exit VR calls scene.exitVR; exit-vr hides everything and resets rig; desktop Enter/Escape and speed unchanged. Only console error came from calling exitVR without a real XR session (simulation only). Result image _workspace/16_vr_fix_result.png.
- Not checked: real Quest (ray direction vs hand, Exit VR placement in view, blink comfort, fps).

## 2026-11-10 — Exit button moved to the top right, same look as Enter VR
Teacher: the Exit VR button should sit at the top right (like the Enter VR button), with the same colour, font and design as Enter VR. Plan _workspace/17_exit_plan.png, option "ga" (exactly the same, no extra text). Built in js/vr.js: the button texture is A-Frame 1.7 Enter VR button drawn on a canvas (108 x 62, 8 px corners, rgba(0,0,0,0.35), hover #ef2d5e, white "VR" mark from the A-Frame CSS SVG paths via Path2D at 90%). Plane 0.13 x 0.075 m, head-locked at (0.6, 0.5, -1.0) = about 31 deg right, 27 deg up (farther out would sit on the blurry lens edge). Old bottom-right "Exit VR" button removed. Script tags ?v=2026111003. Simulated VR: black 35% normally, #ef2d5e when the line is on it, trigger calls scene.exitVR. Result _workspace/18_exit_result.png. Not pushed.

## 2026-11-11 — Exit button says "Exit VR" (headset)
Teacher clarified that all Exit VR requests are about the headset view: in the Quest the teacher sees an "Enter VR" text button at the top right (not part of our pages; we could not see it from the computer). Plan _workspace/20_exit_text_plan.png (white border, higher and further right) approved. Built in js/vr.js: head-locked "Exit VR" button, bold white Arial, 3 px white border, black 45% (pink #ef2d5e when a line points at it), plane 0.24 x 0.084 m at (0.76, 0.64, -1.0) = about 37 deg right, 33 deg up; always visible in VR. Script tags ?v=2026111101. Simulated VR (96 deg view): visible top right, pink on hover, trigger calls scene.exitVR. Screenshot _workspace/21_exit_text_result.jpg. Not pushed.

## 2026-11-11 — Quest fixes pushed
Commit 63ec929 pushed to main (author Ohmystorage; zips and .claude/launch.json left out). GitHub Pages served world.html with ?v=2026111101 about 50 s later. Next: teacher tests on the Quest.

## 2026-11-11 — Synced again; local preview
Fetched GitHub: 3 commits from the other device (05fb0b3 cards in the headset + joystick walking, 63ec929 the 5 Quest fixes, d8084d4 handoff notes); fast-forwarded this folder to d8084d4 (nothing local to merge). Ran a local preview on port 8130 (`python3 -m http.server 8130`): the intro page loads; the headset parts only show in a Quest. Earlier this session: GitHub repo + Pages + tinker site buttons + CLI deploy (see DECISIONS 2026-11-11). Two zips were made in Downloads for moving between devices (`360-vr-world_full.zip` with .git, `360-vr-world_light.zip` without .git); never commit them.
