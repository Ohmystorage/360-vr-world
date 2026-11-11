# MEMORY.md — current snapshot (overwrite each time)

Last updated: 2026-11-10 (Quest stages 1 + 2 built, not pushed)

## Done
- Stages 0-5 approved: 3-place test version complete. Stage 5 QA PASS (`_workspace/05_qa-tester_report.md`).
- World (`world.html`, `js/hotspots.js`, `js/components.js`, `js/problems.js`):
  - Ant starts at an ant nest in the SE lawn corner.
  - Place 1: bitten M&M cookie (3x, radius 72 m, on a stone, big bite, crumbs). Card "A Cookie Too Big" (id still `heavy-cracker`).
  - Place 2: doormat with a giant person stepping into the house. Place 3: fence web with the strawberry behind it.
  - Pulsing pink ring + envelope at each place; "✉ Read the message" button within 400 m (click or Enter); English card pop-ups; walking frozen while open.
  - Minimap: glowing pink dots -> green checks; no letters or north mark.
  - Walking speed `acceleration: 357.5` (~65 m/s).
- Intro page (`index.html`) with the bitten-cookie background and "Enter the Ant's-Eye World" button.
- How to page (`how-to/index.html`, `how-to/shots/`): 5 steps, guide "Scout the Ant", neutral wording (no we/our). Example for the "Prompt a 360° World" card on tinker-with-ai.vercel.app.
- Online: GitHub (public) https://github.com/Ohmystorage/360-vr-world ; GitHub Pages https://ohmystorage.github.io/360-vr-world/ . Tinker site Example and How to buttons linked and deployed (tinker site deploys by `vercel deploy --prod` in the ai-in-k12 project).
- 2026-11-10: this folder synced with the other device's work (from Downloads/360-vr-world_2026-11-10.zip). `_other-device/` is git-ignored. Later the same day: fast-forwarded to GitHub `9702479` (other device's 3 MEMORY.md-only commits; Downloads/360-vr-world_light.zip is the same content); this MEMORY.md kept as the newer snapshot.
- 2026-11-10: Quest stages 1 + 2 built (teacher-revised design, `_workspace/13_vr_walk_plan.png`), all in `js/vr.js` plus small hooks:
  - Headset: pink label "Read the message / press A or X" near a place; A or X opens the card (world-fixed panel ~1 m ahead, world dims), A or X again closes. No lasers, trigger, B/Y or grip.
  - Either joystick = arrow keys (forward/back/side-steps, same speed and feel as the keyboard); look and turn only with the head/body; vignette while walking; same walls (ant-walk clamps #rig in VR); starts facing the computer view's direction; AR button off.
  - world.html script tags carry `?v=20261110` (cache-busting; bump when JS changes).
  - Simulated VR checks pass; desktop unchanged. Result image `_workspace/14_vr_walk_result.png`.

## In progress
- Quest 2 / 3 / 3S work (each: plan image, teacher's yes, build, check):
  1. Cards in the headset (A/X toggle) and 2. joystick walking: **built, waiting for the teacher's OK**, then a real Quest try (needs commit + push to GitHub Pages, only when the teacher asks).
  3. Lighter scene (measure first; merge same-material small objects; VR-only lower quality). Small desktop look changes from merging are OK (teacher).
- Still open from the teacher's list: a **controller guide page** (English, for students): joystick = walk like arrow keys, A/X = open/close the card, look around with your head. Plan image first.

## Next
1. Teacher reviews `_workspace/14_vr_walk_result.png`. If OK: commit (exclude the two zip files and `.claude/launch.json`) and push only when asked; teacher tries it on a Quest (check: walking speed comfort, label/card readability, A/X, walls).
2. Controller guide page plan image; stage 3 (performance) plan image after the Quest test.
3. Later only if asked: mini map / title box inside the headset; the other 5 places; the student design activity.
4. Small open items: minimap cookie shape hidden under the pink dot; at the exact start spot the nest rim hides the cookie.

## Blocked / not verified
- No real Quest test yet; only the teacher can check on a device. Stages 1-2 were checked only with simulated VR on the computer (forced checkHeadsetConnected, emitted thumbstick/button events, scene.tick loops); real head pose, gamepad axes and controller models are untested.
- Walking at keyboard speed (~65 m/s) may feel too fast in the headset; fallback is a VR-only lower speed (one number in js/vr.js).
- True fps not measured (start view ~1560 draw calls; Quest 2 target ~100-300).
- Needs internet (A-Frame, fonts and controller models from the web). Phones are not a target.
- Uncommitted local changes: js/vr.js (new), js/hotspots.js, js/components.js, world.html, MEMORY.md, PLAN.md, DECISIONS.md, _workspace files, .claude/launch.json. Untracked zips `ant-eye-world_2026-11-08.zip`, `ant-eye-world_2026-11-10.zip` (do not commit; delete only if the teacher agrees).

## Rules to remember
- Student-facing text in English; plan-image notes and chat with the teacher in Korean.
- Show a one-image plan (PNG) before every change; get the teacher's yes after every stage.

## How to run
In this folder: `python -m http.server 8123`, then open `http://localhost:8123/` (Ctrl+F5). World: `world.html`; How to: `how-to/`. Test views were rendered with headless Edge on a scratch copy of world.html (base href + a script that moves the rig by URL hash `#x,z,yaw,tilt,...`).

## Next-session start prompt (copy and paste)
```
Goal: make the Ant's-Eye World (A-Frame, grades 3-5) work inside Meta Quest 2/3/3S; stages 1 (cards, A/X) and 2 (joystick walking) are built but not pushed or tried on a real Quest.
Read first: MEMORY.md, PLAN.md and DECISIONS.md (2026-11-10 entries), CLAUDE.md, _workspace/status.md, _workspace/13_vr_walk_plan.png, _workspace/14_vr_walk_result.png, world.html, js/vr.js, js/hotspots.js, js/components.js (ant-walk), .claude/skills/ant-world-orchestrator/SKILL.md.
First task: ask the teacher (in Korean) whether stages 1+2 are OK and whether to commit + push to GitHub (exclude the zips and .claude/launch.json) so they can try it on a Quest; then collect the Quest feedback; next plan images: controller guide page, then stage 3 (performance).
Cautions: (1) plan image first and the teacher's yes after every stage; student-facing text in English, notes and chat in Korean; (2) do not change keyboard walking speed (acceleration 357.5) or js/problems.js text; bump ?v= on world.html script tags when JS changes; do not commit/push unless asked; stop any test server you start (port 8123 is the teacher's preview).
```
