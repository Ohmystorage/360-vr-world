# Stage 3 - world-builder changes (walking + minimap)

Files: `index.html` (edited), `js/components.js` (new). `js/problems.js` not touched. The 3 places look the same.

## What I built
1. **Walking**: `wasd-controls="acceleration: 382; fly: false"` on the camera. Arrow keys and W A S D both work, and mouse-drag look is unchanged (`look-controls`, no pointer lock). The ant stays at eye height 1.6 m. Movement stops about 0.2 s after a key is released (it slides about 12 m, which is 1.5 cm real).
2. **Start yaw moved from the rig to look-controls**: the rig now always has rotation 0, so world x/z = rig + camera. `?place=` sets the rig position and `tilt()` sets both the look-controls pitch and yaw after load. First views are unchanged: place 1 yaw -70, place 2 yaw 25, place 3 yaw -92.
3. **One shared footprint list `window.YARD`** in `index.html` next to `PLACES`. It holds `bounds` (play area), `zones` (walkable ground, used only to draw the map) and `solids` (used for collision AND drawn on the minimap).
4. **`ant-walk` component** (`js/components.js`, on the camera, ticks after `wasd-controls`, checked in `scene.behaviors`). Each frame it:
   - pushes the ant out of every solid (circle or box, boxes can be rotated; ant radius 3 m; 2 passes so corners work). The ant slides along walls instead of sticking.
   - clamps the ant to the play area.
   - redraws the minimap ant marker, but only when the position or facing changed.
   - updates the title 4 times a second.
5. **Minimap**: top right, `min(220px, 32vw)` wide (so it shrinks on narrow screens), white frame. Two stacked 480 px canvases:
   - Base layer, drawn once: lawn, driveway, walkway, landing, house, porch steps, doormat, sneaker, cracker, fence and posts, garden bed with edging, flower pot. The area outside the play area is faded, and the play-area edge is a dashed white line. A tiny white "N" with a triangle sits at the top right.
   - Ant layer: a red arrow with a white outline, rotated to the camera's facing. North is up.
   - No place or card markers (those come in stage 4).
6. **Title box**: shows "Ant's-Eye World - Place N: <card title>" when the ant is within 450 m of a placed place point (the nearest one wins), otherwise "Ant's-Eye World". Line 2 is "Move: arrow keys or W A S D · Look: drag the mouse" (replaces "Drag the mouse to look around."). The box has `box-sizing: border-box` and a max-width, so it never runs under the map.
7. `?place=heavy-cracker | giant-feet | fence-web` stays as the teacher shortcut. No parameter or an unknown id starts at place 1.

## Speed values
- `acceleration: 382`. A-Frame's steady speed is about 0.183 x acceleration, so the target was 70 m/s.
- Measured steady speed: **70.0 m/s** (W held 5 s at 60 fps; 279.2 m between t = 1.01 s and t = 5.00 s). It takes about 0.4 s to reach full speed.

## Measured walk times
All walks were simulated in the browser with key holds (W held, aim pointed at the target each frame, real collision on), at 1280x720 and 60 fps.

| Walk | Path | Time |
| --- | --- | --- |
| Cracker start spot (-594, 420) -> doormat start spot (-188, -205) | 735 m | **10.7 s** |
| Cracker north side (-540, 372) -> doormat front middle (-440, -212) | 583 m | 8.5 s |
| Doormat start spot -> web start spot (220, -640) | 585 m | 8.5 s |
| Doormat front middle (-440, -212) -> in front of the web (403, -649) | 998 m (slides past the sneaker) | **14.7 s** |
| West edge -> east edge (z 1000) | 2449 m | **35.1 s** |
| North edge -> south edge (x -1000) | 2456 m | **35.2 s** |
| NW corner -> SE corner (diagonal) | about 3490 m | about 55 s |

Cracker -> doormat is about 11 s as planned. Doormat -> web is 8.5-14.7 s depending on where the student stands at the mat: from the place-2 start spot (the mat's south-east corner) it is short, and from the mat's front middle it is about 14 s. The layout plan said 13 s, measured center to center. Edge to edge is 35 s, inside the 30-40 s target.

## Play area and footprint list (scene m; x = east, z = south)
Play area: x -1300..1170, z -1280..1200. The north edge is the house wall. The east edge is the garden bed's east end, so the ant cannot walk around the bed into the strawberry strip.

| Solid | Shape | Values | On map |
| --- | --- | --- | --- |
| house | box | x -400, z -1680, 4400 x 800 | yes |
| porch steps (incl. nosing) | box | x -440, z -914, 510 x 732 (z -1280..-548) | yes |
| doormat | box | x -440, z -380, 480 x 320 | yes |
| sneaker | box, rot 150 | x -60, z -480, 86 x 296 | yes |
| cracker | box | x -540, z 400, 48 x 48 | yes |
| fence boards | box | x 448, z -887, 18 x 788 (z -1281..-493) | yes |
| fence post | box | x 400, z -900, 80 x 80 | yes |
| end post | box | x 400, z -535, 80 x 80 | yes |
| spider web | box | x 420, z -672, 40 x 194 (x 400..440, z -769..-575) | no |
| garden bed (with edging) | box | x 832, z -540, 676 x 520 | yes |
| bed edging piece at fence end | box | x 479, z -497, 54 x 24 | yes |
| flower pot | circle | x 445, z -438, r 62 (base; the rim r 86 is overhead) | yes |
| neighbor house east | box | x 4300, z 1700, 3000 x 2600 | outside map/bounds |
| neighbor house west | box | x -5200, z 300, 3000 x 3400 | outside map/bounds |

Map-only zones: lawn (x 540, z -150, 1920 x 3300), driveway (x -1155, z 0, 990 x 3600), walkway (x -540, z 680, 240 x 1640), porch landing (x -340, z -350, 840 x 420).

## How to test
- `python -m http.server 8134` in the project folder, then open http://127.0.0.1:8134/index.html (or `?place=giant-feet`, `?place=fence-web`).
- Click the scene once, then hold the arrow keys or W A S D. Drag the mouse to turn.
- Try to walk into the cracker, the doormat (all 4 sides), the sneaker, the porch steps, the fence, the posts, the web, the pot and the garden bed: the ant stops and slides along them.
- Walk to the far edges: the ant stops at the dashed line shown on the map.
- Watch the red arrow on the map: it moves the way you walk and points where you look.

## Checked in browser (127.0.0.1:8134, 1280x720, then a 400x700 narrow check)
- Console: only the A-Frame 1.7.0 / THREE 173 logs. No errors or warnings.
- Real key events (ArrowUp, D) and a mouse drag move and turn the ant. Simulated holds were used for timing.
- Every listed solid was rammed head-on. The ant stopped exactly 3 m from each footprint (cracker, doormat south and east, sneaker, porch steps front, side and from the mat gap, fence boards, fence post, web, pot, bed south side, house). Bounds: stopped at x -1300, x 1170, z 1200, and 3 m from the house wall.
- Visual stop checks: the cracker edge, the mat's rubber border, the sneaker sole, the pot and the web each fill the view with no clipping. At the web the whole web is in view, with the strawberry behind it.
- Strawberry unreachable: a flood fill over the walkable grid (3 m cells, same footprints, ant radius 3) from the place 1 start reaches the doormat and web start spots. It does not reach the strawberry cell (476, -655) or the lawn behind the fence (800, -1000). A steered walk at the berry from the south ends against the pot.
- Map direction: walked to the NW corner (arrow at the top-left, pointing north-north-west as the camera faced) and to the SE corner (arrow at the bottom-right, pointing south-east). The arrow pointed east-north-east at the place 1 start (yaw -70).
- 60 fps standing (place 1 view, about 1025 draw calls) and 60.7 fps while walking (worst frame 21.6 ms).
- Narrow 400x700: the map shrinks to 128 px at the top right, and the title wraps beside it without overlapping. The middle of the view stays clear.
- Server on 8134 stopped. Port 8123 not touched.

## Known limits
- **Invisible east edge**: the play-area edge at x 1170 has nothing drawn in 3D (the lawn continues past it). The dashed line on the minimap shows it. A visible fence or hedge there would be a scene change for the teacher to approve.
- Low things not in the list are walk-through: the garden hose (12.8 m thick, so the camera passes through it), the asphalt patch and lip (1-5 m), the stone under the cracker, dandelion leaves, clover, crumbs, pebbles. Grass blades are walk-through by design.
- The sneaker footprint is a box, so its rounded toe and heel corners stop the ant up to about 17 m early.
- The 8 m gap between the doormat and the bottom step is walkable (it is where the crumbs are), but it is a narrow corridor.
- The spider web block starts 24 m in front of the web on purpose, so the student sees the whole web with the berry behind it, instead of standing inside the bottom spoke.
- The title switches places by straight-line distance (450 m), not by line of sight. At the place-2 start spot it shows Place 2. Near the lawn's east and south edges it shows only the world name.
- Mouse-drag direction is A-Frame's default (unchanged from stage 2).
- No freeze-on-pop-up yet (stage 4 toggles `wasd-controls` `enabled`).
- file:// double-click still not checked in a real browser. `js/components.js` is loaded with a plain `<script src>`, so it should work the same way as `js/problems.js`.

## Revision 1 (teacher feedback: no English names on the map, ant-shaped marker, 75% speed)

Files: `js/components.js` (`drawAnt` only), `index.html` (the `acceleration` value and the speed comment in the YARD script). Nothing else changed: the map shapes, east edge, collision, title and places are the same.

### What changed
1. **Map marker is now a small ant** instead of the red arrow. Seen from above: head, thorax and abdomen (three dark ovals with small gaps between them), six bent legs, and two elbowed antennae. Dark brown-black (`#1c1410`) with a white outline, so it shows on the green lawn, the gray walkway, the dark driveway and the faded area outside the play area. The head points the way the camera faces. Drawn with two `Path2D` shapes (lines and ovals) in a white pass then a dark pass, and still only redrawn when the ant moves or turns.
   - Size: about 52 x 30 canvas px (the old arrow was about 31 x 24). On screen that is about 24 px long on the 220 px map and about 14 px long on the narrow 128 px map (the old arrow was about 10 px there).
   - No text labels were added. (The small "N" north mark from stage 3 is still there; it was not part of this request.)
2. **Walking speed 75%**: `wasd-controls` acceleration 382 -> **286.5**. Damping (easing) is unchanged, so the stop on key release works the same way.

### Measured (127.0.0.1:8136, 1280x720, 60 fps, simulated W hold with aim steered each frame, real collision on; same method as before)
| Walk | Path | Before | Now |
| --- | --- | --- | --- |
| Steady speed (t 1-4 s) | - | 70.0 m/s | **52.4-52.5 m/s** |
| Cracker start spot (-594, 420) -> doormat start spot (-188, -205) | 741 m | 10.7 s | **14.3 s** |
| Cracker north side (-540, 372) -> doormat front middle (-440, -212) | 588 m | 8.5 s | 11.4 s |
| Doormat start spot -> web start spot (220, -640) | 591 m | 8.5 s | **11.4 s** |
| Doormat front middle (-440, -212) -> in front of the web (stops at 397, -644) | 975 m | 14.7 s | **19.5 s** |
| West edge -> east edge (z 1000) | 2470 m | 35.1 s | **47.2 s** |
| North edge -> south edge (x -1000) | 2477 m | 35.2 s | **47.3 s** |

- Stop on release: the ant slides 8.8 m (was about 11-12 m), about 1.1 cm real. 95% of the slide is done in 0.53 s, the same timing as before because the damping did not change.
- Marker direction: NW corner (-1290, -1190) facing north-west: ant at the map's top-left, head up-left. SE corner (1160, 1190) facing south-east: ant at the bottom-right, head down-right. Place 1 start (yaw -70): head east-north-east.
- Console: only the A-Frame 1.7.0 / THREE 173 logs. (One Canvas2D `willReadFrequently` warning came from my own pixel-reading test script, not from the page.)
- Narrow 400x700: the ant is a clear dark mark with a white rim on the 128 px map.
- Server on 8136 stopped. Port 8123 not touched.

### Known limits (new)
- **Edge to edge is now about 47 s and cracker -> doormat about 14 s.** That is outside the skill's 30-40 s edge-to-edge target, but it is what the teacher asked for. The yard layout was not changed to make up for it.
- The ant marker is drawn on top of map objects (doormat, sneaker) and can cover them when the ant stands next to them, like the arrow did.

## Revision 2: east boundary (teacher feedback: the ant stops on open lawn at the east end)

Files: `index.html` only (one new empty entity `#yard-hedge`, two new `YARD.solids` entries, one build block at the end of the script, comments). `js/components.js`, `js/problems.js`, the walking speed (`acceleration: 229.2`) and places 1-3 are unchanged. The hedge is built after every older random call, so all older detail is placed exactly as before.

### What changed
1. **Low hedge along the east edge**: boxwood-like rounded shrub masses, dark green (darker than the lawn), with small diamond leaves on the side the ant faces and a few small white, pale pink and cream flowers with yellow centers. About 35-45 cm real (280-330 m tall, 300 m deep). It runs from inside the house wall (z -1290) past the south edge (to about z 1370), touching the garden bed's east edging at x 1170, so there is no lawn gap at the house corner or the bed corner.
2. **Same hedge along the lawn part of the south edge** (trivial continuation, see "Other edges" below): north face at z 1200, from the east hedge to x -260 (rounded end just before the walkway at x -420). This closes the south-east corner, which otherwise showed the hedge simply ending on open lawn.
3. **Collision and minimap use the shared list**: `YARD.solids` gets `hedge east` (x 1170..1470, z -1290..1310) and `hedge south` (x -420..1300, z 1200..1500), color `#2e5a22`. No shrub, leaf or flower vertex is in front of these faces (checked over all 54,518 vertices), so the ant stops 3 m from the face, about 3-9 m from the nearest leaves. `bounds` are unchanged.
4. **Minimap**: a dark green strip appears on the east side (outside the dashed line) and along the lawn part of the south side. No text labels.
5. **Lean build**: every shape (2 core boxes, about 60 shrub spheres, about 3,200 leaves, about 30 flower parts) is merged into ONE mesh with vertex colors and flat shading, built with plain three.js geometry in the page script (no new files, no models).

### How to test
- `python -m http.server 8137` in the project folder, open http://127.0.0.1:8137/index.html.
- Walk east anywhere on the lawn: the ant stops right at the hedge's leaves. Look up: rounded shrub masses fill the view.
- Walk south on the lawn: same hedge. Walk into the south-east corner: the ant stops in the corner of the hedge.
- Look at the minimap: green strip on the east side and on the lawn part of the south side.

### Checked in browser (127.0.0.1:8137, 1280x720)
- Console: only the A-Frame 1.7.0 / THREE 173 logs. No errors or warnings.
- Walk east (W held, real collision on) from z -277 (next to the bed's south-east corner), -200, -150, 0, 600, 1000 and 1199: the ant stopped at x 1167 every time. Walk south from x -400, 0 and 900: it stopped at z 1197. A walk south-east into the corner stopped at (1167, 1197).
- Views from ant height: from 170-600 m away the hedge reads as a low green wall of rounded bushes, with the neighbor's house behind it. At the stop point, leaves and bush faces fill the view. The hedge meets the bed's east edging and the house wall with no gap.
- Place 1 first view: the hedge is hidden behind the walkway grass (no visible change). Places 2 and 3 face away from it.
- Strawberry still unreachable: flood fill (3 m cells, all solids including the hedge, ant radius 3) from the place 1 start reaches the doormat and web start spots, the hedge face and the south-east corner, but NOT the strawberry (476, -655) or the lawn behind the fence (800, -1000). The hedge only adds solid area and `bounds` did not change, so no new path exists.
- Draw calls: **+1** at every view tested (place 1 start 1025 -> 1026, place 2 318 -> 319, place 3 253 -> 254, lawn facing east 67 -> 68). Triangles: +32,448 when the hedge is on screen (one mesh, so it is drawn as a whole).
- FPS: 60.1 standing at the place 1 start (worst frame 17.1 ms), 60.1 walking toward the hedge (worst 20.3 ms), 60.0 looking at the south hedge.
- Server on 8137 stopped. Port 8123 not touched.

### Other edges
- **North (z -1280)**: the house wall. The ant stops 3 m from a visible wall. OK.
- **South, walkway and driveway part (x -1300..-420, z 1200)**: still an invisible stop. The walkway and driveway continue south past the line with nothing there, so the ant just stops on concrete or asphalt. Not fixed: a hedge across a path or driveway would not look right; this needs a different object (for example a curb and street, or a front fence with a gate) for the teacher to choose.
- **West (x -1300, on the driveway)**: also an invisible stop. The driveway continues to x -1650 with nothing at the line. Not fixed, same reason.

### Known limits (new)
- The hedge is one mesh, so its 32k triangles are drawn whenever any part of it is on screen (still 60 fps here).
- At the hedge's west end (x -420..-300 on the lawn) the rounded end curves away, so the ant stops up to about 40 m short of the leaves there.
- Leaves stick out up to 9 m and are only on the low, ant-facing side. Seen from far away or from above, the bushes are plain faceted shapes.

## Revision 3: west and south boundaries (teacher feedback: "West and south boundaries too")

Files: `index.html` only (one new empty entity `#yard-edges`, one new `zones` entry, four new `YARD.solids` entries, one build block at the end of the script, and the hedge's merge code moved into a small `merged()` helper that the new block reuses; the hedge comes out exactly the same). `js/components.js`, `js/problems.js`, walking speed (`acceleration: 229.2`), places 1-3 and the east/south hedge are unchanged. The new block runs after every older random call, so all older detail is placed exactly as before.

### What changed
1. **West edge (x -1300), whole length: low brick border + the family car right behind it.**
   - Brick border: red-brown bricks (20 x 6 x 6 cm real = 160 x 48 x 46 m) with light mortar joints, from the garage door (z -1265) to the front fence (z 1198). East face at x -1300.
   - Why a border and not only the car: at x800 even a small car is longer than the whole west edge, and between its front and rear wheels there is a 15 cm real (120 m) open gap under the car. Without something low along the edge the ant would stop on open asphalt in that gap. The border closes the whole line with one natural object.
   - Family car: small red hatchback parked on a gravel strip right behind the border, nose toward the house. At ant scale: giant tires (rubber with two rows of tread blocks, dark sidewall ring, silver wheel cover with 5 slots and a center cap), dark sill, wheel wells, dark underside (engine, oil pan, fuel tank, muffler, exhaust pipe, axles), plus body, cabin, slanted windshield, hatchback rear window, side windows, mirrors, door gap and handles, bumpers, grille, headlights, taillights and blank plates (no text). The east tires stand 8 m behind the bricks. Only the side mirror reaches over the play area, 780-860 m up.
   - Size: 2320 x 1280 x 1185 m = 2.9 x 1.6 x 1.45 m real (a compact car, a little short so it fits between the house and the front fence).
2. **South edge, walkway and driveway part: white picket fence with two closed gates.**
   - Pickets 9 x 2 cm real (72 x 16 m) with pointed tops, about 70 cm real tall, rails and posts on the street side. A solid bottom board (16 cm real = 130 m) runs the whole length, so there is no gap an ant could use (also under the gates).
   - Closed **driveway gate** (two leaves, x -1256..-744, tops dipping toward the middle) and closed **garden gate** across the walkway (x -656..-424, arched top). Gate posts with ball caps at x -1300 (south-west corner), -700 and -380. Black hinges and latches; frame rails and a diagonal brace behind each leaf.
   - The fence runs from x -3000 (behind the car, so it does not end in mid-air) to x -260, where its bottom board disappears into the hedge's rounded west end. The corner post at x -1300 meets the end of the brick border: no gap at the south-west corner.
   - The fence's yard side faces north, away from the sun, so its paint uses a little self-light (emissive) to still read as white.
3. **Fix found while testing (north edge on the driveway):** the garage door box sticks out 15 m from the house wall, and the ant used to stop 12 m inside it (the screen turned beige). New solid `garage door` (not drawn on the map): the ant now stops 3 m in front of the door.
4. **Shared list (`window.YARD`)**:
   - `solids`: `garage door` (x -1630..-730, z -1285..-1265, no map color), `brick border` (x -1348..-1300, z -1265..1198, `#7a3e2a`), `car` (x -2628..-1348, z -1170..1150, `#c0392b`; it is behind the border, so it never stops the ant itself), `front fence` (x -3000..-340, z 1198..1238, `#f4f2ec`).
   - `zones`: gravel strip under the car (x -2900..-1348, z -1280..1200, `#9d968a`).
   - `bounds` are unchanged.
5. **Minimap**: red rectangle (car) at the left edge, thin dark-brown strip (border) beside it, thin white strip (fence) along the bottom from the left edge to the hedge. No text. The map frames only x -1455..1325, so just the east 107 m of the car shows (a red bar along the left edge).
6. **Lean build**: everything is merged into **3 meshes** with vertex colors and flat shading (matte: bricks, tires, underside, trim; shiny: car paint, glass, lights, wheel covers; white fence paint). 7,026 triangles in total.

### How to test
- `python -m http.server 8138` in the project folder, open http://127.0.0.1:8138/index.html.
- Walk west across the driveway from anywhere: the car grows ahead (tires, wheel covers, underside); the ant stops right at the brick border. Drag the mouse to look up.
- Walk south on the walkway or the driveway: the ant stops at the picket fence, the garden gate or the driveway gate.
- Walk into the south-west corner (driveway, toward the car's rear): the ant stops where the border meets the fence corner post.
- Walk north on the driveway to the garage door: the ant stops in front of the door.
- Minimap: car, border and fence shapes on the left and bottom edges.

### Checked in browser (127.0.0.1:8138, 1280x720)
- Console: only the A-Frame 1.7.0 / THREE 173 logs. No errors or warnings.
- Walk west (W held, real collision on) from x -1180 at z -1260, -900, -610 (front tire), 0, 500, 750 (rear tire), 1100 and 1194: stopped at x -1297 every time.
- Walk south from z 1080 at x -1296, -1200, -1000 (driveway gate middle), -870, -700 (gate post), -540 (garden gate), -425 and -380: stopped at z 1195 every time (3 m from the post faces, 4 m from the bottom board). At x -300 (hedge) it stops at z 1197 as before.
- South-west corner (walking south-west): stopped at (-1297, 1195). North-west corner (walking north-west): stopped at (-1297, -1262). Walking north at x -1000 and -1250: stopped at z -1262 (3 m from the garage door).
- Views from ant height: from the driveway/walkway 400-700 m away, the car fills the view above the brick border with both tires, wheel covers and the dark underside clearly visible. Looking south, the white fence with the gates and black hinges fills the view; the hedge meets the fence's east end with no visible gap. At each stop point the nearest face (bricks or fence board) fills the view, as with the hedge.
- Place 1 first view: no new object visible (the car is behind the camera and the fence is outside the view to the south). Draw calls 1026 -> 1029 there only because the new meshes' bounding boxes reach the view.
- **Place 2 first view changed**: the car's front wheel and red body now show at the left edge, behind the doormat (the car stands in line with the garage). Place 3's view is unchanged (254 draw calls, nothing new).
- Strawberry still unreachable: flood fill (3 m cells, all solids including the new ones, ant radius 3) from the place 1 start reaches the doormat and web start spots and both west corners, but NOT the strawberry (476, -655) or the lawn behind the fence (800, -1000). Bounds did not change and new solids only add blocked area.
- Draw calls: **+3** when the new objects are in view (place 1 start 1026 -> 1029, place 2 start 319 -> 321, car view 304 -> 307, fence view 36 -> 39), 0 at place 3. Triangles: +7,026 at most.
- FPS: 60.3 standing at place 1 (worst frame 20.3 ms), 60.3 at place 2, 60.0 looking at the car, 60.3 at the south-west corner, 60.3 walking west toward the car (worst 21 ms).
- Server on 8138 stopped (port checked free afterwards). Port 8123 not touched.

### Known limits (new)
- At the stop point the bricks fill the view: a 6 cm real border 3 m away is taller than everything the camera sees, so the car above it shows only from about 20 m back or more (the same as the hedge's leaves at its stop). The ant stops at the border, not at the tire sidewall itself.
- The car is shorter than a real family car (2.9 m real) so it fits between the house and the fence, and it stands partly in front of the garage door's west end. The garage door was left as it was so place 2's view changes as little as possible.
- The car shows in place 2's first view (left edge). The car already fills the space between the house and the fence, so it cannot simply be moved out of that view; keeping place 2 exactly as before would need a different blocker on the west edge (teacher's choice).
- On the minimap only the east 107 m of the car is inside the map frame, so it shows as a red bar, not the whole car outline.
- No shadows in this scene, and the white fence uses a little self-light, so it looks a bit flat from close up.
