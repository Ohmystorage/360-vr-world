# Stage 5 - Final QA (3-place test version, Revision 4 state)

Tools I had: Browser pane (navigate, screenshot, real click/hover/drag/key, JS, console), Bash, PowerShell, Read/Write, headless Chrome (for file://). Served on port 8147 (stopped; 8123 untouched, 8123 still answers). Pane viewport 1280x720 and 400x700. Real keys (computer tool) were used for Enter, Escape, mouse clicks, hover and drag. Held movement keys were sent as keydown/keyup events to the page (the tool cannot hold a key).

Note on speed of this pane: requestAnimationFrame ran at about 30 fps here (capped), and the pane sometimes stops animating between tool calls, so true fps was not measurable (see Performance).

## Results

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Load, console | PASS | Only A-Frame 1.7.0 / THREE 173 logs; no errors or warnings from the page (the Canvas2D warnings came from my own getImageData test). |
| 2 | Opens from disk (file://) | PASS | Headless Chrome from disk: scene built, 3 hotspots created, no card warnings; only A-Frame's standard "served via file://" notice. A-Frame is loaded from aframe.io, so internet is needed (not tested offline). |
| 3 | Worm's-eye view, scale | PASS | Camera y 1.6; start tilt 10 deg. Screenshots: grass towers over the camera, giant person, house, car, steps overhead. |
| 4 | Start view at the nest | PASS | Rig (1017.3, 1037.3), yaw 45, soil rim both sides, person and house straight ahead, title "Ant's-Eye World", no Read button. |
| 5 | Arrow keys + WASD move | PASS | 1 s holds from the same spot: W/Up 44 m forward, S/Down 43 m back, A/Left and D/Right strafe about 43-45 m in opposite directions. Left/Right arrows strafe (do not turn), same as A/D. |
| 6 | Mouse look | PASS | Real drag (400,250)->(520,200): yaw 90 -> 68, pitch 0 -> 9. |
| 7 | Speed (acceleration 229.2, ~42 m/s) | PASS (small note) | Steady speed 44.3 m/s (measured at about 30 fps), about 5% above 42. Edge to edge (2470 m) estimated about 56 s; not timed by walking. |
| 8 | Collision: big solids | PASS | Stops exactly at faces: cracker east side x -513, mat south edge z -217, porch steps east face x -182, web x 397, end post, flower pot z -373, garden bed z -277, nest rim blobs (stopped 20-40 m inside the crater). |
| 9 | Standing shoe | PASS (note) | The standing shoe's footprint lies fully inside the porch-steps solid, so it can never be reached; the steps stop the ant first. Nothing to walk through. |
| 10 | Walk under the lifted heel | PASS | From (-560,-150) walking north passed under the heel zone with no block and stopped only at the mat edge z -217. Screenshot looking up from (-560,-198): treaded sole fills the sky like a ceiling. |
| 11 | 4 boundaries | PASS | North z -1277 (house wall), south z 1197 (hedge) and z 1195 (picket fence/gates on the walkway), east x 1167 (hedge), west x -1297 (brick border). |
| 12 | Strawberry unreachable | PASS | Straight from the west stops at x 397; diagonal from NW stopped at the fence x 436; diagonal from SW stopped at the end post x 357. Berry (475,-655) never reached. |
| 13 | Minimap layout | PASS | Top right, 134 px wide at 400 px width, does not cover the middle of the view; whole yard visible. |
| 14 | Minimap ant marker follows position and facing | PASS | Marker top-left at NW corner, bottom-right at SE corner. Head direction: yaw 0 up, 90 left, 180 down, -90 right, 45 up-left. The steering during the full walk used the marker and dots and arrived at the right places. |
| 15 | Minimap nest | PASS | Brown mound with dark centre in the SE corner, visible once the ant moves off it (the marker covers it at the start). |
| 16 | Minimap 3 glowing dots, checks after reading | PASS | 3 pink glowing dots at the start; each turned into a green check after its card opened (2556 green pixels with all 3 read). |
| 17 | Minimap has no English words | PASS with note | Only a small "N" (north mark) in the top right corner; no words. See issue 4. |
| 18 | Ring + envelope visible near each place | PASS | Cracker, doormat and web all show a pink pulsing ring with a white envelope within 150-400 m (screenshots). |
| 19 | Far rings hidden behind objects | PASS | Ring depth test: off at 399 m, on at 401+ (hidden by objects). At 440 m the cracker ring was behind grass in the screenshot. At the nest start the far rings show only where nothing blocks them. |
| 20 | Read button appears within 400 m, hides outside / while open | PASS | Shown at 350 and 399 m, hidden at 401 and 450 m for all 3 places; hidden while a card is open, back after closing. |
| 21 | Enter and click open the right card | PASS | Real Enter opened cracker, doormat and web cards during the walk. Real click on the button opened the cracker card. Real hover then click on the ring opened the cracker card (cursor turns to pointer). |
| 22 | Far click hint | PASS | Real click on the cracker ring from 440 m: "Walk closer to read this!" (22 px, above the button), no card. |
| 23 | Pop-up text matches js/problems.js | PASS | Title, problem, whyHard, words and question compared in the page for all 3 cards: exact match. |
| 24 | Empty words handled | PASS | giant-feet: "Words to know" box hidden, no errors. |
| 25 | Pop-up text size | PASS | Body, words and question 20 px; headings 21 px; title larger; Close button 22 px. |
| 26 | Close and Escape | PASS | Real click on Close and real Escape both close. Close button has focus on open. |
| 27 | Movement frozen while open, no drift | PASS | W + Up held for 1.5 s with a card open: 0 m moved. After closing: 0 m drift over 1.5 s, wasd and look-controls enabled again. |
| 28 | Grades 3-5 reading check | PASS | See reading table below. |
| 29 | 1280x720 layout | PASS | Title, map, button, card all visible, no overlap; longest card (web) 602 px tall fits without scrolling. |
| 30 | 400x700 layout | PASS (minor note) | No page side-scroll (scroll width 400). Title 12-236 px, map 254-388 px (no overlap). Read button 52-348 x 543-616 px. Card 16-384 px, scrolls inside (812 px content in 668 px), Close pinned at 612-664 px. See issue 3. |
| 31 | Performance: draw calls | PASS (note) | Nest start 1579 calls / 128k triangles; 150 m from cracker 548; doormat 344; web 231; cracker read spot 1000. |
| 32 | Performance: fps | NOT MEASURED | Pane capped at about 30 fps. CPU+finish render time: nest start 28.3 ms, cracker 7.7 ms, doormat 5.7 ms, web 3.4 ms. The nest start is the heavy view (see issue 2). Builder measured 53-61 fps in a visible pane. |
| 33 | Full real walk, minimap only, time | PASS | Controller read the minimap canvases only (dot and ant pixels) to steer; held W; opened each card with a real Enter. Nest -> cracker button 34.9 s; cracker -> doormat 13.0 s; doormat -> web 13.7 s. Total walking 61.7 s; about 90 s with reading. Well under 3 minutes. |
| 34 | Nearest place 10-15 s rule | PASS for places, note for start | Cracker -> doormat 13.0 s and doormat -> web 13.7 s are within 10-15 s. Nest -> first place is 34.9 s (see issue 1). |

## Reading check (grades 3-5)

| Card | Words (problem + why) | Longest sentence | Question |
| --- | --- | --- | --- |
| A Cracker Too Big | 61 | 11 | "How could you help ants move heavy food home faster?" |
| Giant Feet Coming | 58 | 12 | "How could you help ants stay safe from feet on a busy path?" |
| A Web in the Way | 69 | 11 | "How could you help ants get past the web safely to reach the strawberry?" |

All within 70 words and 18 words per sentence. Hardest words: "strawberry", "something"; "colony" and "silk" are explained in the card. Other on-screen text: help line "Move: arrow keys or W A S D - Look: drag the mouse - Read: walk to a pink ring", button "Read the message / click or press Enter", hint "Walk closer to read this!", headings "Why is it hard?", "Words to know", "Your design challenge", "Close". All simple. Nothing scary.

## Issues

| # | Issue | Owner | Severity | How to reproduce |
| --- | --- | --- | --- | --- |
| 1 | First place is far from the start: nest -> cracker takes 34.9 s (button at about 30 s). Guide says nearest place 10-15 s. Known, from the approved plan (nest in SE corner). | world-builder | minor | Load the page, hold W toward the cracker's pink dot. Moving the nest north-west would shorten it. |
| 2 | Nest start view is heavy: 1579 draw calls, 28 ms per render here; other views 3-8 ms. Slow school laptops may stutter at the start only. | world-builder | minor | Load the page, run `renderer.info.render.calls` in the console. Fix idea: merge small grass/pebble detail into a few meshes. |
| 3 | At 400 px width the longest card needs scrolling, and "Your design challenge" is below the fold with no scroll cue (the first screen ends in the middle of "Words to know"). Close stays visible. | world-builder | minor | Open "A Web in the Way" at 400x700. |
| 4 | Minimap shows the letter "N" (north mark). Brief says no English words; it is one letter, not a word. | world-builder | cosmetic | Look at the top right corner of the map. Remove if the teacher wants zero text. |
| 5 | Button text says "Read the message", but the pop-up is a problem card and design challenge. Possibly unclear to students. | learning-designer | cosmetic | Read the button. Alternative wording such as "Read the card" is the teacher's call. |
| 6 | Measured steady speed is 44.3 m/s, about 5% above the 42 m/s the teacher set (measured at about 30 fps in this pane; may be different at 60 fps). | world-builder | cosmetic | Hold W for 3.5 s from (700,300) facing west, use the last 2 s. |

No blocking issues.

## Not verified

- True frame rate (pane capped at about 30 fps and pauses between calls); only draw calls and per-render time were measured.
- Edge-to-edge walking time was estimated from the measured speed (about 56 s), not walked.
- Page without internet (A-Frame comes from aframe.io).
- file:// was checked in headless Chrome only (scene and hotspots build); no walk was done from file://.
- Phone, Quest and Vision Pro; real touch input; the pop-up in immersive VR (known limit: HTML pop-up not visible in a headset).
- Held keys were sent as page events, not by physical key hold (the tool cannot hold keys); mouse clicks, Enter, Escape, hover and drag were real.
- The pane's mobile emulation at 400x700 hides A-Frame's VR button, so overlap with it was not checked.
- Read checks are not saved on reload (known limit).
- Bonus: while checking file://, my open of the file:// URL was routed by the pane into existing tab-32 (a static snapshot of index.html); I did not change its page. One JS probe also ran there by mistake (it only moved a rig value in that static snapshot).

Screenshot of the full walk (arrived at the web, all 3 dots checked on the map): `_workspace/05_walk.png`.

RESULT: PASS
