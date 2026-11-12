# MEMORY.md — current snapshot (overwrite each time)

Last updated: 2026-11-11 (Quest round 2 pushed and live at 899bc37)

## Done
- 3-place test version (stages 0-5 approved, QA PASS `_workspace/05_qa-tester_report.md`):
  - World: `world.html`, `js/components.js`, `js/hotspots.js`, `js/problems.js`.
  - Ant starts at a nest in the SE lawn corner. Places: bitten M&M cookie ("A Cookie Too Big", id `heavy-cracker`), doormat with a giant person, fence web.
  - Pulsing pink rings; "✉ Read the message" button within 400 m (click or Enter); English cards; minimap with check marks.
  - Keyboard walking `acceleration: 357.5` (~65 m/s).
- Intro page `index.html` (local, not pushed: black "VR headset? See the Quest controls" button opens a pop-up with the controller guide, `_workspace/29_intro_quest_result.jpg`); How to page `how-to/`.
- Online:
  - GitHub (public) https://github.com/Ohmystorage/360-vr-world
  - GitHub Pages https://ohmystorage.github.io/360-vr-world/
  - Linked from the tinker site's "Prompt a 360° World" card. tinker-with-ai.vercel.app is deployed by CLI (`vercel deploy --prod` in `ai-in-k12` of repo `ai-tinkery-webpage`); a push alone does not update it.
- Quest 2 / 3 / 3S, all in `js/vr.js` (VR only). Live on Pages at 899bc37 (round 2, `?v=2026111103`, result `_workspace/27_quest_fix2_result.png`):
  - Entering VR: controller guide opens first (2 drawn controllers, 5 rows); Close (right line + trigger) starts walking. No Exit VR (Meta button leaves), no ? Controls button.
  - Left joystick = arrow keys (walk; forward = where the head looks), 70% of keyboard speed (`VR_SPEED` 0.7). Vignette while walking.
  - Right joystick left/right = one 30 deg turn per push with a short dark blink; up/down = card zoom (only while a card is open, 0.8-3 m).
  - Only the right hand has a line (shows near a ring within 400 m or with a card open). Aim at the envelope: pink + glow only when right in front (`antCanOpen`); trigger opens the card; too far = "Walk closer to read this!". Left trigger and A/B/X/Y do nothing. No "Read the message" label.
  - Card: panel 1.6 m ahead that follows the head smoothly (~0.3 s, yaw + pitch), world dimmed, walking stopped. Close = line + trigger.
  - `js/components.js` ant-walk clamps `#rig` in VR (A-Frame freezes `#cam`).
- Computer view (live): no "Read the message" button; card opens by clicking ✉ or pressing Enter only right in front (50 m from where the ant stops at the place edge, `js/hotspots.js` OPEN_DIST); help line updated.
- Commits: 05fb0b3 (stages 1+2), 63ec929 (5 fixes + Exit VR), d8084d4 (notes), f614966 / b647e73 (other device notes), 05256dd (controller guide). This folder is at 05256dd.

## In progress
- Quest round 2 pushed (899bc37) and live; waiting for the teacher to test it on the Quest.
- Uncommitted: only this status line in MEMORY.md and `_workspace/status.md`.

## Next
1. Teacher tests round 2 on the Quest (card follow comfort, guide text size, line direction).
2. Intro page Quest controls pop-up is built but NOT pushed; push when the teacher says so.
3. For every fix: one plan image (PNG) first (teacher may waive), teacher's yes, build, simulated-VR check, result image, push only when asked.
4. Stage 3: lighter scene for the Quest (measure first: ~1560 draw calls at the start view; Quest 2 target ~100-300; merge same-material small objects; VR-only lower quality; small desktop look changes OK).
5. Later, only if asked: minimap/title in the headset, the other 5 places, the student design activity, minimap cookie under the pink dot, nest rim hiding the cookie at the start spot.

## Blocked / not verified
- Only the teacher can test on a real Quest. All checks here are simulated VR on the computer (forced `checkHeadsetConnected`, emitted thumbstick/button/trigger events, `scene.tick` loops). Not covered: real head pose, gamepad axes, ray direction vs hand, comfort, fps.
- Head-locked UI must stay well inside the lens view (Exit VR at 37 deg right / 33 deg up was never visible). The computer simulation shows a full rectangle, so it cannot catch this.
- Simulated head turns: A-Frame freezes the camera matrix in VR, so turn `#rig` to simulate looking around. Desktop mouse-click tests need a mouse move (hover) before the click.
- Needs internet (A-Frame, fonts, controller models). Phones are not a target.
- Never commit `.claude/launch.json` or the zips (`ant-eye-world_2026-11-08.zip`, `ant-eye-world_2026-11-10.zip`; delete only if the teacher agrees).
- Commits from this computer use author Ohmystorage (repo-local git config, teacher's choice; keeps the work email out of the public repo).

## Rules to remember
- Student-facing text in English; plan-image notes and chat in Korean; handoff files in English.
- One-image plan (PNG) before every change; the teacher's yes after every stage.
- "Same place as Enter VR" etc. always means the HEADSET view (teacher, 2026-11-11).
- Keep keyboard speed 357.5 and the `js/problems.js` text unless asked.
- Bump `?v=` on the `world.html` script tags whenever JS changes (now 2026111103).
- Commit and push only when asked. Stop any test server you start (port 8123 is the teacher's preview).

## How to run
- `python -m http.server 8123` in this folder, open `http://localhost:8123/world.html` (Ctrl+F5); or the desktop app's `.claude/launch.json` "ant-world".
- Simulated VR in the page console: `scene.checkHeadsetConnected = () => true; scene.addState('vr-mode'); scene.emit('enter-vr')`; emit `controllerconnected` on `#hand-left` / `#hand-right`, then `thumbstickmoved` / `triggerdown` / `abuttondown`; step frames with `scene.tick(t, 16.667)` and render. For a headset-like screenshot use a ~1100x1000 viewport and camera fov 96.
- Plan images: HTML in `_workspace/`, rendered with headless Edge via PowerShell Start-Process (`--screenshot`). Write HTML with a Bash heredoc that has no apostrophes (they broke the heredoc), or with the Write tool.

## Next-session start prompt (copy and paste)
```
Goal: make the Ant's-Eye World (A-Frame, grades 3-5) work well inside Meta Quest 2/3/3S; Quest round 2 (right-hand line only, card follows gaze, no A/X, no Read label, cards open only up close, no Exit VR / ? Controls, guide on entering VR, computer: click ✉ or Enter up close) is live on GitHub Pages (commit 899bc37).
Read first: MEMORY.md, PLAN.md and DECISIONS.md (latest 2026-11-11 entries), CLAUDE.md, _workspace/status.md, _workspace/26_quest_fix2_plan_v3.png, _workspace/27_quest_fix2_result.png, world.html, js/vr.js, js/hotspots.js, js/components.js (ant-walk), .claude/skills/ant-world-orchestrator/SKILL.md.
First task: git status (round 2 uncommitted; another device may have pushed); ask the teacher (in Korean) how round 2 felt on the Quest; push the intro page Quest pop-up if asked; then stage 3 (performance).
Cautions: (1) plan image first and the teacher's yes after every stage; "same place as Enter VR" means the headset view; student-facing text in English, chat in Korean; (2) keep keyboard speed 357.5 and js/problems.js text; bump ?v= on world.html script tags when JS changes; commit/push only when asked (never the zips or .claude/launch.json); stop any test server you start (port 8123 is the teacher's preview).
```
