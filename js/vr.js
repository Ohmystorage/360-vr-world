/* Ant's-Eye World - Quest 2 / 3 / 3S. Only active inside a headset (VR mode); the computer view stays the same.
   Rev 3 (teacher, Quest feedback 2026-11-11, plan _workspace/26_quest_fix2_plan_v3.png; no Exit VR / ? Controls buttons):
   - Entering VR: the controller guide panel opens first; Close (line + trigger) closes it and walking starts.
   - Cards: screen boxes do not show in a headset, so the card is drawn as a panel in the 3D world, 1.6 m ahead. It follows
     the head smoothly (about 0.3 s); the right joystick up/down moves it closer/farther.
   - Pointer line: RIGHT hand only. It shows near a pink ring (within 400 m) or while a card is open. Line on the envelope
     + trigger = open the card, but only right in front of the place (else "Walk closer to read this!"); on Close +
     trigger = close it. The left trigger and the A / B / X / Y buttons do nothing. Leave VR with the Meta button.
   - Walking: the LEFT joystick works like the arrow keys (up = forward where the head looks, down = back,
     left/right = side-step) with the keyboard feel (same easing) at 70% of its speed. The edges darken while walking.
   - Turning: the RIGHT joystick left/right turns 30 degrees once per push, with a short dark blink (less sickness).
   Walls: js/components.js (ant-walk) keeps the rig in the yard and out of solid things in VR too.
   Uses window.antCanOpen / antOpenCard / antCloseCard and the "ant-card-open/close" and "ant-hint" events from
   js/hotspots.js. */
(function () {
  var PINK = "#e0186f";
  var DIST = 1.6;            // card distance from the eyes when it opens, in m (teacher: 1.0 was too close)
  var ZOOM_MIN = 0.8, ZOOM_MAX = 3.0, ZOOM_SPEED = 1.0;   // right joystick up/down: card distance range (m), m/s
  var DEAD = 0.5;            // the left joystick must be tilted this far to count as a pressed arrow key
  var EASING = 1.1;          // same as wasd-controls
  var VR_SPEED = 0.7;        // headset walking = 70% of the keyboard speed (teacher: 30% slower)
  var TURN = Math.PI / 6;    // right joystick left/right: one 30 degree turn per push
  var AIM = Math.cos(7 * Math.PI / 180);   // the line counts as pointing at a ring within 7 degrees (easy to hit)
  var SHOW = 400;            // the line shows when a pink ring is this close (where rings draw on top of everything)
  var FOLLOW = 0.1;          // the open card catches up with the head in about 0.3 s (time constant, s)
  // right controller line start and direction (Quest 2 controller; Quest 3 sends its own)
  var RAY = { origin: { x: -0.0065, y: -0.0186, z: -0.05 }, direction: { x: -0.124, y: -0.594, z: -0.795 } };
  var scene, label, labelTex = {}, card, cardMesh, closeGlow, closeRect = null, cardH = 1024;
  var cardDist = DIST, cardMax = ZOOM_MAX, vignette, blackout, guide = false, ringGlow, hands = [];
  var open = null, hintUntil = 0;

  function vr() { return !!scene && scene.is("vr-mode"); }
  function busy() { return !!(open || guide); }   // a card or the controller guide is on screen

  // ---- canvas helpers ----
  function rr(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  // Writes text in lines no wider than w (first baseline y); returns the next baseline. draw false = measure only.
  function wrap(c, text, x, y, w, lh, draw) {
    var line = "";
    String(text || "").split(/\s+/).forEach(function (word) {
      var test = line ? line + " " + word : word;
      if (line && c.measureText(test).width > w) { if (draw) c.fillText(line, x, y); y += lh; line = word; }
      else line = test;
    });
    if (line) { if (draw) c.fillText(line, x, y); y += lh; }
    return y;
  }
  function fit(c, text, size, max) {   // bold font no bigger than size that fits in max px
    do { c.font = "bold " + size + "px Arial"; size -= 2; } while (c.measureText(text).width > max && size > 16);
  }
  function canvas(w, h) { var cv = document.createElement("canvas"); cv.width = w; cv.height = h; return cv; }
  function texture(cv) {
    var t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }
  // Unlit, no fog, drawn on top of the world (it is always closer than anything it could hide behind).
  function panelMat(map, color, opacity) {
    return new THREE.MeshBasicMaterial({ map: map || null, color: color === undefined ? 0xffffff : color, transparent: true,
      opacity: opacity === undefined ? 1 : opacity, depthTest: false, depthWrite: false, fog: false });
  }
  function setMap(mesh, t) { if (mesh.material.map !== t) { mesh.material.map = t; mesh.material.needsUpdate = true; } }

  // ---- hint label, e.g. "Walk closer to read this!" (moves with the head, just below the middle of the view) ----
  function labelTexture(kind) {
    if (labelTex[kind]) return labelTex[kind];
    var cv = canvas(1024, 192), c = cv.getContext("2d");
    c.fillStyle = "rgba(40,40,40,.88)";
    rr(c, 8, 8, 1008, 176, 88); c.fill();
    c.strokeStyle = "#fff"; c.lineWidth = 8; rr(c, 8, 8, 1008, 176, 88); c.stroke();
    c.fillStyle = "#fff"; c.textAlign = "center";
    fit(c, kind, 58, 940); c.fillText(kind, 512, 116);
    return (labelTex[kind] = texture(cv));
  }
  function showLabel(kind) {
    if (!kind) { label.visible = false; return; }
    setMap(label, labelTexture(kind));
    label.visible = true;
  }
  function showHint(text) {
    if (!vr() || busy() || !label) return;
    showLabel(text);
    hintUntil = performance.now() + 2500;
  }

  // ---- the card panel ----
  // Lays out the card on a 1024 px wide canvas (1024 px = 1 m). Returns the canvas height.
  function layoutCard(c, data, draw) {
    var W = 1024, x = 70, w = W - 140, y = 124;
    function text(font, color, t, lh, indent) {
      c.font = font; c.fillStyle = color;
      y = wrap(c, t, x + (indent || 0), y, w - (indent || 0), lh, draw);
    }
    text("bold 64px Arial", "#1a1a1a", data.title, 74);
    y += 4;
    text("40px Arial", "#222", data.problem, 52);
    y += 30;
    text("bold 44px Arial", "#6b3200", "Why is it hard?", 58);
    text("40px Arial", "#222", data.whyHard, 52);
    if (data.words && data.words.length) {
      y += 30;
      text("bold 44px Arial", "#6b3200", "Words to know", 58);
      data.words.forEach(function (wd) {
        text("bold 40px Arial", "#1a1a1a", "• " + wd.word, 50);
        text("40px Arial", "#222", wd.meaning, 50, 34);
      });
    }
    // design challenge box: measure the question first, then draw the box behind it
    var top = y - 10;
    c.font = "bold 38px Arial";
    var qEnd = wrap(c, data.question, x + 34, top + 104, w - 60, 46, false);
    var bh = qEnd - 46 + 34 - top;
    if (draw) {
      c.fillStyle = "#fff1a8"; rr(c, x, top, w, bh, 16); c.fill();
      c.fillStyle = "#d4006e"; c.fillRect(x, top, 12, bh);
      c.fillStyle = "#6b3200"; c.font = "bold 40px Arial"; c.fillText("Your design challenge", x + 34, top + 54);
      c.fillStyle = "#1a1a1a"; c.font = "bold 38px Arial"; wrap(c, data.question, x + 34, top + 104, w - 60, 46, true);
    }
    // Close button (point at it and pull the trigger), with the other ways written under it
    var by = top + bh + 40;
    closeRect = { x: W / 2 - 330, y: by, w: 660, h: 92 };
    if (draw) {
      c.fillStyle = "#1f5fbf"; rr(c, closeRect.x, by, 660, 92, 46); c.fill();
      c.fillStyle = "#fff"; c.font = "bold 50px Arial"; c.textAlign = "center";
      c.fillText("Close", W / 2, by + 64);
      c.fillStyle = "#666"; c.font = "34px Arial";
      c.fillText("right stick ↑ ↓ to zoom", W / 2, by + 144);
      c.textAlign = "left";
    }
    return by + 144 + 50;
  }
  function cardTexture(data) {
    var cv = canvas(1024, 8), c = cv.getContext("2d");
    cv.height = Math.ceil(layoutCard(c, data, false));   // resizing clears the canvas and its settings
    c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = 30;
    c.fillStyle = "#fffdf6"; rr(c, 20, 20, 984, cv.height - 40, 40); c.fill();
    c.shadowBlur = 0;
    c.fillStyle = PINK; rr(c, 20, 20, 984, 22, 11); c.fill();
    layoutCard(c, data, true);
    return { tex: texture(cv), h: cv.height };
  }

  // ---- controller guide panel (opens when entering VR): two controller drawings with numbers, and a list ----
  var BODY = { left: "M70 60 Q60 140 90 185 Q120 205 160 185 Q200 140 190 70 Q170 30 120 35 Q85 35 70 60Z",
               right: "M230 60 Q240 140 210 185 Q180 205 140 185 Q100 140 110 70 Q130 30 180 35 Q215 35 230 60Z" };
  var BADGES = {   // [number, badge x, badge y, line from x,y to x,y] in the drawing's 300 x 200 space
    left: [[1, 35, 85, 49, 90, 83, 95]],
    right: [[2, 265, 80, 251, 84, 221, 92], [3, 265, 120, 251, 116, 219, 102], [4, 60, 75, 74, 75, 90, 72]]
  };
  function disc(c, x, y, r, fill, stroke) {
    c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = fill; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 3; c.stroke(); }
  }
  function drawPad(c, ox, oy, side) {
    var R = side === "right", sx = R ? 195 : 105;
    c.save(); c.translate(ox, oy); c.scale(1.5, 1.5);
    var body = new Path2D(BODY[side]);
    c.fillStyle = "#3a3a44"; c.strokeStyle = "#111"; c.lineWidth = 3; c.fill(body); c.stroke(body);
    disc(c, sx, 95, 22, "#888", "#111"); disc(c, sx, 95, 11, "#bbb");
    c.fillStyle = "#555"; c.fillRect(R ? 90 : 170, 60, 40, 20); c.strokeRect(R ? 90 : 170, 60, 40, 20);
    c.font = "bold 11px Arial"; c.textAlign = "center"; c.textBaseline = "middle";
    [[150, 140, R ? "B" : "Y"], [R ? 175 : 125, 155, R ? "A" : "X"]].forEach(function (b) {
      disc(c, b[0], b[1], 9, "#ddd"); c.fillStyle = "#222"; c.fillText(b[2], b[0], b[1] + 1);
    });
    BADGES[side].forEach(function (b) {
      c.strokeStyle = PINK; c.lineWidth = 3; c.beginPath(); c.moveTo(b[3], b[4]); c.lineTo(b[5], b[6]); c.stroke();
      disc(c, b[1], b[2], 14, PINK); c.fillStyle = "#fff"; c.font = "bold 16px Arial"; c.fillText(b[0], b[1], b[2] + 1);
    });
    c.restore();
  }
  function guideTexture() {
    var W = 1024, H = 1022, cv = canvas(W, H), c = cv.getContext("2d");
    c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = 30;
    c.fillStyle = "#fffdf6"; rr(c, 20, 20, 984, H - 40, 40); c.fill();
    c.shadowBlur = 0;
    c.fillStyle = PINK; rr(c, 20, 20, 984, 22, 11); c.fill();
    c.textAlign = "left"; c.fillStyle = "#1a1a1a";
    fit(c, "How to use your controllers", 60, 884); c.fillText("How to use your controllers", 70, 124);
    drawPad(c, 62, 150, "left"); drawPad(c, 512, 150, "right");
    c.textAlign = "center"; c.textBaseline = "alphabetic"; c.fillStyle = "#444"; c.font = "bold 34px Arial";
    c.fillText("LEFT", 287, 495); c.fillText("RIGHT", 737, 495);
    c.textAlign = "left";
    var rows = [["1", "Walk", " — left stick"], ["2", "Turn", " — right stick ← →"],
      ["3", "Card closer / farther", " — right stick ↑ ↓"], ["4", "Point at ✉ + trigger", " — open a card, press Close"],
      ["eye", "Look around", " — turn your head"]];
    rows.forEach(function (r, i) {
      var y = 560 + i * 62;
      if (i < 4) { disc(c, 90, y - 13, 22, PINK); c.fillStyle = "#fff"; c.font = "bold 28px Arial"; c.textAlign = "center"; c.fillText(r[0], 90, y - 3); }
      else {   // a small drawn eye (emoji fonts are not on every browser)
        c.strokeStyle = PINK; c.lineWidth = 5; c.beginPath(); c.ellipse(90, y - 13, 24, 14, 0, 0, 7); c.stroke();
        disc(c, 90, y - 13, 8, PINK);
      }
      c.textAlign = "left"; c.fillStyle = "#1a1a1a"; c.font = "bold 38px Arial"; c.fillText(r[1], 130, y);
      var bw = c.measureText(r[1]).width;
      c.font = "38px Arial"; c.fillStyle = "#333"; c.fillText(r[2], 130 + bw, y);
    });
    var by = 860;
    closeRect = { x: W / 2 - 330, y: by, w: 660, h: 92 };
    c.fillStyle = "#1f5fbf"; rr(c, closeRect.x, by, 660, 92, 46); c.fill();
    c.fillStyle = "#fff"; c.font = "bold 50px Arial"; c.textAlign = "center"; c.fillText("Close", W / 2, by + 64);
    return { tex: texture(cv), h: H };
  }

  function hotspotsVisible(on) {
    document.querySelectorAll(".hotspot").forEach(function (e) { e.object3D.visible = on; });
  }
  function showCard(data) {
    var t = data.guide ? guideTexture() : cardTexture(data), h = t.h / 1024;
    cardH = t.h;
    cardDist = DIST + Math.max(0, h - 1.2) * 0.8;     // a tall card starts a bit farther
    cardMax = Math.max(ZOOM_MAX, cardDist);
    if (cardMesh.material.map) cardMesh.material.map.dispose();
    setMap(cardMesh, t.tex);
    cardMesh.scale.set(1, h, 1);
    cardMesh.position.set(0, -0.05, -cardDist);
    // pink outline over the Close button (a child of the card: undo the card's height scale)
    closeGlow.scale.set(1, 1 / h, 1);
    closeGlow.position.set((closeRect.x + closeRect.w / 2) / 1024 - 0.5, 0.5 - (closeRect.y + closeRect.h / 2) / t.h, 0);
    closeGlow.visible = false;
    followCard(1);   // in front of the eyes; after that it follows the head (vr-pointer tick)
    card.visible = true;
    hotspotsVisible(false);
    showLabel(null);
  }
  function hideCard() {
    if (!card || !card.visible) return;
    card.visible = false;
    closeGlow.visible = false;
    hotspotsVisible(true);
  }

  // The open card (or guide) keeps facing the eyes: each frame it turns part of the way toward where the head looks
  // (left/right and up/down, no tilt), so it catches up in about 0.3 s without jerking. k = 1 jumps straight there.
  var fq = new THREE.Quaternion(), fe = new THREE.Euler(0, 0, 0, "YXZ");
  function followCard(k) {
    scene.camera.getWorldPosition(card.position);
    scene.camera.getWorldQuaternion(fq);
    fe.setFromQuaternion(fq, "YXZ"); fe.z = 0;
    fq.setFromEuler(fe);
    if (k >= 1) card.quaternion.copy(fq); else card.quaternion.slerp(fq, k);
  }

  function closeGuide() { guide = false; hideCard(); }
  function openGuide() {
    if (open) window.antCloseCard();
    guide = true; showCard({ guide: true });
  }

  // ---- right trigger: press what the line points at ----
  function press(h) {
    if (!vr()) return;
    if (h.target === "close") { if (guide) closeGuide(); else window.antCloseCard(); }
    else if (h.target === "ring") window.antOpenCard(h.ring);   // too far: hotspots.js shows "Walk closer to read this!"
  }

  // ---- textures for the Close outline, the ring glow and the line end dot ----
  function outlineTexture() {
    var cv = canvas(700, 130), c = cv.getContext("2d");
    c.strokeStyle = "#fff"; c.lineWidth = 10; rr(c, 12, 12, 676, 106, 53); c.stroke();
    c.strokeStyle = "#ff3d9a"; c.lineWidth = 12; rr(c, 4, 4, 692, 122, 61); c.stroke();
    return texture(cv);
  }
  function glowTexture() {
    var cv = canvas(256, 256), c = cv.getContext("2d"), g = c.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.16, "rgba(255,255,255,1)");
    g.addColorStop(0.24, "rgba(255,79,168,.95)"); g.addColorStop(0.6, "rgba(255,79,168,.35)");
    g.addColorStop(1, "rgba(255,79,168,0)");
    c.fillStyle = g; c.fillRect(0, 0, 256, 256);
    return texture(cv);
  }
  function dotTexture() {
    var cv = canvas(64, 64), c = cv.getContext("2d");
    c.fillStyle = "#fff"; c.beginPath(); c.arc(32, 32, 22, 0, 7); c.fill();
    c.strokeStyle = "#ff3d9a"; c.lineWidth = 8; c.stroke();
    return texture(cv);
  }

  // ---- one pointer line per controller ----
  function makeRay(hand, dot) {
    var info = { el: hand, connected: false, target: null, ring: null };
    info.anchor = new THREE.Object3D();             // where the line starts, in the controller's own space
    hand.object3D.add(info.anchor);
    var geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)]);
    info.line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95,
      depthTest: false, depthWrite: false, fog: false }));
    info.line.renderOrder = 13;
    info.line.frustumCulled = false;
    info.dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, depthTest: false, depthWrite: false, fog: false }));
    info.dot.renderOrder = 13;
    info.line.visible = info.dot.visible = false;
    scene.object3D.add(info.line); scene.object3D.add(info.dot);
    function aim(ro) {
      var d = ro.direction;
      info.anchor.position.set(ro.origin.x, ro.origin.y, ro.origin.z);
      info.anchor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), new THREE.Vector3(d.x, d.y, d.z).normalize());
    }
    aim(RAY);
    hand.addEventListener("controllermodelready", function (e) { if (e.detail && e.detail.rayOrigin) aim(e.detail.rayOrigin); });
    hand.addEventListener("controllerconnected", function () { info.connected = true; });
    hand.addEventListener("controllerdisconnected", function () { info.connected = false; });
    hand.addEventListener("triggerdown", function () { press(info); });
    return info;
  }
  function hideRay(h) { h.line.visible = h.dot.visible = false; h.target = null; }

  // ---- set up once the scene is ready ----
  function build() {
    // label: a child of the three.js camera, so it moves with the head inside the headset
    label = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.15), panelMat(null));
    label.position.set(0, -0.42, -1.2);
    label.renderOrder = 12;
    label.visible = false;
    scene.camera.add(label);

    // vignette: dark screen edges while walking (also follows the head)
    var cv = canvas(256, 256), c = cv.getContext("2d");
    var g = c.createRadialGradient(128, 128, 0, 128, 128, 128);
    // clear middle (about 20 degrees each way), getting darker out to about 50 degrees (the headset's edge)
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.18, "rgba(0,0,0,0)");
    g.addColorStop(0.55, "rgba(0,0,0,0.85)"); g.addColorStop(1, "rgba(0,0,0,0.85)");
    c.fillStyle = g; c.fillRect(0, 0, 256, 256);
    vignette = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), panelMat(texture(cv), 0xffffff, 0));
    vignette.position.set(0, 0, -0.5);
    vignette.renderOrder = 8;
    vignette.visible = false;
    scene.camera.add(vignette);

    // blink: the whole view goes dark for a moment during a 30 degree turn
    blackout = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), panelMat(null, 0x000000, 0));
    blackout.position.set(0, 0, -0.25);
    blackout.renderOrder = 30;
    blackout.visible = false;
    scene.camera.add(blackout);

    // card: a dark see-through ball around the head dims the world, the card panel sits inside it
    card = new THREE.Group();
    var dim = new THREE.Mesh(new THREE.SphereGeometry(4, 24, 16), panelMat(null, 0x000000, 0.45));
    dim.material.side = THREE.BackSide;
    dim.renderOrder = 9;
    cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), panelMat(null));
    cardMesh.renderOrder = 10;
    closeGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.13), panelMat(outlineTexture()));
    closeGlow.renderOrder = 11;
    closeGlow.visible = false;
    cardMesh.add(closeGlow);
    card.add(dim); card.add(cardMesh);
    card.visible = false;
    scene.object3D.add(card);

    // glow on the pink ring the line points at
    ringGlow = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), panelMat(glowTexture()));
    ringGlow.renderOrder = 12;
    ringGlow.visible = false;
    scene.object3D.add(ringGlow);

    var dot = dotTexture();
    document.querySelectorAll(".vr-hand").forEach(function (hand) {
      hand.stick = { x: 0, y: 0 };
      hand.addEventListener("thumbstickmoved", function (e) { hand.stick.x = e.detail.x; hand.stick.y = e.detail.y; });
      if (hand.id === "hand-right") hands.push(makeRay(hand, dot));   // the left hand has no line
    });

    scene.addEventListener("enter-vr", function () {
      // start facing where the computer view was facing (A-Frame resets the camera's own turn in VR)
      var lc = document.getElementById("cam").components["look-controls"];
      document.getElementById("rig").object3D.rotation.y = lc.yawObject.rotation.y;
      if (open) showCard(open); else openGuide();   // the controller guide comes first every time
    });
    scene.addEventListener("exit-vr", function () {
      document.getElementById("rig").object3D.rotation.y = 0;   // the computer view turns the camera, not the rig
      showLabel(null);
      vignette.visible = blackout.visible = ringGlow.visible = false;
      guide = false;
      hands.forEach(hideRay);
      hideCard();
    });
  }

  document.addEventListener("ant-card-open", function (e) { guide = false; open = e.detail; if (vr() && card) showCard(open); });
  document.addEventListener("ant-card-close", function () { open = null; hideCard(); });
  document.addEventListener("ant-hint", function (e) { showHint(e.detail); });

  // Hint label: hides again after 2.5 s, or when a card opens or VR ends.
  AFRAME.registerSystem("vr-hint", {
    tick: function () {
      if (label && label.visible && (!vr() || busy() || performance.now() > hintUntil)) showLabel(null);
    }
  });

  // Pointer lines (VR only): what each controller's line points at, and how the targets look.
  AFRAME.registerSystem("vr-pointer", {
    init: function () {
      this.rc = new THREE.Raycaster();
      this.o = new THREE.Vector3(); this.d = new THREE.Vector3(); this.e = new THREE.Vector3();
      this.c = new THREE.Vector3(); this.head = new THREE.Vector3(); this.q = new THREE.Quaternion();
    },
    tick: function (t, dt) {
      if (!card) return;
      if (!vr()) {
        if (ringGlow.visible || hands.some(function (h) { return h.line.visible; })) { ringGlow.visible = false; hands.forEach(hideRay); }
        return;
      }
      if (card.visible) { followCard(1 - Math.exp(-Math.min(dt || 16, 100) / 1000 / FOLLOW)); card.updateMatrixWorld(true); }
      var self = this, onRing = false, onClose = false, glowAt = null;
      scene.camera.getWorldPosition(this.head);
      // pink rings within SHOW m of the head (none while a card is open: the rings are hidden then)
      var rings = [];
      if (!busy()) document.querySelectorAll(".hotspot").forEach(function (el) {
        var p = new THREE.Vector3();
        el.object3D.getWorldPosition(p);
        if (Math.hypot(p.x - self.head.x, p.z - self.head.z) < SHOW) rings.push({ id: el.getAttribute("hotspot").id, p: p });
      });
      hands.forEach(function (h) {
        var tc = h.el.components["tracked-controls"], ring = null;
        h.target = null; h.ring = null;
        if (!h.connected && !(tc && tc.controller)) { hideRay(h); return; }
        var o = self.o, d = self.d, e = self.e, rc = self.rc, len = 0, x;
        h.anchor.updateWorldMatrix(true, false);
        h.anchor.getWorldPosition(o);
        d.set(0, 0, -1).applyQuaternion(h.anchor.getWorldQuaternion(self.q));
        rc.set(o, d);
        if (busy()) {
          len = cardDist;
          if ((x = rc.intersectObject(cardMesh, false)[0])) {
            len = x.distance;
            var px = x.uv.x * 1024, py = (1 - x.uv.y) * cardH, r = closeRect;
            if (r && px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) { h.target = "close"; onClose = true; }
          }
        } else if (rings.length) {
          var best = AIM;   // the ring closest to the line direction, within 7 degrees
          rings.forEach(function (rg) {
            e.copy(rg.p).sub(o);
            var cosA = e.dot(d) / e.length();
            if (cosA > best) { best = cosA; ring = rg; }
          });
          len = 3;
          if (ring) {
            h.target = "ring"; h.ring = ring.id;
            if (window.antCanOpen(ring.id)) { onRing = true; glowAt = ring.p; }   // pink only where it would open
          }
        } else { hideRay(h); return; }
        if (ring) e.copy(ring.p); else e.copy(d).multiplyScalar(len).add(o);   // on a ring: snap to it
        var p = h.line.geometry.attributes.position;
        p.setXYZ(0, o.x, o.y, o.z); p.setXYZ(1, e.x, e.y, e.z); p.needsUpdate = true;
        h.line.material.color.set(onRing || onClose ? 0xff4fa8 : 0xffffff);
        h.dot.position.copy(e);
        h.dot.scale.setScalar(self.head.distanceTo(e) * 0.02);
        h.line.visible = h.dot.visible = true;
      });
      closeGlow.visible = onClose;
      ringGlow.visible = onRing;
      if (onRing) {
        ringGlow.position.copy(glowAt);
        ringGlow.lookAt(this.head);
        ringGlow.scale.setScalar(this.head.distanceTo(glowAt) * 0.08);
      }
    }
  });

  // Turn the rig around the head (the ant stays on its spot).
  function turnRig(a) {
    var rig = document.getElementById("rig").object3D, head = new THREE.Vector3();
    scene.camera.getWorldPosition(head);
    rig.updateMatrixWorld(true);
    var local = rig.worldToLocal(head.clone());
    rig.rotation.y += a;
    rig.updateMatrixWorld(true);
    var now = rig.localToWorld(local);
    rig.position.x += head.x - now.x;
    rig.position.z += head.z - now.z;
  }

  // Left joystick walking, right joystick turning (card closed) or zoom (card open). VR only.
  // Systems tick before components, so ant-walk then pushes the rig out of walls.
  AFRAME.registerSystem("vr-walk", {
    init: function () {
      this.v = new THREE.Vector3();
      this.q = new THREE.Quaternion();
      this.e = new THREE.Euler(0, 0, 0, "YXZ");
      this.fade = 0;
      this.armed = true;     // a turn needs the right joystick back in the middle first
      this.blink = -1;       // seconds into a turn's blink, -1 = none
    },
    stick: function (id) {
      var hand = document.getElementById(id), s = (hand && hand.stick) || { x: 0, y: 0 };
      var tc = hand && hand.components["tracked-controls"], gp = tc && tc.controller && tc.controller.gamepad;
      if (gp && gp.axes && gp.axes.length >= 4) s = { x: gp.axes[2], y: gp.axes[3] };  // read the live value when there is one
      return s;
    },
    tick: function (t, dt) {
      var v = this.v;
      if (!vr() || !vignette) { v.set(0, 0, 0); this.fade = 0; this.blink = -1; return; }
      dt = dt / 1000;
      if (dt > 0.2) { v.set(0, 0, 0); return; }   // like wasd-controls: a long pause resets the speed

      // right joystick
      var rs = this.stick("hand-right");
      if (busy()) {
        this.armed = false;
        if (Math.abs(rs.y) > 0.2) {   // up = closer (zoom in), down = farther (zoom out)
          cardDist = Math.min(cardMax, Math.max(ZOOM_MIN, cardDist + rs.y * ZOOM_SPEED * dt));
          cardMesh.position.z = -cardDist;
        }
      } else if (Math.abs(rs.x) < 0.3) this.armed = true;
      else if (this.armed && Math.abs(rs.x) > 0.7 && this.blink < 0) {
        this.armed = false; this.blink = 0; this.turned = false; this.dir = rs.x > 0 ? -1 : 1;
      }
      if (this.blink >= 0) {   // dark in 0.06 s, turn while dark, light again by 0.18 s
        this.blink += dt;
        if (!this.turned && this.blink >= 0.06) { turnRig(this.dir * TURN); this.turned = true; }
        blackout.material.opacity = this.blink < 0.06 ? this.blink / 0.06 : Math.max(0, 1 - (this.blink - 0.06) / 0.12);
        blackout.visible = true;
        if (this.blink >= 0.18) { this.blink = -1; blackout.visible = false; }
      }

      // left joystick = arrow keys, same easing as wasd-controls, 70% of its acceleration
      var ease = Math.pow(1 / EASING, dt * 60);
      v.x *= ease; v.z *= ease;
      if (Math.abs(v.x) < 0.00001) v.x = 0;
      if (Math.abs(v.z) < 0.00001) v.z = 0;
      if (!busy()) {
        var acc = document.getElementById("cam").getAttribute("wasd-controls").acceleration * VR_SPEED;
        var s = this.stick("hand-left");
        if (s.x < -DEAD) v.x -= acc * dt;
        if (s.x > DEAD) v.x += acc * dt;
        if (s.y < -DEAD) v.z -= acc * dt;
        if (s.y > DEAD) v.z += acc * dt;
      }
      var moving = Math.hypot(v.x, v.z) > 1;
      if (v.x || v.z) {
        scene.camera.getWorldQuaternion(this.q);
        this.e.setFromQuaternion(this.q, "YXZ");
        var yaw = this.e.y, cs = Math.cos(yaw), sn = Math.sin(yaw), rig = document.getElementById("rig").object3D.position;
        rig.x += (v.x * cs + v.z * sn) * dt;
        rig.z += (-v.x * sn + v.z * cs) * dt;
      }
      // vignette fades in over ~0.2 s while walking and out when stopped
      this.fade = Math.max(0, Math.min(1, this.fade + (moving ? dt : -dt) * 5));
      vignette.material.opacity = this.fade;
      vignette.visible = this.fade > 0;
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    scene = document.querySelector("a-scene");
    if (scene.hasLoaded) build(); else scene.addEventListener("loaded", build);
  });
})();
