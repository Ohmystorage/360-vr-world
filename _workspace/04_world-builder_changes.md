# Stage 4 - world-builder changes (hotspots + pop-ups, 3-place version)

Files: `js/hotspots.js` (new), `js/components.js` (map markers), `index.html` (script tag, CSS, pop-up markup, scene cursor/raycaster, `tip` on the 3 placed PLACES, hotspot entities). `js/problems.js` not touched. Walking speed (`acceleration: 229.2`), places 1-3, bounds, collision and `?place=` are unchanged. The other 5 cards get nothing.

## What I built
1. **Hotspots (one per placed card, linked by `id`)**: built from `window.PLACES` (placed only) at each place's x, z, numbered in walk order: 1 cracker, 2 doormat, 3 web.
   - Each hotspot is a pink disc with a white ring and a big white number (canvas texture), a pink ring that pulses outward every 1.5 s, and a pink arrow below that bobs and points down at the place. 3 meshes per hotspot, unlit and without fog, so it stays bright from far away.
   - The disc always turns to face the ant. Far away it grows (radius at least about 3 degrees of view), so it can be seen across the yard. It grows upward, so the arrow tip stays at the same height (`tip` in PLACES): cracker 26 m (cracker top 13-21 m), doormat 30 m (mat 17 m), web 178 m (web top 164 m). It never covers the cracker, the mat or the web + strawberry.
   - The disc and ring are drawn on top of the scene (no depth test, like a game waypoint). Why: at ant height, the place-2 start stands 15 m from the 15 m tall mat edge, which hid the badge completely. The arrow is normal 3D (it can be hidden behind things).
   - Not in `YARD.solids` and floating high, so it never blocks walking.
2. **Click to read**: `a-scene cursor="rayOrigin: mouse"` + `raycaster="objects: .hotspot; far: 6000"`. Hovering a hotspot shows the pointer (hand) cursor. Clicking opens the pop-up if the ant is within **400 m** of the place (about 10 s of walking; all 3 start spots are inside: 57 m, 307 m, 181 m). Farther away, a short message "Walk closer to read this!" shows at the bottom for 2.5 s.
3. **Pop-up** (HTML overlay, filled from `window.ANT_PROBLEMS` by id, text set with `textContent`):
   - Number badge + title, problem, "Why is it hard?" + whyHard, "Words to know" list (the whole section is hidden when `words` is empty or missing, e.g. giant-feet), and "Your design challenge" + the question in bold on a yellow box with a pink bar.
   - Body text 20px, title 28px, dark text on a cream card. Max 680px wide; scrolls inside on small windows. The big blue "Close" button stays pinned at the bottom of the card. Escape also closes. The Close button gets focus when the card opens (Enter/Space also close).
4. **Freeze while open**: `wasd-controls` and `look-controls` are set to `enabled: false`, and held keys and speed are cleared on open and on close, so the ant does not glide or walk on after closing. Focus goes back to the page on close, so the keys work again right away.
5. **Minimap**: new canvas layer `#map-spots` between the map and the ant: a pink circle with the number for each of the 3 places (no words). After a card is opened once, its circle turns green with a white check mark. The ant marker stays on top. It is redrawn only when a card is read. No "cards read" counter (to keep the map clean).
6. **Instruction line** in the title box now ends with "· Read: click a pink number".
7. Pop-up layer is above A-Frame's VR button (it covered the card's corner on narrow windows).

## How to test
- `python -m http.server 8141` in the project folder, open http://127.0.0.1:8141/index.html (or `?place=giant-feet`, `?place=fence-web`).
- Place 1 start: pink "1" floats above the cracker; "2" (doormat) shows at the left edge, a small "3" behind the grass. Move the mouse over "1": hand cursor. Click: card 1 opens.
- With the card open, hold W or arrows and drag the mouse: nothing moves. Press Escape (or click Close): the card closes and the ant does not move until you press a key again.
- The map shows a green check on 1. Walk to the doormat (or `?place=giant-feet`), click "2": card has no "Words to know"; map 2 gets a check. Same for 3 at the web.
- From place 1, click the small "3": "Walk closer to read this!".
- Narrow window (about 400 px wide): the card scrolls inside, Close stays visible at the bottom.

## Checked in browser (127.0.0.1:8141; 1280x720, then 400x700)
- Console: only the A-Frame 1.7.0 / THREE 173 logs on every load (8 loads). No errors or warnings.
- Hover over badge 1 and badge 2: canvas cursor `pointer`, raycaster hits the right id. Real mouse clicks opened cards 1, 2 and 3 from their start spots. A real click on badge 3 from place 1 (1468 m away) showed the hint and did not open a card.
- Card text compared with `js/problems.js` for all 3 cards: title, problem, whyHard, words, question all match. Card 2 shows no Words section. Body text computed 20px.
- 1280x720: the longest card (fence-web) fits with no scroll (609 px). 400x700: card 16-384 px wide, no page side-scroll, scrolls inside (819 px content in 668 px), Close button at 612-664 px, VR button no longer over the card. Hint fits on one line.
- Freeze: with card open, 20 W key presses and a mouse drag changed position and yaw by 0. W held when the card opened and released while open: 0 m moved during 2 s open and 0 m during 2 s after closing; held-key list empty. After closing: wasd and look-controls enabled again, focus on the page, and walking works (S for 1 s = 42 m, speed unchanged). Real Escape key closes.
- Minimap: checks appear on 1 and 2 after reading, 3 stays a number; the ant marker draws over the markers (screenshot `_workspace/04_popup.png`).
- Lean: +8 draw calls at the place 1 start (1029 -> 1037). The 3 hotspot ticks take about 0.03 ms per frame together.
- file://: headless Chrome loading `index.html` from disk built the 3 hotspots and loaded the cards (no "No card" warnings). The only page message was A-Frame's standard "served via file://" notice (this page loads no asset files, so it does not apply).
- Server on 8141 stopped. Port 8123 not touched.
- Test note: the Browser pane was hidden, so animation frames were paused. Movement checks stepped the scene by hand at 60 fps (same `tick` code). FPS was not measured this stage.

## Known limits
- Badges are drawn through walls on purpose, so a badge behind the mat edge or grass looks like it sits on that edge. When two badges line up (for example 1 in front of 2, seen from the south), the far badge can draw over the near badge's arrow.
- Standing right next to a place (closer than about 30 m to the cracker, or right at the web), the badge is overhead: look up (drag the mouse) to click it, or step back.
- On a narrow window (400 px), the title box covers the top-left of the view and can sit over badge 3 at the web start. The title box ignores the mouse, so clicking the badge through it still works.
- Read check marks are not saved: reloading the page clears them.
- The 400 m read distance is measured to the place point (same point as the title's "Place N"), not to the edge of the object.
- In immersive VR the HTML pop-up is not visible (a later step, per the skill).

## Revision 1 - no numbers (teacher: "Remove all the numbers 1-3")
Plan: `_workspace/04_change_plan.svg` (approved). Files: `js/hotspots.js`, `js/components.js`, `index.html`. Not touched: `js/problems.js`, walking speed (`acceleration: 229.2`), places 1-3 visuals, bounds, collision, `?place=`.

### What changed
1. **3D hotspot**: the pink numbered disc (and its number texture) is gone. The pulsing pink ring and the bobbing pink arrow are unchanged (same size, timing, colors, height rule, grow-with-distance rule). The ring is still drawn through objects (no depth test); the arrow is still normal 3D.
   - Click target: the ring now sits on an **invisible hit circle** (radius 11.2 m at scale 1, a bit larger than the ring's outer edge 10.2 m), which always faces the ant. The arrow is clickable too. So the empty middle of the ring is clickable, and the spot stays clickable while the ring fades out at the end of each pulse. Hand cursor, 400 m rule and "Walk closer to read this!" are unchanged.
   - The `n` (number) setting was removed from the `hotspot` component and from the entity built in `index.html`.
2. **Minimap**: each unread place is a pink dot (no number) with a soft pink glow that swells and dims all the time (about a 2 s cycle). Only the `#map-spots` layer is redrawn, at about 25 times a second, and it stops redrawing once all 3 cards are read. A read place is the same green check circle as before (no glow). The ant marker stays on top.
3. **Pop-up**: the number circle before the card title is removed (`#card-num` span, its CSS and the JS line).
4. **Help line**: "Read: click a pink number" is now "Read: click a pink ring".
5. Comments that talked about numbers were updated. No other 1/2/3 numbering from Stage 4 remains.

### How to test
- Serve the folder (for example `python -m http.server 8143`), open `index.html`.
- Place 1 start: a pink ring + arrow over the cracker, no disc, no number. Move the mouse into the empty middle of the ring: hand cursor. Click: "A Cracker Too Big" opens, title has no number.
- Click the small far ring (the web, about 1500 m away): "Walk closer to read this!".
- Map: pink dots glow and pulse; after reading a card its dot turns into a green check. `?place=giant-feet` and `?place=fence-web` for places 2 and 3.

### Checked in browser (127.0.0.1:8143; 772 px wide, 1280x720, 400x700)
- Console: only the A-Frame 1.7.0 / THREE 173 logs on each load. No errors. (One Canvas2D `getImageData` notice came from my own pixel test, not from the page.)
- Hover in the empty middle of ring 1: cursor `pointer`, raycaster hits the hit circle (`CircleGeometry`). Hover on the arrow: hits the cone and the ring.
- Real clicks (hover, then click) on the rings opened card 1 (place 1 start), card 2 (`?place=giant-feet`, no "Words to know") and card 3 (`?place=fence-web`). The card title has only the title text (1 child element).
- Click on the far web ring from place 1: hint shown, no card (ray hit `fence-web` at 1510 m).
- Map: glow pixel next to dot 1 changed over time (alpha 50, 16, 0, ..., 10 in 1.2 s), so it animates. Read cards show the green check. With all 3 read, the redraw stops (`pulse` false, no more redraws).
- Escape (sent as a keydown in the page) closes the card and turns walking back on. Close button works.
- 400x700: card 16-384 px, no page side-scroll, scrolls inside (782 px content in 668 px), Close at 612-664 px, body text 20px. Clicking through the title box onto ring 1 opens the card.
- Cost: `ant-walk` tick including a spots redraw takes about 0.04 ms. The 3D hit circle is never drawn (`visible: false` material), so draw calls drop by 3 versus the disc version.
- Screenshots: `_workspace/04_ring.png` (ring + arrow over the cracker, no card), `_workspace/04_popup.png` (card 2 open with no number; map with two glowing dots and a check on the doormat).
- Server on 8143 stopped. Port 8123 and the teacher's tab were not touched.
- Test note: the Browser pane's click tool does not send a mouse move first, so the A-Frame cursor kept an old aim and one test click opened the wrong (near) card. Hovering first fixed it. A real mouse always moves before clicking, so students will not see this.

### Known limits (Revision 1)
- The ring fades to fully clear at the end of every 1.5 s pulse (as before). With the disc gone, for a short moment only the arrow is visible. At the place 2 start the arrow is behind the mat edge, so for that moment nothing pink shows there. The spot is still clickable all the time (invisible hit circle). If the teacher wants it always visible, a small fix is to keep a minimum ring opacity or draw the arrow on top too.
- The title line still says "Place 1 / 2 / 3: <card title>" when the ant is near a place. That number comes from Stage 3, not Stage 4, so I left it. Ask the teacher if it should also go (one-line change in `js/components.js` `updateTitle`).
- On the map at the place 1 start, the ant marker sits on top of the cracker's dot/check (the ant starts 57 m away). Walk a little to see it.
- Earlier limits still apply (read checks not saved on reload, HTML pop-up not visible in immersive VR, title box covers part of the view on narrow windows).

## Revision 2 - smaller ring, arrow in its center, no full fade, no "Place N" (plan "수정안 3")
Plan: `_workspace/04_change_plan2.svg` (approved). Files: `js/hotspots.js`, `js/components.js` (one line), `index.html` (one comment). Not touched: `js/problems.js`, walking speed (`acceleration: 229.2`), places 1-3 visuals, bounds, collision, `?place=`, pop-up, 400 m rule + "Walk closer" hint, freeze, minimap.

### What changed
1. **Ring 50%**: size unit `R` 8 -> 4 m, so ring inner/outer radius 8.2/10.2 -> 4.1/5.1 m at scale 1. The grow-with-distance rule is the same (`scale = max(1, distance / 150)`), so the ring is 50% of the old size at every distance. Invisible hit circle 11.2 -> 5.6 m (a bit wider than the new outer edge 5.1 m). The pulse still grows to 1.7x.
2. **Arrow 70%**: cone radius 4 -> 2.8 m, height 8 -> 5.6 m.
3. **Arrow in the ring's center**: ring and arrow are both at the entity's center, and the whole entity bobs (`y = tip + (2.8 + 1.5 sin) * scale`), so they move up and down together and the arrow stays centered. The arrow tip stays at the old height (`tip`: cracker 26 m, mat 30 m, web 178 m; same bob as before). The arrow's base corners (3.96 m from center) fit inside the ring's inner edge (4.08 m), so the ring does not draw over the arrow.
4. **Pulse never fully clear**: ring opacity goes 0.9 -> 0.4 over each 1.5 s pulse (was 0.9 -> 0).
5. **Title**: "Ant's-Eye World - Place 1: A Cracker Too Big" is now "Ant's-Eye World - A Cracker Too Big" (`updateTitle` in `js/components.js`).

### How to test
- Serve the folder (for example `python -m http.server 8144`), open `index.html`.
- Place 1 start: a smaller pink ring with the arrow inside it, above the cracker. Title: "Ant's-Eye World - A Cracker Too Big". Click the arrow or the empty middle of the ring: card opens.
- Watch the ring: it pulses outward and gets lighter but never disappears.
- `?place=giant-feet` and `?place=fence-web` for places 2 and 3.

### Checked in browser (127.0.0.1:8144; 1280x720 and 400x700)
- Console: only the A-Frame 1.7.0 / THREE 173 logs on each load. No errors or warnings.
- Place 1 start (1280x720): ring center 266 px, ring bottom at full pulse 324 px, cracker top edge about 345 px below it: the ring never touches the cracker. Hover on the arrow hit the cone + hit circle; hover in the empty middle hit the hit circle; hand cursor (`pointer`) shown. Real clicks on the arrow and on the empty middle both opened "A Cracker Too Big". Click on the far web ring: "Walk closer to read this!", no card.
- Place 2 start (`?place=giant-feet`): click on the ring opened "Giant Feet Coming" (no Words section).
- Place 3 start (`?place=fence-web`): ring + arrow above the web; ring bottom at full pulse 117 px (772 px wide shot), web top about 140 px, strawberry far below. Clicks on the arrow and on the ring's edge opened "A Web in the Way".
- Opacity sampled for 1.7 s: min 0.40, max 0.90. Arrow and ring both sit at the entity's center (local 0, 0, 0), so they always bob together.
- 400x700: ring visible above the cracker and below the title box (title box bottom 189 px, ring top about 200 px). No page side-scroll (scroll width 400). Click inside the ring opened card 1.
- Screenshots: `_workspace/04_ring.png` (place 1 start, no card), `_workspace/04_ring_mat.png` (place 2 start), `_workspace/04_ring_web.png` (place 3 start).
- Server on 8144 stopped; my test tab closed. Port 8123 and the teacher's tab were not touched.

### Known limits (Revision 2)
- **Place 2 start**: the ant stands right in front of the tall mat edge, so everything behind it (including the arrow tip 30 m above the mat point) is hidden by the edge. The ring is drawn on top (as before), so it shows as a small ring on the mat's bristles, but the arrow inside it is hidden behind the edge. This was already true in Revision 1 (the old, bigger ring also sat on the mat edge). With the arrow tip fixed, it cannot sit above the mat edge from this spot. Walking a few steps back shows ring + arrow above the mat.
- **Far rings sit lower now**: because the ring no longer floats above the arrow, a far ring appears near the horizon. At the place 1 start, the small far web ring shows on the cracker's back-left corner (it is drawn through objects). It is faint and small, and clicking it gives "Walk closer". If the teacher dislikes this, an option is to draw far rings (outside 400 m) with normal depth so objects hide them.
- At the place 3 start the ring is small (about 20 px across at 1280x720), as approved (50%).
- The bob is 1.5 m x scale (as before), so from far away the arrow tip dips a little below `tip`.
- Earlier limits still apply (read checks not saved on reload, HTML pop-up not visible in immersive VR, title box covers part of the view on narrow windows).

## Revision 3 - place 2 start spot, far rings hidden by objects
Files: `index.html` (place 2 `start` in PLACES + 2 comments), `js/hotspots.js` (ring depth switch in `tick`, 1 comment). Not touched: `js/problems.js`, the mat, steps, sneaker, crumbs and every other object (the crumb/grain spot `GF` keeps its old numbers), ring 50% / arrow 70% / centered, min opacity 0.4, title, pop-up, freeze, 400 m click range + "Walk closer", minimap, walking speed (`acceleration: 229.2`), places 1 and 3, bounds, collision.

### What changed
1. **Place 2 start** (used by `?place=giant-feet`): `{ x: -188, z: -205, yaw: 25, tilt: 12 }` -> `{ x: -505, z: 5, yaw: -10, tilt: 4 }`. The ant now stands on the walkway, 390 m south of the mat point, facing north at the mat with the steps behind it.
   - Why not "a few steps back on the same line": from the old spot the line of sight crosses the mat's SE corner (the far edge, 281 m from the mat point), so the 17 m bristles hid the arrow until about 600 m back, past the 400 m click range. From the south the near edge is only about 150 m from the mat point, so the arrow clears it from about 360-390 m. I checked this with rays from the eye to the arrow tip at its lowest bob; 390 m was the spot that clears with a ~1 m margin and still lets the ant click right away (inside 400 m). Facing is still north-ish (-10 instead of 25 degrees). Tilt 4 keeps the mat near the middle of the view.
   - The spot is not inside a solid: after load the ant stays at exactly (-505, 5), so the collision push-out did not move it. The title still reads "Giant Feet Coming" (mat 390 m, cracker 397 m: the mat is nearest).
2. **Far rings are hidden by objects**: each frame the ring checks its distance to the ant. Within 400 m (the click range) it is drawn on top of everything as before. Past 420 m objects hide it normally. Between 400 and 420 m it keeps its last state (20 m hysteresis), so walking back and forth at the edge cannot make it flicker. Changing `depthTest` is just a render state, so there is no shader rebuild and no stutter. The arrow was already normal 3D. Minimap dots unchanged.

### How to test
- Serve the folder (for example `python -m http.server 8145`), open `index.html?place=giant-feet`: the mat strip across the middle, the pink ring with the arrow inside it just above the bristles, steps behind. Click the arrow: "Giant Feet Coming" opens.
- Open `index.html` (cracker start): only the cracker's ring shows. The far web ring no longer shows on the cracker's corner.
- Walk toward any place from far away: its ring is hidden by grass, the mat edge, etc., then shows on top once you are within 400 m.

### Checked in browser (127.0.0.1:8145; 1280x720)
- Console: only the A-Frame 1.7.0 / THREE 173 logs on each load. No errors or warnings (one ReferenceError came from my own test script, not the page).
- Place 2 start: ant at (-505, 5), ring of giant-feet drawn on top, the other two hidden by objects. The arrow sits above the bristles through the whole bob (checked in 3 frames). Real hover + click on the arrow opened "Giant Feet Coming".
- Cracker start: web ring and doormat ring set to "hidden by objects"; the screenshot shows no far ring over the cracker. Real click on the cracker ring opened "A Cracker Too Big".
- Web start: real click on the ring opened "A Web in the Way".
- Boundary (doormat ring, ant stepped by hand): 440/425/415/405/401 m hidden, 399 m on top, 405/415/419 m still on top, 421 m hidden, back to 399 m on top. Coming in on the old SE line: at 410 m only the top of the ring peeks over the mat; at 395 m the whole ring shows on top of the bristles.
- Screenshots (headless Chrome, 1280x720, overwritten): `_workspace/04_ring.png` (cracker start), `_workspace/04_ring_mat.png` (new place 2 start), `_workspace/04_ring_web.png` (place 3 start).
- Server on 8145 stopped; my test tab closed. Port 8123 and the teacher's tab were not touched.

### Known limits (Revision 3)
- **The mat is a thin strip at the new place 2 start.** From 390 m the 17 m mat covers only about 4 degrees of view, so it reads as a long brown band of bristles under the steps, not a big close-up. Any spot close enough to make the mat big hides the arrow (the arrow height is fixed). If the teacher wants a bigger mat, the options are a lower arrow `tip` for place 2 or accepting a hidden arrow up close. Both are outside this revision.
- At the new start, tall lawn-edge grass fills the right side of the view and hides part of the sneaker. The objects themselves are unchanged.
- The start is 390 m from the mat point, so the ant only needs to step back about 10 m to get "Walk closer to read this!". Walking forward is fine.
- A far ring hidden behind an object can still be hit by a click (the click ray only looks at hotspots). That gives only the "Walk closer" hint, and a nearer ring along the same ray always wins.
- Earlier limits still apply.

## Revision 4 - person at the doormat, nest start, envelope icon + Read button, no `?place=`
Plan: `_workspace/04_change_plan4.svg` (approved, with the `?place=` shortcut removed). Files: `index.html`, `js/hotspots.js`, `js/components.js` (minimap nest). Not touched: `js/problems.js`, walking speed (`acceleration: 229.2`), cracker and web places, boundaries (hedge, brick border, car, picket fence), minimap glowing dots + checks, pop-up, freeze while open, 400 m click range, "Walk closer to read this!".

### What changed
1. **Person at the doormat** (replaces the loose sneaker; no random calls, so all other detail stays the same):
   - A person stepping into the house, facing the door, about 1360-1390 m tall (1.7 m real). Right shoe stands on the first porch step (x -400, z -680). Left shoe is lifted mid-step over the mat (x -560, centre z -270, toe tipped down 6 degrees): treaded sole about 24 m up at the toe (bristles are 17 m) to 48 m at the heel, and the heel sticks about 70 m past the mat's south edge, so the ant can walk under it. Front knee bent (stepping up), back leg almost straight, arms swing opposite to the legs; jeans, purple shirt, hair seen from behind.
   - Sneakers in the old sneaker's style and colours, 28 cm real (0.8 of the old length), with dark tread lines across the grey outsole.
   - Soft dark shadow under the lifted shoe: one plane on top of the bristles, one on the concrete under the heel (radial-gradient canvas texture).
   - Draw calls: the whole person is ONE merged mesh (vertex colours, like the hedge) + 2 shadow planes = 3. The old sneaker was 16 entities.
   - `YARD.solids`: "sneaker" removed; "standing shoe" added (x -400, z -680, 86 x 236, blue, drawn on the map on top of the steps). The lifted shoe is not solid.
2. **Ant nest start** (south-east lawn corner, `YARD.nest = { x: 1030, z: 1050, r: 100, hole: 16 }`):
   - A crater of dug-out soil around a dark hole (32 m wide = 4 mm real): 8 soil rim blobs (13-21 m tall, taller at the back) with small grains on them, open to the north-west, a dusty soil patch (radius 118 m), and small loose grains in front of the opening. ONE merged mesh. Outer edge stays 30-40 m from the hedge faces.
   - Solid: yes, the 8 rim blobs are circle solids (r 30, pushed into `YARD.solids`, not drawn on the map). The hole and the loose grains are not solid (grains are kept small, 0.4-1.8 m).
   - Start: at the hole's north-west edge (1017.3, 1037.3), facing north-west (yaw 45, tilt 10) out of the crater opening. The person, house and steps are straight ahead. Distances: cracker 1682 m, doormat 2032 m, web 1806 m (no Read button at the start). Title at the start: "Ant's-Eye World".
   - Minimap: brown mound with a white outline and a dark centre (no text), drawn over the lawn.
3. **Envelope icon + Read button**:
   - The arrow cone is gone. A white envelope with a pink outline and a flap V (canvas texture, 6.4 x 4.8 m at scale 1, about the arrow's size) sits in the ring's centre and faces the ant; it bobs with the ring. Ring size (50%), 0.9 -> 0.4 opacity pulse and the invisible hit circle are unchanged. The envelope uses the same depth switch as the ring: on top within 400 m, hidden by objects past 420 m.
   - Big rounded pink button at bottom centre: "✉ Read the message" + small line "click or press Enter". It shows while the ant is within 400 m of a placed place and no card is open (checked 10 times a second by an A-Frame system `read-button`), and hides when out of range or while a card is open. Click or Enter opens the nearest place in range. Clicking the ring still works. Held Enter (key repeat) is ignored, so it cannot close the card it just opened.
   - The "Walk closer to read this!" hint moved up (bottom 130 px) so it sits above the button. Below 600 px width the button moves up to bottom 84 px (above A-Frame's VR button) and the hint to 190 px.
   - Help line: "Read: walk to a pink ring".
4. **`?place=` removed**: no URL parsing; the per-place `start` values are gone from `PLACES`. The rig starts from `YARD.nest`. Title by distance is unchanged.

### How to test
- Serve the folder (for example `python -m http.server 8146`) and open `index.html` (or open the file directly).
- Start: the ant stands at the nest hole, soil rim on both sides, the yard and the giant person straight ahead. No Read button. Map: brown nest in the bottom-right corner (under the ant marker at first).
- Walk to the cracker (W / arrows): about 30 s in, the pink button appears. Press Enter or click it: "A Cracker Too Big" opens; the button is gone while the card is open and back after closing.
- Walk up the walkway to the mat: the lifted shoe's treaded sole hangs over the mat; walk to the mat's south edge under the heel and look up (drag the mouse). Button opens "Giant Feet Coming".
- Walk to the web: button opens "A Web in the Way". Click a far ring: "Walk closer to read this!" shows above the button.

### Checked in browser (127.0.0.1:8146; 1280x720 and 400x700; headless Chrome for the saved shots)
- Console: only the A-Frame 1.7.0 / THREE 173 logs on each load. No errors or warnings. From disk (file://, headless Chrome): 8 cards and 3 hotspots load; only A-Frame's standard file:// notice.
- Start: rig at (1017.3, 1037.3), not moved by collision; button hidden; title "Ant's-Eye World".
- Walk times (W held with real keydown/keyup events, aiming each frame, collision on, 60 fps): nest -> cracker 38.9 s (button appeared at 30.5 s); cracker -> doormat (to the spot under the heel, -560, -198) 14.8 s; doormat -> web (slides along the mat edge) 27.3 s. Total about 81 s of walking.
- Read button: real Enter at the cracker opened "A Cracker Too Big"; Enter on the focused Close button closed it and did not reopen; button back after closing; real click on the button reopened it. Real click on the button at the doormat opened "Giant Feet Coming" (no Words section). Real Enter at the web opened "A Web in the Way". Visibility by distance from the web point: 390 m and 399 m shown; 401, 420 and 800 m hidden. Hidden while a card is open.
- Ring click still works: hover + real click on the cracker ring opened its card; a real click on the far doormat ring (about 900 m) showed "Walk closer to read this!" above the button.
- Person: from (-560, -198) looking up, the treaded sole fills the view like a ceiling; the ant stands there (not solid). Ant placed inside the standing shoe's footprint was pushed out to (-400, -545) (step edge). Map pixels: standing shoe #3d6db3 on the steps, old sneaker spot now plain landing, nest #8b5a2b with dark centre #2a1a0e.
- Nest: ant placed inside a rim blob was pushed out to 33 m from its centre; the crater floor between hole and rim is walkable.
- Strawberry still unreachable: aiming at it for 6 s from the web front stopped at (397, -655), 77 m away; from (500, -300) and (380, -400) the bed / flower pot / end post stopped it 263 m and 175 m away.
- 400x700: button 52-348 px wide, 543-616 px from the top, no page side-scroll (scroll width 400), hint 460-510 px (above it), minimap 254-388 x 12-146 px: no overlap. (A-Frame hides its VR button in the pane's mobile emulation; on a narrow desktop window the button sits 84 px up, above the VR button.)
- Draw calls (renderer info): nest start view 1579 (it looks across the whole yard), old cracker start view 1021 (about 1034 before: -16 sneaker parts, +1 person, +2 shadows), mat views 505-698. FPS in the visible pane: nest start 53, cracker 60, mat 61.
- Screenshots (headless Chrome, 1280x720): `_workspace/04_start_nest.png` (start view), `_workspace/04_person.png` (walkway at (-470, -40) facing north: lifted sole over the mat, standing shoe on the step, ring + envelope, Read button), `_workspace/04_read_button.png` (near the cracker with the button).
- Server on 8146 stopped; my test tab closed. Port 8123 and the teacher's tab were not touched. Note: opening `index.html` from disk in the Browser pane reused the pane's existing file:// tab of `index.html` (it now shows the new page as a static snapshot, where js/problems.js does not load; this is a pane limit, real file:// was checked in headless Chrome).

### Known limits (Revision 4)
- **First place is about 30 s away** (nest -> cracker 38.9 s; button at 30.5 s). The skill guide asks for the nearest place at 10-15 s; the approved plan put the nest in the far south-east corner. Moving the nest north-west would shorten it.
- **The start view draws about 1580 objects** (53 fps here) because it looks across the whole yard (grass blades, pebbles and other small detail from earlier stages are separate entities). Slow school laptops may drop frames at the start. Merging the older small detail like the hedge would fix it (outside this revision).
- At the start the ant marker covers the nest on the minimap; it shows once the ant walks away. Facing out, the hole itself is behind the ant (only the rim is in view).
- The mat is solid (17 m bristles), so only the lifted shoe's heel part (about 70 m past the mat edge) can be walked under.
- The standing shoe is on top of the 144 m step, so from right in front of the step it is hidden by the step edge; from the walkway it shows on the step.
- The person is static and has no face detail (seen from behind).
- A far ring is depth-tested, so it can still show through open gaps (for example the doormat ring seen from the cracker); clicking it gives "Walk closer".
- Earlier limits still apply (read checks not saved on reload, HTML pop-up not visible in immersive VR, title box covers part of the view on narrow windows).
