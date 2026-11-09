# MEMORY.md — current snapshot (overwrite each time)

Last updated: 2026-11-08 (How to page built)

## Done
- Stages 0-5 approved: 3-place test version complete. Stage 5 QA PASS (`_workspace/05_qa-tester_report.md`).
- World (`world.html`, `js/hotspots.js`, `js/components.js`, `js/problems.js`):
  - Ant starts at an ant nest in the SE lawn corner.
  - Place 1: bitten M&M cookie (3x, radius 72 m, propped on a stone, big bite on the side the ant approaches, crumbs and dropped M&Ms; nearby grass short). Card "A Cookie Too Big" (id still `heavy-cracker`).
  - Place 2: doormat with a giant person stepping into the house. Place 3: fence web with the strawberry behind it.
  - Pulsing pink ring + envelope at each place; "✉ Read the message" button within 400 m (click or Enter); English card pop-ups; walking frozen while open.
  - Minimap: glowing pink dots -> green checks; no letters or north mark.
  - Walking speed `acceleration: 357.5` (~65 m/s, edge to edge ~38 s; teacher raised it +20% then +30%).
- Intro page (`index.html`): background `assets/intro-bg.png` (now the bitten cookie scene), bouncing "Enter the Ant's-Eye World" button (Enter key also works), marching ants, cards 1. Explore / 2. Find / 3. Design, controls and "What you need" pills (laptop + internet, mouse, VR headset).
- Handoff system: PLAN.md / DECISIONS.md / MEMORY.md + rule in CLAUDE.md.
- How to page (`how-to/index.html`, pictures in `how-to/shots/`): "How Ant's-Eye World Was Built" in 5 steps (Plan, Content, Assets, Build the world, Publish), same pattern as the tinker site's other How to pages; guide "Scout the Ant". This world is the example for the "Prompt a 360° World" card on tinker-with-ai.vercel.app.

- On GitHub (public): https://github.com/Ohmystorage/ants-eye-world ; live via GitHub Pages: https://ohmystorage.github.io/ants-eye-world/ (world.html, how-to/). `_other-device/` is git-ignored. (2026-11-08, restored from the other device's download)

## In progress
- Nothing running. How to page approved by the teacher.

## Next
1. Link the tinker site (repo ai-tinkery-webpage) 'Prompt a 360° World' card: Example -> the Pages address, How to -> /how-to/. Was: put the world online so the tinker site's Example and How to buttons can link to it (How to step 5 has only "Vercel" and "VR headsets"; no live address by teacher's request).
2. Show the cards inside a VR headset (the intro invites headset users, but cards are HTML only). Needs a one-image plan first.
3. Other later work (only if asked): merge shapes for slow laptops/Quest (nest start view ~1560 draw calls); deploy on HTTPS for headsets; the other 5 places; the student design activity.
4. Small open items: minimap cookie shape hidden under the pink dot; first place ~35 s walk from the nest (less now with the faster speed); button text "Read the message" vs problem card; at the exact start spot the nest rim hides the cookie.

## Blocked / not verified
- Cards do not show inside a VR headset; Quest untested.
- True fps not measured; slow school laptops untested.
- Needs internet (A-Frame and fonts load from the web). Phones are not a target.

## How to run
In this folder: `python -m http.server 8123`, then open `http://localhost:8123/` (Ctrl+F5). The intro page opens; click "Enter the Ant's-Eye World" or press Enter. The world is `world.html`. To render test views, the session used headless Edge on a scratch copy of world.html with the rig moved by a URL hash (UI hidden).

## Next-session start prompt (copy and paste)
```
Goal: continue the Ant's-Eye World (A-Frame VR for grades 3-5, English only), the example for the tinker site's "Prompt a 360° World" card.
Read first: MEMORY.md, PLAN.md, DECISIONS.md, CLAUDE.md, _workspace/status.md, how-to/index.html, world.html, js/hotspots.js, then .claude/skills/ant-world-orchestrator/SKILL.md.
First task: confirm with the teacher what is next (put the site online and fill step 5's live address, or headset cards). Show a one-image plan (PNG) before building anything.
Cautions: (1) always show a one-image plan before building and get the teacher's yes after every step; (2) do not touch walking speed (acceleration 357.5) or js/problems.js card text unless asked; stop any test server you start (port 8123 is the teacher's preview).
```
