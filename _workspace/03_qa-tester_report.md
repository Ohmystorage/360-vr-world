# Stage 3 QA report (keyboard movement + minimap, 3-place version)

Tools I had: Browser pane (navigate, screenshot, real key presses and real mouse drags, JS inspection, console, resize), Bash, file tools. Served on port 8135 (stopped afterwards; 8123 untouched). file:// opening was not tested.

Method: real single key presses (ArrowUp, S, D) and real mouse drags were used to confirm input works. Held keys, timing, and rams used simulated key holds (keydown, wait, keyup on window), with the aim steered by script each frame. The pane was 733x1135 (portrait), then emulated 360x640 and 1280x720.

| Check | Result | Evidence | Owner |
| --- | --- | --- | --- |
| Console | Pass | Only A-Frame 1.7.0 / THREE 173 log lines across 3 page loads. No errors or warnings | - |
| Arrow keys and WASD move | Pass | All 8 keys held 0.5 s moved the ant the correct way (W/Up forward, S/Down back, A/Left and D/Right sideways). Real taps also registered | - |
| Mouse drag looks | Pass | Real drag 200 px right turned yaw -92 to -115. Drag up raised pitch to 45 | - |
| No flying | Pass | Camera y stayed 1.6 with pitch +80 and -80 deg while holding W | - |
| Stops quickly | Pass | After keyup the ant slides 11 m (about 1.4 cm real) in about 0.25 s | - |
| Cracker start to doormat start | Pass | 10.7 s (simulated hold, 60 fps) | - |
| Doormat start to web start | Pass | 8.6 s | - |
| Mat front-middle to in front of web | Pass | 14.6 s | - |
| Edge to edge W to E (z 1000) | Pass | 35.3 s | - |
| Edge to edge N to S (x -1000) | Pass | 35.3 s | - |
| Corner to corner NW to SE | Pass (info) | About 55 s along the diagonal, no snags (trajectory sampled every 0.5 s) | - |
| Solids block the ant | Pass | Rammed 11 solids from 4 sides each (porch steps, doormat, sneaker, cracker, fence, fence post, end post, web, garden bed, bed edging, pot) with 2.2 s holds. Final position was never inside a footprint, except one test artifact (see note 1). House blocked. The ant is clamped at the play-area edges (x -1300, x 1170, z 1200, z -1280) | - |
| Neighbor houses | Pass | Outside bounds, so not reachable. They are visible in the distance | - |
| Strawberry unreachable | Pass | My own flood fill (2 m cells, ant radius 3, start at cracker) reached the mat, the lawn and the east edge. It did not reach the strawberry (476,-655), the bed, the gap between fence and bed, or the lawn behind the fence | - |
| Ant can stand at web with web and berry in view | Pass | From the place 3 start, walking forward stopped at x 397 (3 m from the web). Screenshot shows the web strands and the strawberry. In my portrait pane the web is only partly in frame at that close range | - |
| Minimap right side, does not cover the middle | Pass | Top right, 220 px at wide windows, 121 px at 360 wide. Middle of the view stays clear | - |
| Minimap landmarks recognizable | Pass, with a suggestion | Driveway (dark), sidewalk, porch steps and landing, doormat (brown), sneaker (blue), fence with posts, pot, garden bed (dark brown), lawn all show. There are no text labels and the house is only a pale strip at the top. See suggestion 2 | - |
| Minimap ant moves with ant, rotates with facing | Pass | At place 3 start the arrow points east, as the camera does. NW corner (-1298,-1198, facing NW): arrow at the top-left pointing NW. SE corner (1170,1198, facing SE): arrow at the bottom-right pointing SE. Drag-turn also rotates the arrow | - |
| Narrow window | Pass | At 360 px: map shrinks to 121 px, title wraps to 4 lines left of it (right edge 209 px, map starts at 227 px), no overlap | - |
| Key help in English, grades 3-5 | Pass | "Move: arrow keys or W A S D · Look: drag the mouse". Short, plain words | - |
| Title shows nearby place | Pass | Place 1: A Cracker Too Big, Place 2: Giant Feet Coming, Place 3: A Web in the Way at the starts. Plain "Ant's-Eye World" at the east edge | - |
| FPS | Pass | 59-60 fps while walking, worst frame 22-35 ms (one 69.6 ms hitch at the very first walk, during load) | - |
| Stage 1 re-check | Pass | 8 cards, exact 7 keys, unique kebab-case ids, 56-69 words each (limit 70), longest sentence 14 words, all questions start "How could you", empty `words` lists on rain-flood and giant-feet (as before) | - |
| Stage 2 re-check | Pass | All 3 `?place=` starts load and look right (cracker on sidewalk, doormat/steps/sneaker, web with strawberry and spider). Unknown or missing parameter starts at place 1 | - |
| East edge feel | Note | At x 1170 the ant just stops on open lawn with the grass, sky and neighbor house continuing. Nothing is drawn there. The dashed line on the minimap is the only clue. A 9-year-old will likely think the game is stuck. See suggestion 1 | world-builder |
| Web-block feel at the web | Note | The ant stops 3 m before the web, which fills the view. Reads as "I am at the web", not as a wall | - |

Notes
1. Ramming the pot from the north started at x 445, which is inside the fence boards, between the fence and the web block. The ant ended inside the fence footprint. That spot cannot be reached by walking (my flood fill confirms), so this is a test artifact, not a bug.
2. A first diagonal run seemed to stick at the mat's west face. It was caused by an earlier script of mine still running; a clean re-run walked smoothly around the steps and mat.
3. Real held keys cannot be sent with this tool; timings are simulated holds with scripted steering, the same method the builder used. Times match the builder's (10.7, 8.5, 14.7, 35.1).

Suggestions (none block the stage)
1. Make the east edge visible or soft: a hedge, fence or flower row at x 1170, or a short "You are at the edge of the yard" line when the ant is pushed against the boundary.
2. Add short text labels on the minimap (House, Driveway, Lawn, Fence, Garden). A child cannot read colors alone, and the house is only a thin strip.
3. The ant arrow is small (about 10 px at the narrow size). A slightly larger arrow or a pulse would help young students find themselves.
4. At the narrow size the title wraps to 4 lines; fine, but consider hiding line 2 on very narrow screens.

RESULT: PASS
