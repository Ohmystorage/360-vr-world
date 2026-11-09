---
name: aframe
description: Build WebXR/VR scenes with A-Frame (HTML + three.js) for the Ant's-Eye World - ant-scale residential yard, worm's-eye camera, keyboard movement, clickable hotspots and pop-ups. Use when creating or editing the 3D scene, A-Frame entities or components, movement, hotspots, or testing on desktop, Quest, Vision Pro or phone. Not for writing lesson text (use ant-problem-cards).
---

# A-Frame (project guide)

Source: https://github.com/aframevr/aframe (docs: https://aframe.io/docs/). Upstream has no skill; this is the project guide.

## File layout
```
index.html          intro page (background assets/intro-bg.png, Enter button -> world.html)
world.html          scene, pop-up markup, script tags
js/problems.js      card data (owned by learning-designer)
js/components.js    custom A-Frame components (only when world.html gets crowded)
```
Load A-Frame from `https://aframe.io/releases/1.7.0/aframe.min.js` (verified available). Load data with `<script src>`, never `fetch()`, so the page also works when opened from disk.

## Ant scale (the core rule)
Why: in a headset the camera height comes from the real head (~1.6 m), so you cannot shrink the player. Scale the world up instead, and use the same scale on desktop so both feel the same.
- Scale factor: ant eye height ~2 mm, player eye 1.6 m, so **1 real cm = 8 scene metres (x800)**.
- Examples: grass blade 8 cm -> 64 m; crumb 1 cm -> 8 m; curb 15 cm -> 120 m; porch step 18 cm -> 144 m; flower pot 30 cm -> 240 m; fence 1.2 m -> 960 m; house wall 3 m+ -> 2400 m+.
- Object sizes follow x800; distances between places do not. Why: a real yard at x800 is kilometres wide and children lose interest. Build a compact "mini yard": all hotspots grouped in one play area, the house, big fence and street as giant backdrops outside it.
- Size the play area by walking time, not metres (teacher's rule): nearest hotspot about 10-15 s away, edge to edge about 30-40 s, visiting all 8 hotspots about 3 minutes or less (not counting reading time). Set the walking speed first, then place hotspots to fit these times, and measure by actually walking.
- Camera: `near: 0.1`, `far: 10000` or more, so giant backdrops are not clipped.
- Light fog (`fog="type: linear; near: 300; far: 3000"`) sells the size and hides the edge.

## Worm's-eye view
- Desktop camera at y = 1.6 inside a rig at ground level (y = 0). Start with an upward tilt (rotation x about 10-15 degrees) so tall things loom.
- Put tall objects close to the start point so the first view looks up at them.
- Ground texture detail (pebbles, soil bumps, grass clumps) at the camera's feet makes the scale readable.

## Movement
- Rig: `<a-entity id="rig"><a-camera wasd-controls="acceleration: …" look-controls></a-camera></a-entity>`. `wasd-controls` handles both WASD and arrow keys. Walking speed is set by the teacher: about 65 m/s (`acceleration: 357.5`; the teacher cut it to 75% then 80%, then raised it 20% and 30%), which makes edge to edge about 38 s in the 3-place yard. Verify by measuring; `acceleration` and damping both affect it.
- Keep `fly: false` so the ant stays on the ground.
- Bounds and obstacles: one small custom component that clamps the camera/rig position to the play area and pushes it out of simple circles/boxes around solid objects. No physics engine.
- Freeze movement while a pop-up is open (toggle `wasd-controls` `enabled`).

## Minimap
- A small HTML `<canvas>` (about 200-240px) fixed on the right side, drawing the yard from above in flat shapes. Draw it in 2D; do not add a second 3D camera (cheaper and clearer for children).
- Keep one shared list of landmark footprints (x, z, size) in code and use it for both the 3D objects and the minimap, so the map cannot drift from the world.
- Each frame (a `tick` component), map the rig's x/z to canvas pixels and draw an ant-shaped marker (teacher's choice, not an arrow) rotated to the camera's yaw.
- No text labels on the map (teacher's choice); landmarks are recognized by shape and color.
- Hotspot markers on the map come from the same hotspot positions used in the scene, labeled with a number or short title.

## Hotspots and pop-ups
- Hotspot: a glowing marker (e.g. pulsing ring + floating arrow, via `animation`) with `class="hotspot"` and `data-problem-id="<card id>"`.
- Clicking: `<a-scene cursor="rayOrigin: mouse" raycaster="objects: .hotspot">` and a `click` listener per hotspot.
- Pop-up: an HTML overlay `<div>` above the canvas, filled from `window.ANT_PROBLEMS` by `id`. Body text at least 18px, Close button, Escape closes.
- In immersive VR the HTML overlay is not visible; an in-scene panel is a later step, not part of the desktop stages.

## Running and testing
- WebXR needs HTTPS except on `localhost`. Local: `npx serve` or `python -m http.server`.
- Headset/phone: deploy to GitHub Pages, Netlify or Vercel. Quest/Pico: built-in browser. PC VR: Chrome/Edge + SteamVR. Vision Pro: Safari.
- iPhone Safari has no immersive WebXR: gyro look-around only (motion-permission tap over HTTPS). Split-screen or red/cyan anaglyph need extra three.js code (`StereoEffect`, `AnaglyphEffect`).

## Conventions
- Primitives only (box, cylinder, cone, plane, sphere, ring) unless the teacher approves models.
- English UI text, short, readable for grades 3-5.
- Build only the current stage; smallest change that works; check in the browser, not just by reading code.
- Never put secrets in scene files or notes.
