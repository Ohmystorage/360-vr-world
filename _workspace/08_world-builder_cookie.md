# 08 world-builder: cracker -> bitten M&M cookie (place 1)

The approved prototype (`shot4.html?s=3&a=35&b=se`) is rebuilt as static scene code in `world.html`. It is no longer a load-time hack. The id stays `heavy-cracker` everywhere. `js/problems.js`, `index.html`, the walking speed (357.5), the bounds and the other places are unchanged.

## What changed
- **world.html, HTML:** removed the `#cracker` box, `#cracker-holes` and the old stone `a-sphere`. `#place-heavy-cracker` now holds only the cut grass blade. The cookie meshes are added to it from the script.
- **world.html, script, new block "Place 1 (id heavy-cracker)"** (after the nest block, so it is built last):
  - Cookie: radius 24 at 1/3 size, scaled x3 = 72 m. Two layers: edge `#c98a45` (4.4 thick) and top `#dba35c` (1.2 thick). Both use `THREE.Shape` + `ExtrudeGeometry` with a bevel. The rim is slightly wavy and the shading is flat.
  - Tilt: rotation z -35 deg, so the WEST edge is raised (top ~96 m) and the top face looks east. The center is (-540, 400) and the low east edge rests on the ground.
  - Bite: three tooth arcs cut out of the outline on the south-east rim ("se" set [2,27,12], [-8,26,11], [11,24,10]).
  - Toppings: 22 M&Ms are tried and the ones inside the bite are skipped, so about 20 remain (6 colors, flattened spheres, roughness 0.35). There are 10 dark chocolate chips, none in the bite.
  - Stone: sits under the raised west edge and is scaled to its height, as in the prototype.
  - Crumbs: 70 dodecahedrons (0.8-3.6 m at 0.6 height, 4 cookie colors). About 60% lie by the bite on the south side. There are also 4 dropped M&Ms.
  - Random numbers: the block uses the prototype's own seeded random numbers (seed 7), so it matches the approved images.
  - Meshes: everything is baked into world coordinates and merged into **2 meshes**: matte (cookie, chips, stone, crumbs) and shiny (M&Ms).
- **`merged()`** now also accepts non-indexed geometry (extrude, dodecahedron). Existing callers are unchanged.
- **Old cracker crumbs** are removed. Their 20 random numbers are still drawn, so all later random detail (doormat, hedge, nest...) stays exactly the same. The pebble skip for the old cracker spot is kept for the same reason.
- **Lawn-edge grass:** blades with |z - 400| < 260 (all 4 rows sit in x -414..-348) are cut to 18% height. The random calls stay in the same order.
- **YARD.solids:** `cracker` box -> `cookie` circle r 72 (tan `#d9a35c`, edge `#8a5a2b`). I also added `cookie stone` circle (-620, 400) r 33, which is the stone's ground cross-section and is not drawn on the map. The cookie entry gets `poly` (round outline with the bite, 96 points) from the cookie block.
- **js/components.js:** `shape()` draws `f.poly` when present (map only). Walking still uses `r`.
- **PLACES heavy-cracker `tip`:** 26 -> 110 (ring + envelope above the raised edge). I also updated the comments that said "cracker".

## How to test
- Serve the project folder and open `world.html`. Walk west from the nest (arrow keys / WASD) toward the car. The cookie shows over the short grass soon after leaving the nest rim, with the ring above it.
- Coming from the east, the bite is on the left end of the cookie.
- Within 400 m the Read button appears. Click it or press Enter and the card "A Cookie Too Big" opens. Escape closes it, and the map dot turns into a green check.
- Walk into the cookie from any side. The ant stops 75 m from the center (r 72 + ant 3). From the west it stops at the stone (x -656).

## Checked (localhost:8150, stopped after; 8123 and the teacher's tab not touched)
- Console: only the A-Frame 1.7.0 / THREE 173 logs. No errors or warnings, in both the Browser pane and headless Chrome.
- Views: the cookie is visible just past the nest rim at (880, 980). Its bite is on the left end in the near and close views.
- Ring: in `08_cookie_near.png` and `08_cookie_close.png` the ring + envelope sit clearly above the raised edge with no overlap. In `08_cookie_mid.png` (850 m) the ring sits just above the cookie.
- Collision: I walked toward the center from the E, N, S, SE, W and NW. Each walk stopped at 75 m from the center, or at the stone from the west. From the stop points the camera sees the cookie's side or underside, not its inside. Under the raised west edge, the bottom is 80+ m up.
- Read button: hidden at 401 m, shown at 399 m. Clicking it opened "A Cookie Too Big".
- Draw calls (Browser pane, same views; before = the pre-change world.html):

  | View | Before | After |
  | --- | --- | --- |
  | Nest start | 1573 | 1558 |
  | Near (-250, 520) | 933 | 905 |
  | Close (-430, 430) | 488 | 456 |

  The 16 cracker entities became 2 merged meshes. Triangles rose by about 8k.
- Screenshots (headless Chrome, 1280x720; title, Read button and VR button hidden as in the approved 07 shots):
  - `_workspace/08_cookie_near.png`: from (-250, 520)
  - `_workspace/08_cookie_close.png`: from (-430, 430)
  - `_workspace/08_cookie_mid.png`: from (250, 720)

## Known limits
- **Minimap:** the cookie outline (about 12 px radius on the 480 px map, about 6 px on screen) sits right under the place's pink dot (13 px plus glow), and later under the green check. In practice the tan shape and its notch are hidden. Showing it would need the dot moved or made smaller, or the cookie drawn larger than scale. Those are teacher decisions, so I did not change them.
- The walking circle (r 72) is round. In the bite area the ant stops up to about 30 m before the bitten edge. That is fine at ant scale, but it is not exact.
- Thickness: the base layer plus bevels is about 18 m at the rim (the top layer reaches about 20 m), as in the approved prototype. Without the bevels it is about 15 m.
- From the nest start spot itself (facing the cookie), the nest rim hides the cookie. Only the ring shows until the ant walks out of the crater.
- I did not re-test opening the page from disk (file://). No new file loads were added; everything is still `<script src>` and inline code.
- I did not update PLAN.md, DECISIONS.md and MEMORY.md. I left them for the orchestrator's stage gate.
