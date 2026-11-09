# Stage 2 QA re-check (place 1 only, after Revision 1)

Tools: Browser pane (navigate, screenshot, JS, console), Bash, PowerShell. Served on port 8126 (stopped afterward; 8123 untouched). Screenshots are inline only, no PNG files saved.

| Check | Pass/Fail | Evidence | Owner |
| --- | --- | --- | --- |
| Page loads, no console errors | Pass | Console shows only A-Frame 1.7.0 and THREE 173 logs; no errors or warnings | world-builder |
| Stage 1 file loads | Pass | ANT_PROBLEMS.length = 8 over http | learning-designer |
| Title shows "A Cracker Too Big" | Pass | On-screen box: "Ant's-Eye World - Place 1: A Cracker Too Big" + "Drag the mouse to look around." (browser tab title is still just "Ant's-Eye World", which is fine) | world-builder |
| Worm's-eye first view | Pass | Rig (-594, 1.6, 420), pitch 0.209 rad (12 deg up); cracker with holes, grass towering behind, houses at both edges | world-builder |
| Suggestion 1: sidewalk is gray concrete with visible joint | Pass | First view: neutral gray ground; one dark joint line runs from lower left toward the cracker; gold sand and brown pebbles stand out on the gray | world-builder |
| Suggestion 2: driveway edge reads as asphalt with height | Pass (minor note) | West view (yaw about 3.6 rad): raised near-black slab/patch with a visible vertical face, broken lip behind it with gaps, chunks and gravel on the sidewalk. Reads as raised asphalt, not a thin band. Note: it is very dark and flat-black; aggregate stones are tiny at that distance | world-builder |
| Suggestion 3: +270 view shows a real house wall | Pass | Yaw about -1.0 rad: blue wall with lap siding, framed windows with cross bars, green door with white frame, corner trim, gutter and roof edge. Not a blank wall | world-builder |
| Other directions (north) | Pass | North view: our house wall with red door and porch steps, gray joint line and pebbles in front | world-builder |
| Scale readability | Pass | Grass dwarfs the camera, cracker is a huge slab, pebbles near eye level | world-builder |
| Smoothness | Pass | 60.7 fps over 3 s; 969 entities; render calls 235 and 5.4k triangles in the first view (the builder's 430 is the whole scene; the view culls part of it); no stutter | world-builder |
| Mouse-drag look only, keys disabled | Pass | Yaw/pitch set and view turned; no movement by design | world-builder |

Notes for the teacher:
- Bushes at the neighbor wall are hidden by grass from the start spot (builder's known limit); not a fail.
- file:// double-click open still not checked (Browser pane cannot do it). Open index.html directly once.
- Only place 1 judged; fences, garden, other places are not built yet.

RESULT: PASS
