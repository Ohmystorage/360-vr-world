# Stage 2b QA - doormat place + compact 3-place layout

Tools I had: Claude Browser pane (navigate, screenshot, javascript, console), PowerShell, Bash, file tools. Real browser checks done at about 733x1135 (portrait pane) on http://127.0.0.1:8128. Not checked: file:// double-click, Quest.

| Check | Pass/Fail | Evidence | Owner |
| --- | --- | --- | --- |
| Console errors | Pass | Only A-Frame 1.7.0 / THREE 173 logs on index.html, ?place=giant-feet, ?place=fence-web. No errors or warnings. | - |
| problems.js still 8 cards | Pass | ANT_PROBLEMS.length = 8; all 8 ids matched in PLACES (no "No card" warning). | - |
| Place 1 first view | Pass | Rig (-594,0,420), yaw -70, pitch 12. Cracker with holes centered, grass behind, house left, blue neighbor right. Title "Ant's-Eye World - Place 1: A Cracker Too Big". | - |
| Place 1 looking north leads to porch/door | Pass | Gray walkway with joint lines runs straight to the 3 porch steps and the red door. Door color reads dark red-brown. | - |
| Place 2 title | Pass | "Place 2: Giant Feet Coming". Start rig (-130,0,-260), yaw 10, pitch 18. | - |
| Place 2 worm's-eye view (step, crumbs, sneaker) | Pass | Bottom step towers left; door above; blue sneaker with white sole on right; crumbs and sand in front. Nothing scary. | - |
| Place 2 reads as doormat to a child | Fail (minor) | In the start view the mat is only a thin dark band with bristles along the step base (lower left). The step dominates; the mat is hard to name. From the west it reads better (dark rubber edge with brown ridges). Builder already noted that eye height hides the mat top. | world-builder / learning-designer (pop-up text) |
| Place 2 four directions | Pass with notes | East: sneaker with crumbs, fine. West: mat edge with fibers and a gray house window. North: step, door. South: only sky, a few distant sand grains and a bit of grass; empty. The landing is a large bare gray plane with no features beyond sand and pebbles. | world-builder (optional) |
| window.PLACES entries | Pass | heavy-cracker (-540,400) placed; giant-feet (-440,-380) placed; fence-web (400,-660) placed:true flag. Others placed:false: nest-guard, rain-flood, hot-driveway, lost-trail, sidewalk-gap. Fields: id,x,z,placed,start. | - |
| Distances | Pass | cracker to doormat 786 m; doormat to web 885 m (both in 700-1000 m). | - |
| Unplaced places draw nothing | Pass | No objects at the 5 unplaced spots seen; fence-web is flagged placed:true but nothing is built there yet (known; ?place=fence-web falls back to Place 1 start and title). Flag/reality mismatch to keep in mind. | world-builder |
| fps | Pass | 122 frames in 2 s (61 fps) at place 1; 61 fps at place 2. | - |
| Draw calls / triangles | Pass with note | Place 1: 242 calls start view; 386 calls / 21k tris looking north (porch and mat); range 109-386 across 4 directions. Place 2: 164 calls / 14k tris north; 215 east; 257 west; 60 south. About 1333 entities, no instancing. Builder measured up to about 750 calls in a 1280x720 view; my narrow pane sees less, so treat 750 as the worst case. | world-builder |

## Notes for headset
- Calls near 400-750 per eye are doubled in stereo (about 800-1500 per frame on Quest). Merge or instance grass blades, sand grains, pebbles and mat ridges before testing on Quest.
- Fog and about 1300 separate meshes are fine on a laptop, risky on standalone headsets.
- Place 2 start pitch 18 deg and place 1 pitch 12 deg are set through look-controls; in VR the headset overrides pitch, so the framing will differ. Check on a device.

## Suggestions for the teacher
1. Make the doormat easier to recognize. Options: start place 2 turned a little west (yaw about +35) so the long mat edge fills the lower view, or raise a mat corner so a child sees a "mat bump", or add a visible pattern/color band on the mat edge. Pop-up text should say "doormat" explicitly.
2. Give the south view something: the empty sky and bare landing look unfinished once walking is on. A fence, shrub or the garden planned for place 3 would fill it.
3. Set fence-web `placed` to false until built, or build it soon, so the flag matches what is drawn.
4. Before stage 3 walking, make mat, sneaker and steps obstacles (builder already noted this).
5. Decide whether `?place=` stays as a shortcut or is removed.

Server on 8128 stopped. Port 8123 not touched.

RESULT: FAIL (1 issue: doormat is hard to recognize from the start view; the other items are minor notes)
