# Stage 2c QA - place 3 (fence-web) and the 3-place ground world

Tools I had: Claude Browser pane (navigate, screenshot, javascript, console), Bash, file tools. Real browser checks at 733x1135 (portrait pane) on http://127.0.0.1:8131. Look-around done by setting the look-controls yaw/pitch. Not checked: file:// double-click, Quest, stereo.

| Check | Pass/Fail | Evidence | Owner |
| --- | --- | --- | --- |
| Console errors (index.html, ?place=giant-feet, ?place=fence-web) | Pass | Only A-Frame 1.7.0 / THREE 173 logs. No errors or warnings. | - |
| Place 3 title | Pass | "Ant's-Eye World - Place 3: Caught in a Web". | - |
| Place 3 worm's-eye view | Pass | Rig (220,0,-640), yaw -92, pitch 22. Boards, rail and post tower overhead; sky gaps between boards. | - |
| Web reads as a spider web | Pass | 12 spokes, 8 rings, dew drops, white silk against brown wood; instantly readable. | - |
| Spider friendly (grades 3-5) | Pass | Tan round body, cream patch, big cartoon eyes, no fangs, muted colors. Looks cute/curious, not scary. | - |
| Nothing caught in the web | Pass | Web is empty. | - |
| Fence towers | Pass | Posts and boards leave the top of the screen. | - |
| Place 3 four directions, garden feel | Pass with note | East: web/fence. South: bare soil, a lone dandelion puff, grass at the horizon, lots of empty sky. West: blue neighbor house and gray walkway edge. North: red door/house wall and the fence on the right. The garden bed and flowers are NOT visible from the start (hidden behind the post and boards, as the builder said), so the first view feels like "fence", not yet "garden". The south view is the emptiest: a large flat brown plane. | world-builder (optional) |
| Place 1 first view | Pass | Cracker with holes, grass behind, house left, blue neighbor right. New fence post is now visible at the upper left in front of the house, fits the scene. Small yellow dandelion head (left) and white puff (center, behind the cracker) peek out from the grass in my portrait pane (builder said none visible at 1280x720). Harmless. | - |
| Place 2 first view and doormat | Pass | Close to mat: black rubber edge, brown bristle ridges and tufts, step and red door above. Now clearly a bristly mat. Earlier 02b fail is fixed. | - |
| Path feel, doormat looking east: house -> garden | Pass | Facing east (yaw about -100 from start): fence with web and leaf on the left, soil bed edging, pink and orange flowers, lawn edge. Turning to the south-east: blue house with green door and shrubs. Reads as "house, then garden". The straight-east view at the start (-65 offset) is mostly a fence wall; the flowers show only when turned a bit south. | - |
| PLACES entries | Pass | 3 placed: heavy-cracker (-540,400), giant-feet (-440,-380), fence-web (400,-660) with start. Other 5 placed:false: nest-guard, rain-flood, hot-driveway, lost-trail, sidewalk-gap. | - |
| Distances unchanged | Pass | cracker to doormat sqrt(100^2+780^2) = 786 m; doormat to web sqrt(840^2+280^2) = 885 m. | - |
| Unplaced places draw nothing | Pass | Scene groups are only #place-heavy-cracker, #place-giant-feet, #place-fence-web. The 5 other ids appear only in the PLACES list (index.html lines 141-145). | - |
| fps | Pass | 60 fps at the start views and in the widest views (a 3 s measure; one run read 51 right after a fast sweep, then re-measured 60). | - |
| Draw calls (this 733 px pane) | Pass for laptop, risk for headset | Place 1: 109-776 (peak looking toward the doormat / fence, yaw +30). Place 2: 82-916 (peak looking south-east at the hose, dandelions, grass). Place 3: peak 1233 (looking west/south-west across the grass, doormat and place 1 objects). Triangles about 24k at place 1. About 1572 entities, no instancing. | world-builder |

## Headset risk
- Worst view is about 1230 calls mono, so roughly 2400 per frame in stereo on a Quest. That is too high: expect low frame rate and motion discomfort on a standalone headset. Fine on a laptop.
- Merge or instance first: grass blades (about 400), sand grains, pebbles, mat ridges and tufts, fence/web strips and spokes. Keep the web and spider separate if needed for interaction later.
- In VR the headset sets pitch, so the tilted starts (12, 18, 22) will not hold; recheck framing on a device.

## Suggestions for the teacher
1. Place 3 start: consider a second angle or a note that the garden is behind the fence, or start a little further south-east so the flowers and bed edging peek out beside the web. At present the "garden" idea comes from place 2 only.
2. Give the place 3 south view something: a few more soil crumbs, a clover, or a low plant. It is a large bare brown plane.
3. Before walking (stage 3), make the fence, post, bed edging, mat, sneaker and steps obstacles.
4. Plan draw-call reduction (merge/instance) before any Quest testing; do it before adding the other 5 places.
5. Decide whether `?place=` stays as a teacher shortcut after walking works.
6. Pop-up text for place 2 should still say "doormat" and for place 3 should say the web is the spider's home (nothing caught).

Server on 8131 stopped. Port 8123 not touched.

RESULT: PASS (0 blocking issues; 2 optional notes: sparse garden/south view at place 3, and draw calls up to about 1230 that are a Quest risk)
