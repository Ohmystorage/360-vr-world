# MEMORY.md — current snapshot (overwrite each time)

Last updated: 2026-11-11 (synced to GitHub d8084d4; Quest fixes live; waiting for the teacher's Quest test)

## Done
- 3-place test version (stages 0-5 approved, QA PASS `_workspace/05_qa-tester_report.md`):
  - World: `world.html`, `js/components.js`, `js/hotspots.js`, `js/problems.js`.
  - The ant starts at a nest in the SE lawn corner.
  - Places: bitten M&M cookie (card "A Cookie Too Big", id `heavy-cracker`), doormat with a giant person, fence web.
  - Pulsing pink rings; "✉ Read the message" button within 400 m (click or Enter); English cards.
  - Minimap with check marks.
  - Keyboard walking `acceleration: 357.5` (~65 m/s).
- Intro page `index.html`.
- How to page `how-to/` (5 steps, guide "Scout the Ant", neutral wording).
- Online:
  - GitHub (public) https://github.com/Ohmystorage/360-vr-world
  - GitHub Pages https://ohmystorage.github.io/360-vr-world/
  - Linked from the tinker site's "Prompt a 360° World" card (Example -> Pages root, How to -> /how-to/). tinker-with-ai.vercel.app is deployed by CLI, not git: after editing `ai-in-k12/index.html` in repo `ai-tinkery-webpage` (folder `11072026_AI_Tinkery_Webpage/ai-in-k12`, linked to the Vercel project), run `vercel deploy --prod` there; a push alone does not update the site.
- 2026-11-10: synced with the other device twice.
  - Their MEMORY.md recorded the teacher's Quest feedback: only look-around works; cards are invisible.
- 2026-11-10: Quest 2 / 3 / 3S stages 1 + 2 built and pushed (commit `05fb0b3`). Pages is live with them.
  - Design: teacher-revised plan `_workspace/13_vr_walk_plan.png`. Result: `_workspace/14_vr_walk_result.png`.
  - VR only (`js/vr.js`):
    - Pink label "Read the message / press A or X" near a place.
    - A or X opens the card as a world-fixed panel ~1 m ahead; the world dims and walking stops. A or X again closes it.
    - No lasers, trigger, B/Y or grip.
  - Either joystick = arrow keys:
    - Up = forward (where the head looks), down = back, left/right = side-step.
    - Same speed, acceleration and easing as the keyboard. Dead zone 0.5.
    - No stick turning: look and turn with the head and body.
    - Vignette while walking.
    - The headset starts facing the computer view's direction. AR button off.
  - `js/components.js` ant-walk: clamps `#rig` in VR (A-Frame freezes `#cam` in VR) and `#cam` on the computer.
  - `world.html`: plain `meta-touch-controls` hands; script tags carry `?v=20261110` (cache-busting).
  - Computer view unchanged.
- 2026-11-10: teacher tested on a Quest and asked for 5 fixes. Plan `_workspace/15_vr_fix_plan.png` approved; built in `js/vr.js` (pushed: commit 63ec929, live). Result `_workspace/16_vr_fix_result.png`. Now in the headset:
  - Left joystick = arrow keys (walk), at 70% of the keyboard speed (`VR_SPEED` 0.7; keyboard stays 357.5).
  - Right joystick left/right = 30 deg turn once per push, with a short dark blink. Up/down = card zoom (only while a card is open, 0.8 - 3 m).
  - Card opens 1.6 m ahead (was 1.0). Bottom: "Close" button + "or press A or X · right stick ↑ ↓ to zoom".
  - Pointer line from each controller near a place, while a card is open, or when pointing at Exit VR. Trigger presses what it points at: pink ring (opens), Close, Exit VR. Ring aiming within 7 deg; ring glows when aimed. A/X still toggles the card.
  - "Exit VR" text button always at the top right of the view (white border, black 45%, pink #ef2d5e when pointed at). `_workspace/21_exit_text_result.jpg`. Colours can be matched to the Quest "Enter VR" button from a teacher screenshot.
  - Script tags `?v=2026111101`.

## In progress
- Waiting for the teacher to test the fixes (commit 63ec929) on the Quest.
- Nothing uncommitted from the other device. This folder was fast-forwarded to d8084d4 on 2026-11-11 (a local preview on port 8130 may still be running: stop it with `kill $(lsof -tiTCP:8130 -sTCP:LISTEN)`).

## Next
1. Get the Quest test feedback. Ask about: line direction vs the hand, trigger, Exit button placement (top right; move with one number if it is too far in or out), blink comfort, card distance/zoom, speed.
2. Controller guide page for students (English). Plan image first.
   - Content: left joystick = walk like arrow keys; right joystick = turn 30 deg (left/right) and zoom the card (up/down); point the line + trigger = open / Close / the VR button at the top right (exit); A/X = open/close the card; look around with your head.
3. Stage 3: lighter scene for the Quest.
   - Measure first: start view ~1560 draw calls; Quest 2 target ~100-300.
   - Merge same-material small objects; VR-only lower quality.
   - Small desktop look changes are OK (teacher).
4. Later, only if asked:
   - minimap / title inside the headset
   - the other 5 places
   - the student design activity
   - small items: minimap cookie hidden under the pink dot; nest rim hides the cookie at the exact start spot

## Blocked / not verified
- No real Quest check yet; only the teacher can check on a device.
- Stages 1-2 were checked only with simulated VR on the computer:
  - Method: forced `checkHeadsetConnected`, emitted thumbstick and button events, `scene.tick` loops.
  - Not covered: real head pose, gamepad axes, controller models, comfort.
- True fps not measured.
- Needs internet: A-Frame, fonts and controller models load from the web. Phones are not a target.
- Never commit:
  - `.claude/launch.json` (this computer's path)
  - `ant-eye-world_2026-11-08.zip`, `ant-eye-world_2026-11-10.zip` (untracked; delete only if the teacher agrees)
- Commits from this computer use author Ohmystorage. This is repo-local git config, the teacher's choice, so the work email is not published.

## Rules to remember
- Student-facing text in English. Plan-image notes and chat with the teacher in Korean. Handoff files in English.
- Show a one-image plan (PNG) before every change. Get the teacher's yes after every stage.
- Do not change the keyboard walking speed (357.5) or the `js/problems.js` text unless asked.
- Bump `?v=` on the `world.html` script tags whenever JS changes.
- Commit and push only when asked. Stop any test server you start (port 8123 is the teacher's preview).

## How to run
- In this folder, run `python -m http.server 8123`, then open `http://localhost:8123/world.html` (Ctrl+F5).
- Desktop app: `.claude/launch.json` "ant-world".
- Simulated VR test in the page console:
  - `scene.checkHeadsetConnected = () => true; scene.addState('vr-mode'); scene.emit('enter-vr')`
  - Then emit `thumbstickmoved` / `abuttondown` on `#hand-left` / `#hand-right`, and step frames with `scene.tick(t, 16.667)`.
- Plan images: write an HTML file in `_workspace/` and render it with headless Edge (`--screenshot`, run through PowerShell Start-Process).

## 다음 세션 시작 프롬프트 (Next-session start prompt, copy and paste)
```
Goal: make the Ant's-Eye World (A-Frame, grades 3-5) work well inside Meta Quest 2/3/3S; the 5 fixes from the first Quest test (pointer line + trigger, card zoom, 30 deg turns with blink, "Exit VR" button at the top right, 70% speed) are pushed and live on GitHub Pages (commit 63ec929).
Read first: MEMORY.md, PLAN.md and DECISIONS.md (latest 2026-11-10 entries), CLAUDE.md, _workspace/status.md, _workspace/15_vr_fix_plan.png, _workspace/16_vr_fix_result.png, _workspace/18_exit_result.png, world.html, js/vr.js, js/components.js (ant-walk), js/hotspots.js, .claude/skills/ant-world-orchestrator/SKILL.md.
First task: run git fetch/status (another device may have pushed), then ask the teacher (in Korean) how the Quest test of commit 63ec929 went; next: controller guide page plan image, then stage 3 (performance).
Cautions: (1) plan image first and the teacher's yes after every stage; student-facing text in English, notes and chat in Korean; (2) keep keyboard speed 357.5 and js/problems.js text; bump ?v= on world.html script tags when JS changes; commit/push only when asked (never the zips or .claude/launch.json); stop any test server you start (port 8123 is the teacher's preview).
```
