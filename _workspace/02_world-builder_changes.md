# Stage 2 (place 1 only) - world-builder changes

## What I built
- New `index.html` (A-Frame 1.7.0 from the aframe.io CDN, `js/problems.js` loaded with `<script src>`; no fetch).
- Place 1 "heavy-cracker" slice:
  - Concrete sidewalk strip (light gray box, top at y=0) with dark joints every 150 m.
  - Dark asphalt driveway on the west side, 0.8 m lower, with a rough edge of dark grit bumps (1-4 m).
  - Lawn on the east side: a dirt strip at the edge plus about 400 giant grass blades (3-sided cones, 64-112 m tall) in 4 rows.
  - Big golden square cracker (48 x 48 x 4.8 m) with 16 dark docking holes on top. Its far edge rests on a small stone, tilted 20 degrees, so the holed top is visible from ant eye height.
  - Ground detail near the camera: about 110 sand grains, about 28 pebbles, 5 cracker crumbs, and one cut grass blade lying on the sidewalk.
- Giant backdrops (primitives only): our house to the north (wall, roof, garage door, 2 windows, red front door, 3 porch steps 144 m high each), a blue neighbor house to the east, and a peach neighbor house to the west. Pale blue sky with light linear fog.
- Camera: rig on the ground at (-594, 0, 420), eye at y=1.6, about 32 m from the cracker's near edge. It faces east and a little north (yaw -70), tilted up 12 degrees (set on `look-controls` pitchObject after load). First view: the cracker in front, grass towering behind, house porch on the left, neighbor house on the right.
- Mouse-drag look only: `wasd-controls="enabled: false"`. No movement, bounds, minimap, hotspots or pop-ups.
- Title box (top left) shows "Ant's-Eye World - Place 1: " plus the card title read from `js/problems.js`, and the hint "Drag the mouse to look around."
- `window.PLACES`: one shared layout list (id, x, z) for all 8 cards. On load, each id is checked against `ANT_PROBLEMS`, and a console warning is shown if a card is missing.

## Scale numbers (x800: 1 real cm = 8 m)
| Thing | Real | Scene |
| --- | --- | --- |
| Ant eye | 2 mm | 1.6 m |
| Cracker | 6 x 6 cm, 6 mm thick | 48 x 48 x 4.8 m |
| Grass blades (unmowed edge) | 8-14 cm | 64-112 m |
| Pebbles / stone under cracker | 1-6 mm / 1.8 cm | 0.5-2.6 m / r 7.2 m |
| Sand grains | 0.1-0.4 mm | 0.05-0.35 m radius |
| Crumbs | 1-3 mm | 1-2.5 m |
| Asphalt grit | 1-5 mm | 1-4 m |
| Sidewalk joint | 6 mm | 5 m |
| Porch step | 18 cm | 144 m |
| House wall | 3.5 m | 2800 m |
Distances are compressed (mini yard). The sidewalk is 240 m wide (real sidewalks would be about 960 m at this scale).

## Planned positions (scene m; x = east, z = south)
Zones: driveway x -1650..-660; sidewalk x -660..-420 (z -1080..1500, porch to front fence); lawn x -420..1000; garden bed x 1000..1500 (z -200..1500); house wall z = -1800; front fence z = 1500; east fence x = 1500; trash bin about (900, -1550).

| # | id | x | z | Spot |
| --- | --- | --- | --- | --- |
| 1 | heavy-cracker | -540 | 400 | sidewalk middle (BUILT) |
| 2 | nest-guard | 850 | -150 | lawn edge by garden bed |
| 3 | rain-flood | 1250 | 500 | garden bed, hose, nest side hole |
| 4 | hot-driveway | -1150 | -350 | middle of driveway |
| 5 | lost-trail | 600 | -900 | lawn path, nest to trash bin |
| 6 | giant-feet | -440 | -880 | doormat at bottom of porch steps |
| 7 | sidewalk-gap | -540 | 1350 | sidewalk crack by front fence |
| 8 | fence-web | 1400 | 1420 | fence post, garden bed end |

Walking-time plan: assumed speed of about 70 m/s (wasd acceleration about 400; A-Frame steady speed is roughly 0.18 x acceleration). Nearest neighbors are 700-1000 m apart (about 10-15 s). One tour order (7 > 1 > 4 > 6 > 5 > 2 > 3 > 8) is about 6.9 km, or about 100 s. The play area is about 3100 m east-west (about 44 s at the assumed speed, slightly over the 40 s target). Stage 3 must measure the real speed. If it differs, scale all PLACES and zones by one factor.

## How to view
- Local server: in the project folder run `python -m http.server 8765`, then open http://127.0.0.1:8765/index.html
- Or double-click `index.html`.
- Drag with the mouse to look around. Keys do nothing yet (by design).

## Checked in browser
- Served on 127.0.0.1 and viewed at 1280x720 in the Claude Browser pane. No console errors or warnings (only the A-Frame and THREE version logs).
- Mouse drag turns the view. Pressing W for 0.8 s left the camera at (-594, 1.6, 420).
- The scene has about 690 entities and loads quickly on desktop.

## Known limits
- Not verified with a true file:// open. The Browser pane shows local files as a `data:` snapshot, where the relative `js/problems.js` cannot load: the console showed "No card for place id" warnings and the title used its built-in fallback. In a normal browser, `<script src>` over file:// works, but someone should check by double-clicking.
- In touch or phone emulation, A-Frame shows its "Access this site over HTTPS..." device-sensor prompt (expected over plain HTTP; press Cancel).
- From 1.6 m eye height, the flat driveway looks like a thin dark band. The grit bumps help, but it stays low (real geometry).
- Only the slice around place 1 has detail. Elsewhere the lawn, driveway and sidewalk are flat planes. No fences, hose, garden bed or doormat yet.
- About 690 separate meshes. This is fine on desktop and untested on Quest; merge or instance the grass later if a headset is slow.
- Drag direction is A-Frame's default "grab" style (drag right turns the view left).

## Revision 1 (teacher-approved QA suggestions; index.html only)

### What changed
1. Sidewalk reads as concrete
   - Sidewalk color `#d3cfc6` (beige) -> `#aab0b5` (cool light gray).
   - Joints: darker (`#5c5b59`) and 6 m wide (6-8 mm real). The joint grid is shifted so one joint runs at z = 410, 10 m to the left of the start spot; in the first view it is a dark line from the lower left to the cracker.
   - Sand grains are warmer gold/tan and pebbles are browner, so both stand out on the gray. Same counts and positions as before (seeded).
2. Driveway readable as asphalt near place 1 (all sizes x800)
   - Broken asphalt lip along the driveway edge (x about -676..-660, z 150..700): pieces 25-70 m long, 2-5 m high (2.5-6 mm real), slightly tilted, with 1.5-4.5 m crack gaps between them. Each piece has 6 light stones (aggregate, 0.3-0.8 m) on its broken face.
   - 5 asphalt chunks broken off the lip, lying on the sidewalk.
   - 40 loose bits on the sidewalk by the edge (half dark asphalt, half light stone, 0.4-1.5 m).
   - Asphalt patch over a broken sidewalk corner (3 overlapping slabs, about 1 m high), reaching to about 20 m from the start spot. It has light gravel and a dark crack on top.
   - Shiny black tar-filled crack (about 0.6 m high, 2.5 m wide) crossing the sidewalk at about z 452, 30 m to the right of the start spot.
   - On the driveway past the lip: 8 dark cracks and 50 light gravel bits (0.6-2 m).
3. Neighbor house wall at about +270 degrees (west face of the blue house, x = 2800)
   - Old two plain blue squares replaced by 2 framed windows (white frame, cross bars, sill).
   - Green side door with white frame, gold knob and a 144 m step (18 cm real).
   - Gray foundation band, white corner trim, white gutter along the top, downspout with an elbow at the corner.
   - Lap siding lines every 160 m (20 cm real).
   - 4 bushes (3 flat-shaded green spheres each, about 400-500 m tall = 50-60 cm real) at the base.
- No movement, hotspots or minimap added. Camera position, yaw and 12 degree tilt unchanged. All new random calls come after the old ones, so the old objects keep their places.

### How to test
- Serve: `python -m http.server 8125` in the project folder, open http://127.0.0.1:8125/index.html (or double-click index.html).
- First view: gray sidewalk with a dark joint line on the left leading to the cracker; gold sand and brown pebbles; cracker centered with grass behind.
- Drag to turn about 180 degrees (west / southwest): the dark asphalt patch close by, the broken lip behind it with gaps and gray stones, chunks and gravel on the sidewalk, the black tar crack.
- Drag to turn about 270 degrees (south / southeast): the blue neighbor wall with siding, two framed windows, a green door with a step, trim, gutter and downspout.

### Checked in browser (127.0.0.1:8125, 1280x720 emulated)
- Console: only the A-Frame 1.7.0 and THREE 173 logs; no errors or warnings.
- First view: unchanged framing (cracker centered, grass towering behind, house porch left, neighbor house right). The sidewalk now looks gray, not sandy; one joint line is clearly visible; sand grains and pebbles contrast with the gray.
- +270 view: the neighbor wall now shows siding lines, a door, framed windows and corner trim; the tar crack is visible as a black line across the sidewalk.
- West view: the asphalt patch and lip now show as raised dark slabs with gaps and stones instead of a flat band.
- 60 fps, 430 draw calls, about 10k triangles (was 267 calls, 4.6k triangles). About 970 entities in the scene (was about 690).
- Server on 8125 stopped after the check. Port 8123 not touched.

### Known limits (Revision 1)
- The bushes at the neighbor wall are hidden behind the giant grass from the start spot. They will show once the ant can move (stage 3).
- The small light stones on the asphalt lip are 60+ m away and only a few pixels wide in the small Browser pane screenshot. The lip's height and gaps read well, but the stone texture is subtle.
- Only one sidewalk joint is clearly visible in the first view. The next ones are 140-160 m away and look thin from 1.6 m eye height. That is the real geometry; I kept the 150 m spacing.
- Draw calls rose to about 430. Still 60 fps on desktop; not tested on Quest.
- file:// double-click was still not checked in a real browser.

## Place 6 + compact layout (3-place version; index.html only)

Teacher's decision: only 3 places for now, walk order cracker -> doormat -> web ("sidewalk -> house -> garden"). `js/problems.js` not touched.

### What changed
1. Compact layout
   - Place 1 (cracker) and the default start camera (-594, 0, 420), yaw -70, tilt 12 are unchanged.
   - Our house, roof, windows, garage door, front door and the 3 porch steps moved 520 m south (house wall z -1800 -> -1280; bottom step front face z -1080 -> -560). From place 1 the porch is now closer and larger on the left side of the first view. The cracker framing is the same.
   - The walkway (old "sidewalk" box) now runs z -140..1500. A new concrete landing (x -760..80, z -560..-140, same gray) sits at the foot of the steps, so the walkway leads straight to the porch. There is one joint line at the landing edge (z -140). The 150 m joint grid is kept (the joint at z 410 near the start is unchanged).
   - Step nosings (lighter 1 cm overhang on each step) and a dark dirt line at the bottom step's base, so the three steps read as steps, not one wall.
   - The front door was moved 4 m forward (z -1275 -> -1271) to fix z-fighting with the window frame. That z-fighting was there before; it shows more now that the house is closer.
   - `window.PLACES` is reordered (placed ones first, in walk order) and has `placed: true/false` plus a `start` camera for the preview. The 5 unplaced cards keep their old coordinates with `placed: false`. Nothing is drawn for them (nothing was before either). The missing-card console check still runs on all 8.
   - fence-web gets a reserved spot only (not built). Planned for the next build: a wooden fence line along x ~400 from the house wall (z -1280) south to an end post at about z -640, with a garden bed east of the end post.
2. Place 6 "giant-feet" (all inside `#place-giant-feet`, built in the script after all older random calls, so place 1 objects keep their positions)
   - Rubber-backed coir doormat, 60 x 40 cm real = 480 x 320 m (x -680..-200, z -540..-220), 20 m in front of the bottom step. It has a dark rubber base (1.5 m), a slightly raised rubber edge (3.2 m high, 12 m wide), 30 coir ridges running east-west (6-9 m tall = about 1 cm real, 6 m wide, 4 m gaps), short loose fibers sticking out of the east and south edges, and 10 loose coir fibers (16-32 m long) lying on the concrete.
   - Bottom porch step 144 m (18 cm real) towers behind the mat, with steps 2 and 3 and the front door above it.
   - Crumbs (the food reason): 12 in the gap between the mat and the step, 16 along the mat's east side, 8 close to the camera, and 4 larger cookie bits (3.5-5 m = 4-6 mm).
   - A giant blue sneaker (28 x 10 x 10 cm real = 224 x 84 x ~90 m) left on the landing just east of the steps, toe turned toward the start view. It has a white sole with a dark bottom edge, a blue upper, toe cap, heel collar, tongue, white laces and a white side stripe. No logo.
   - Ground detail at the camera: 80 sand grains and about 16 pebbles.
   - A muddy shoe print was tried and then removed. From 1.6 m eye height it only showed as a dark band that hid the step base, so the shoe alone sells "giant feet".
3. Temporary preview switch and title
   - `index.html?place=giant-feet` starts at the doormat: rig (-130, 0, -260), yaw 10, tilt 18. `?place=heavy-cracker`, no parameter, an unknown id, or `?place=fence-web` (no start yet) all give the place 1 start.
   - The title shows "Place N: <card title>". N is the walk order among placed places (cracker 1, doormat 2, web 3), and the title comes from `js/problems.js`.
   - Remove the switch, or keep it as a teacher shortcut, once walking works in stage 3.

### PLACES (scene m; x = east, z = south)
| Walk | id | x | z | placed | Spot |
| --- | --- | --- | --- | --- | --- |
| 1 | heavy-cracker | -540 | 400 | yes (built) | sidewalk middle |
| 2 | giant-feet | -440 | -380 | yes (built) | doormat center, foot of porch steps |
| 3 | fence-web | 400 | -660 | yes (next build) | fence end post by garden bed |
| - | nest-guard | 850 | -150 | no | - |
| - | rain-flood | 1250 | 500 | no | - |
| - | hot-driveway | -1150 | -350 | no | - |
| - | lost-trail | 600 | -900 | no | - |
| - | sidewalk-gap | -540 | 1350 | no | - |

### Distances (straight line, at the planned ~70 m/s)
| Leg | Distance | Time |
| --- | --- | --- |
| cracker -> doormat | 786 m | ~11 s |
| doormat -> web | 885 m | ~13 s |
| cracker -> web (not a walk leg) | 1417 m | ~20 s |
| Whole 3-place walk | 1671 m | ~24 s |
The walkway from the cracker runs north to the landing. Real walking paths will be slightly longer than straight lines. Stage 3 must measure the real speed.

### How to test
- Serve: `python -m http.server 8127` in the project folder.
- http://127.0.0.1:8127/index.html: place 1 first view as before (house porch now bigger on the left). Drag to look north: the walkway leads to the porch steps and red door.
- http://127.0.0.1:8127/index.html?place=giant-feet: title "Place 2: Giant Feet Coming". Bristly coir mat edge on the left, running to the 144 m bottom step, with the door above. Giant sneaker toe on the right. Crumbs and sand in front. Drag left (west) to see the mat's south edge and step side. Drag around (south) to see the lawn and neighbor houses.

### Checked in browser (127.0.0.1:8127, 1280x720 emulated)
- Console: only the A-Frame 1.7.0 and THREE 173 logs. No errors or warnings.
- Place 1 default view: rig (-594, 0, 420), yaw -70, pitch 12. Cracker framing unchanged. 60 fps, about 750 draw calls (was about 430; the doormat objects near the left edge of view are counted), about 36k triangles.
- ?place=giant-feet: 61 fps, 219 draw calls, about 17k triangles. About 1330 entities in the scene.
- ?place=nope falls back to place 1 with the correct title.
- Server on 8127 stopped. Port 8123 not touched.

### Known limits (place 6)
- From ant eye height (1.6 m) the mat top (6-9 m) can never be seen. The mat reads as a low bristly wall with fibers, not as a flat mat. That is the real geometry. The pop-up text will tell the student it is a doormat.
- Stage 3 walking: the mat is a solid 9 m block at ground level. With no ground-height logic the ant would walk through it. Stage 3 should either make it an obstacle (walk around it) or raise the rig over it. Same for the shoe and the steps.
- The house move changes the place 1 first view a little (porch closer on the left). The cracker, grass and neighbor house framing are unchanged.
- Draw calls in the place 1 view rose to about 750. Still 60 fps on desktop; not tested on Quest. Merging static geometry may be needed for a headset.
- The old dirt-strip plane (x -410) still runs under the landing and steps; it is hidden, so it was left alone.
- file:// double-click still not checked in a real browser.

## Revision: doormat readability (QA 02b fail)

### What changed (index.html only, place 2 only)
- Place 2 start moved close to the mat's south-east corner: rig (-188, 0, -205), yaw 25, tilt 12 (was (-130, -260), yaw 10, tilt 18). The camera is 12 m east and 15 m south of the mat, so the mat's long south edge runs across the view, its east end shows the ridge stripes, and the step, nosing and red door loom above. The sneaker is still on the right.
- `GF` (ground-detail center) moved with the start, so sand, crumbs and pebbles are at the ant's feet again.
- Coir bristles are taller: 14-17 m (about 2 cm real, a normal coir mat; was 6-9 m = about 1 cm). Still x800.
- Colors: lighter coir browns (#c99a5e, #d4a86a, #bf8d50, #ddb577); every third ridge darker brown, so the ridge ends show stripes from the east and west. Rubber border is now near-black (#1e1d1b) instead of dark brown, so it reads as a separate rubber edge under the brown bristles. Border size unchanged (3.2 m high, 12 m wide).
- New: thin light/dark bristle tufts along the mat's south face (one every 6 m, 13-18 m tall, slightly tilted, 76 boxes), so the face looks like a brush instead of a flat brown wall. South-edge loose fibers raised to sit at the new bristle height.
- Nothing else touched: place 1, layout, PLACES for other cards, fence-web flag, stage 3-4 items. The new random calls come after all place 1 code, so place 1 detail is identical.

### How to test
- `python -m http.server 8129`, open http://127.0.0.1:8129/index.html?place=giant-feet.
- First view: a black rubber edge with a brown bristly band on top, running left across the lower middle of the screen; bristle tufts and fibers sticking up; the bottom step and red door above; blue sneaker on the right; crumbs and sand in front.
- http://127.0.0.1:8129/index.html: place 1 view unchanged.

### Checked in browser (127.0.0.1:8129, 1280x720 emulated)
- Console: only the A-Frame 1.7.0 / THREE 173 logs, no errors or warnings.
- Place 2: 60 fps, 284 draw calls, about 22k triangles, about 1409 entities (was about 1333).
- Place 1: rig (-594, 0, 420), yaw -70, title "A Cracker Too Big", same framing; 60 fps, 786 draw calls (was about 750; the extra mat tufts are at the far left edge of view).
- Server on 8129 stopped. Port 8123 not touched.

### Known limits
- The mat top still cannot be seen from 1.6 m eye height (real geometry). The mat sits in the middle band of the screen, not strictly the lower half: getting closer would hide the step and door behind it. The pop-up text should still say "doormat".
- The tufts add 76 draw calls; merge them with the ridges before Quest testing.

## Place 8 (fence web) - walk place 3 (index.html only)

### What changed
- New `#place-fence-web` group, built in the script after all older random calls, so place 1 and place 2 detail is identical. `js/problems.js` not touched.
- Weathered wooden fence along x 360..456, from the house wall (z -1280) to the end post (z -575..-495). Fence 1.2 m real = 960 m.
  - 2 posts (10 cm = 80 m wide, 1040 m tall, with caps) at z -900 and z -535 (end post).
  - 3 rails (4 x 9 cm = 32 x 72 m) at y 200 / 560 / 900, set against the boards. The bottom rail is 164..236 m up (20-30 cm real).
  - 7 boards (12 x 2 cm = 96 x 16 m) on the garden (east) side, 16 m gaps, slightly uneven tops, 3 wood tones.
  - Wood grain: thin darker strips on the post, rail and board faces that the ant sees (21 strips).
- Spider web low in the corner where the end post meets the bottom rail. The web plane is x 424 and the hub is at (424, 85, -660), which matches PLACES.
  - 12 radial spokes running out to the post face, the rail underside and the ground (the open north side ends at 72 m), 8 twelve-sided spiral rings (radius 5-66 m), 2 anchor threads, and 4 dew drops (r 1.6 m = 2 mm).
  - Silk material: white, light emissive, shiny, 85% opacity.
  - A signal line runs from the spider to the hub (the "feels the web shake" idea).
- Friendly spider at the web's edge by the post corner: round tan abdomen with a cream patch, brown head, 8 two-part legs (knee up, tip on the silk), and big white cartoon eyes with dark pupils. No fangs, muted colors. Body about 30 m (3.5 cm real, a big garden spider). Back toward the ant, head toward the hub. Nothing is caught in the web.
- Garden bed east of the end post (x 470..1170, z -800..-280): dark soil 1 cm high, low wooden edging (5 cm = 40 m), 5 soil clods, a pink flower (260 m stem) and an orange flower (200 m stem), both facing west, plus a leafy hosta-like plant.
- Fallen autumn leaf (6 cm = 48 m) leaning against the end post's base.
- Garden hose (1.6 cm = 12.8 m thick) with a brass nozzle. It runs from the bed's south-west corner across the lawn south of the porch landing and ends in the walkway grass.
- Two dandelions (yellow head, and a white seed puff) in the lawn south of the landing. Heights are 14-18 cm real, so they stay hidden behind the walkway grass in the place 1 first view.
- Bare trampled soil patch around the fence corner (ellipse, centered at 300, -640). Ground detail at the camera: 12 soil crumbs, 8 pebbles and a striped sunflower seed (1 cm = 8 m).
- PLACES: fence-web gets `start: { x: 220, z: -640, yaw: -92, tilt: 22 }`. `?place=fence-web` now opens place 3 with the title "Place 3: Caught in a Web" (title comes from problems.js).
- Doormat south view: the fence is north-east of the doormat, so it cannot fill the south view. The hose and the two dandelions now fill it instead.

### How to test
- `python -m http.server 8130`, then open http://127.0.0.1:8130/index.html?place=fence-web
  - First view: the web is in the center under the bottom rail, with weathered boards behind it. The spider with big eyes is at the web's top-right edge. The end post with a leaning orange leaf is on the right. Boards and posts tower out of the top of the screen. The striped seed, soil crumbs and pebbles are at the bottom.
  - Drag right (south-east) to see the end post, the leaf, the lawn and a dandelion puff. The garden bed is behind the end post: walk around it in stage 3, or see it from place 2.
- `?place=giant-feet`, turn east: the fence with a small web, plus flowers and edging in the garden bed (the "house to garden" walk). Turn south: two dandelions and the hose.
- `index.html`: place 1 is the same, except the new fence now stands in front of the house wall at the upper left.

### Checked in browser (127.0.0.1:8130, canvas 1280x720)
- Console: only the A-Frame 1.7.0 / THREE 173 logs. No errors or warnings.
- Place 3 first view as described above. A close-up check confirmed the spider's eyes, legs and silk.
- Place 1 and place 2 first views: same framing and title. A zoom check found no dandelion visible in the place 1 view.
- Entities: 1572 in total (was about 1409), 162 of them in `#place-fence-web`.
- fps: 60-61 in every view.
- Draw calls (with the new place hidden in brackets): place 1 start 945 (786), place 2 start 318 (284), place 2 south 972 (953), place 3 start 187, place 3 looking west 1097 (1070, the new widest view; it looks across the place 1 grass and the doormat).

### Known limits
- Silk is drawn about 0.7-0.9 m thick (about 1 mm real). Real silk would be far thinner than one pixel, so this is a deliberate readability exaggeration. The web also has 8 spiral rings instead of the 20-40 a real orb web has.
- The garden bed cannot be seen from the place 3 start: the end post and the boards hide it. It shows from place 2 (looking east) and from the lawn south of the bed.
- The fence, the soil bed edging and the spider are solid shapes, but there is no collision yet (stage 3).
- Draw calls: the fence and web are inside the place 1 view cone, so they add about 160 calls there. Frustum culling counts them even when they are hidden behind grass. The widest view is now about 1100 calls. That is fine on desktop and risky on Quest, so merge or instance before headset testing.
- The hose is low (12.8 m) and only reads as a thin green line from the doormat. The dandelions carry the south view.
- file:// double-click still not checked in a real browser.
- Server on 8130 stopped. Port 8123 not touched.

## Revision: reason to pass the web (teacher feedback; index.html only, place 3 only)

Teacher: "Students might think, just go around the web. There has to be a reason the ant can't avoid it." The place 3 first view now shows food behind the web, and the web gap is the only way to reach it.

### What changed
- **Food behind the web:** a big ripe strawberry (5 cm real = 40 m; built at 1/1.6 and scaled 1.6) lies on its side at (474, -655), just past the web in the opening. It has a red body (a sphere plus a cone tip), 12 yellow seed dots on the side the ant sees, and a 6-leaf green cap with a stem. A shiny red juice puddle sits under it.
- **Trail:** 17 small red strawberry bits run from the ant's feet (x 228) through the web gap to the berry (x 452). The bits nearest the camera are the biggest, so they read as a dotted line leading in.
- **The plant it fell from:** a strawberry plant in the bed corner (base 570, -660) with 3 stalks of 3 leaflets each (tilted so their undersides face the ant) and a second red berry still hanging on it. The leaves show through the gap beside the strawberry, so a bit of the garden is now in the first view (QA note 1).
- **The web covers the only opening:**
  - Fence boards now reach the ground (bottom y -1, was 24 = a 3 cm slit). They are 114 deep instead of 96, so they overlap with no gaps between them. Every other board is moved 0.6 m in x so the overlapping faces do not flicker.
  - Boards 5 and 6 (by the end post) have rotted-off bottoms at 95 / 88 m (11-12 cm real), with a dark rotten band and 3 hanging splinters. This leaves one opening, z -718..-575 and 0..~90 m high, exactly where the web hangs. The upper part of the web still has boards behind it; the lower part frames the strawberry. Wood grain strips stop above the rotted ends. The random call order is unchanged, so places 1 and 2 keep their exact detail.
- **Going around the end post is blocked:**
  - A piece of bed edging (24 x 40 m) is pressed against the fence end at z -497, closing the soil strip between the boards and the bed.
  - A terracotta flower pot (19 cm real = 150 m tall, rim r 86) with 4 tall leaves sits against the end post at (445, -438). It is visible at the right of the first view at 1280x720.
- **Garden bed:** the west edging moved from x 482 to x 506 (soil box now x 518..1146; north and south edging x 494..1170). This opens a 38 m soil strip between the boards (x 456) and the bed for the berry to lie in.
- **South view (QA note 2):** 3 clovers (leaflets 1.5 cm = 12 m, stems 40-56 m) and one white clover flower on its own stem, on the bare soil south of the camera.
- The spider, the web and the camera start are unchanged. The web is still empty. Places 1 and 2, PLACES and the distances are unchanged. `js/problems.js` was not touched (the title now reads "Place 3: A Web in the Way" from problems.js).

### How to test
- `python -m http.server 8132`, then open http://127.0.0.1:8132/index.html?place=fence-web
  - First view: the web in the center under the bottom rail. Through its lower half, a light opening under the broken boards. In it: the red strawberry with seeds and a green cap on the ground, strawberry leaves and a hanging berry behind it, and a dotted line of red bits from the bottom of the screen into the gap. Solid boards to the ground on the left, the end post with its leaf on the right, and the flower pot beyond it (at 1280x720).
  - Drag right a little (south-east): the strawberry is big and clear behind the web, and the pot and post close the way around.
  - Drag to the south: clovers, the pot, a dandelion puff and the lawn.
- `index.html` and `?place=giant-feet`: same first views as before.

### Checked in browser (127.0.0.1:8132, canvas 1280x720)
- Console: only the A-Frame 1.7.0 / THREE 173 logs. No errors.
- Place 3 first view as described above. At 1280x720 the strawberry is about 50-60 px wide: small but clearly red with a cap. It reads best after a small turn to the right.
- Places 1 and 2 first views: unchanged. The place 1 fence shows the same boards, now without slits.
- Entities: 1653 (was 1572), 243 of them in `#place-fence-web` (was 162).
- fps: 60 in every view.
- Draw calls: place 3 start 253 (192 with the new items hidden). Widest view (place 3 looking south-west, pitch 10) 1391 (1376 with the new items hidden). The new items add about 10-15 calls to the wide views and about 60 to the start view.

### Known limits
- The strawberry is 5 cm (a big garden berry) instead of 3 cm so it can be seen from the fixed start spot about 255 m away. It is still fairly small in the first view, and a portrait pane shows it smaller.
- Real ants can climb the 5 cm bed edging and the pot. The "only way" is a visual story, not a closed maze. Collision is stage 3.
- From place 2 looking east, the new flower pot now hides the orange flower. The pink flower and the bed edging still show. This is a small change to the place 2 east view.
- The trail bits and the puddle are flat on the ground, so the far part of the trail and the puddle are only thin slivers from the start view. The near bits carry the cue.
- Draw-call risk on Quest is the same as before (about 1400 in the widest view). Merge or instance before headset tests.
- file:// double-click still not checked in a real browser. Server on 8132 stopped. Port 8123 not touched.
