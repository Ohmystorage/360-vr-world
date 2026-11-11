/* Ant's-Eye World - Quest 2 / 3 / 3S (stages 1 + 2). Only active inside a headset (VR mode); the computer view
   stays the same.
   - Stage 1: screen boxes do not show in a headset, so the "Read the message" label and the problem card are drawn
     as panels in the 3D world. A or X opens the card of the nearest place (same 400 m rule); A or X again closes it.
   - Stage 2: either joystick works like the arrow keys (up = forward, down = back, left/right = side-step), with the
     keyboard's speed and feel (same acceleration and easing as wasd-controls). Forward = where the head looks.
     Looking around and turning: head and body only. The screen edges darken while walking (less motion sickness).
   Walls: js/components.js (ant-walk) keeps the rig in the yard and out of solid things in VR too.
   Uses window.antNearest / antReadNearest / antCloseCard and the "ant-card-open/close" and "ant-hint" events from
   js/hotspots.js. */
(function () {
  var PINK = "#e0186f";
  var DIST = 1.0;        // card distance from the eyes in m
  var DEAD = 0.5;        // a joystick must be tilted this far to count as a pressed arrow key
  var EASING = 1.1;      // same as wasd-controls
  var scene, label, labelTex = {}, card, cardMesh, vignette;
  var open = null, hintUntil = 0;

  function vr() { return !!scene && scene.is("vr-mode"); }

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

  // ---- "Read the message" label (moves with the head, just below the middle of the view) ----
  function labelTexture(kind) {
    if (labelTex[kind]) return labelTex[kind];
    var cv = document.createElement("canvas"), c = cv.getContext("2d");
    cv.width = 1024; cv.height = 192;
    c.fillStyle = kind === "read" ? "rgba(224,24,111,.95)" : "rgba(40,40,40,.88)";
    rr(c, 8, 8, 1008, 176, 88); c.fill();
    c.strokeStyle = "#fff"; c.lineWidth = 8; rr(c, 8, 8, 1008, 176, 88); c.stroke();
    c.fillStyle = "#fff"; c.textAlign = "center";
    if (kind === "read") {
      c.font = "bold 62px Arial"; c.fillText("✉  Read the message", 512, 88);
      c.font = "bold 44px Arial"; c.fillText("press A or X", 512, 150);
    } else {
      c.font = "bold 58px Arial"; c.fillText(kind, 512, 116);
    }
    return (labelTex[kind] = texture(cv));
  }
  function showLabel(kind) {
    if (!kind) { label.visible = false; return; }
    var t = labelTexture(kind);
    if (label.material.map !== t) { label.material.map = t; label.material.needsUpdate = true; }
    label.visible = true;
  }
  function showHint(text) {
    if (!vr() || open || !label) return;
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
    // how to close: a blue pill (looks like the computer's Close button)
    var by = top + bh + 40;
    if (draw) {
      c.fillStyle = "#1f5fbf"; rr(c, W / 2 - 330, by, 660, 92, 46); c.fill();
      c.fillStyle = "#fff"; c.font = "bold 42px Arial"; c.textAlign = "center";
      c.fillText("Press A or X again to close", W / 2, by + 60);
      c.textAlign = "left";
    }
    return by + 92 + 60;
  }
  function cardTexture(data) {
    var cv = document.createElement("canvas"), c = cv.getContext("2d");
    cv.width = 1024; cv.height = 8;
    cv.height = Math.ceil(layoutCard(c, data, false));   // resizing clears the canvas and its settings
    c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = 30;
    c.fillStyle = "#fffdf6"; rr(c, 20, 20, 984, cv.height - 40, 40); c.fill();
    c.shadowBlur = 0;
    c.fillStyle = PINK; rr(c, 20, 20, 984, 22, 11); c.fill();
    layoutCard(c, data, true);
    return { tex: texture(cv), h: cv.height };
  }

  function hotspotsVisible(on) {
    document.querySelectorAll(".hotspot").forEach(function (e) { e.object3D.visible = on; });
  }
  function showCard(data) {
    var t = cardTexture(data), h = t.h / 1024, dist = DIST + Math.max(0, h - 1.2) * 0.8;
    if (cardMesh.material.map) cardMesh.material.map.dispose();
    cardMesh.material.map = t.tex; cardMesh.material.needsUpdate = true;
    cardMesh.scale.set(1, h, 1);
    cardMesh.position.set(0, -0.05, -dist);
    // in front of the eyes, level and facing the ant; it stays there (does not follow the head) until it closes
    var head = new THREE.Vector3(), dir = new THREE.Vector3();
    scene.camera.getWorldPosition(head); scene.camera.getWorldDirection(dir);
    dir.y = 0;
    if (dir.lengthSq() < 1e-6) dir.set(0, 0, -1);
    dir.normalize();
    card.position.copy(head);
    card.rotation.set(0, Math.atan2(-dir.x, -dir.z), 0);
    card.visible = true;
    hotspotsVisible(false);
    showLabel(null);
  }
  function hideCard() {
    if (!card || !card.visible) return;
    card.visible = false;
    hotspotsVisible(true);
  }

  // ---- A / X: open the nearest card, or close the open one ----
  function toggleCard() {
    if (!vr()) return;
    if (open) window.antCloseCard();
    else if (window.antNearest()) window.antReadNearest();
    else showHint("Walk closer to a pink ring!");
  }

  // ---- set up once the scene is ready ----
  function build() {
    // label: a child of the three.js camera, so it moves with the head inside the headset
    label = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.15), panelMat(labelTexture("read")));
    label.position.set(0, -0.42, -1.2);
    label.renderOrder = 12;
    label.visible = false;
    scene.camera.add(label);

    // vignette: dark screen edges while walking (also follows the head)
    var cv = document.createElement("canvas"), c = cv.getContext("2d");
    cv.width = cv.height = 256;
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

    // card: a dark see-through ball around the head dims the world, the card panel sits inside it
    card = new THREE.Group();
    var dim = new THREE.Mesh(new THREE.SphereGeometry(4, 24, 16), panelMat(null, 0x000000, 0.45));
    dim.material.side = THREE.BackSide;
    dim.renderOrder = 9;
    cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), panelMat(null));
    cardMesh.renderOrder = 10;
    card.add(dim); card.add(cardMesh);
    card.visible = false;
    scene.object3D.add(card);

    document.querySelectorAll(".vr-hand").forEach(function (hand) {
      hand.addEventListener("abuttondown", toggleCard);
      hand.addEventListener("xbuttondown", toggleCard);
      hand.stick = { x: 0, y: 0 };
      hand.addEventListener("thumbstickmoved", function (e) { hand.stick.x = e.detail.x; hand.stick.y = e.detail.y; });
    });

    scene.addEventListener("enter-vr", function () {
      // start facing where the computer view was facing (A-Frame resets the camera's own turn in VR)
      var lc = document.getElementById("cam").components["look-controls"];
      document.getElementById("rig").object3D.rotation.y = lc.yawObject.rotation.y;
      if (open) showCard(open);
    });
    scene.addEventListener("exit-vr", function () {
      document.getElementById("rig").object3D.rotation.y = 0;   // the computer view turns the camera, not the rig
      showLabel(null);
      vignette.visible = false;
      hideCard();
    });
  }

  document.addEventListener("ant-card-open", function (e) { open = e.detail; if (vr() && card) showCard(open); });
  document.addEventListener("ant-card-close", function () { open = null; hideCard(); });
  document.addEventListener("ant-hint", function (e) { showHint(e.detail); });

  // Label: shows while a place is near and no card is open (checked 10x a second, like the Read button).
  AFRAME.registerSystem("vr-read-label", {
    init: function () { this.next = 0; },
    tick: function (t) {
      if (t < this.next || !label) return;
      this.next = t + 100;
      if (!vr() || open) { if (label.visible) showLabel(null); return; }
      if (performance.now() < hintUntil) return;
      showLabel(window.antNearest() ? "read" : null);
    }
  });

  // Joystick walking (VR only). Systems tick before components, so ant-walk then pushes the rig out of walls.
  AFRAME.registerSystem("vr-walk", {
    init: function () {
      this.v = new THREE.Vector3();
      this.q = new THREE.Quaternion();
      this.e = new THREE.Euler(0, 0, 0, "YXZ");
      this.fade = 0;
    },
    keys: function () {   // the joysticks as arrow keys: either hand counts
      var k = { up: false, down: false, left: false, right: false };
      document.querySelectorAll(".vr-hand").forEach(function (hand) {
        var s = hand.stick || { x: 0, y: 0 }, tc = hand.components["tracked-controls"];
        var gp = tc && tc.controller && tc.controller.gamepad;
        if (gp && gp.axes && gp.axes.length >= 4) s = { x: gp.axes[2], y: gp.axes[3] };  // read the live value when there is one
        if (s.y < -DEAD) k.up = true;
        if (s.y > DEAD) k.down = true;
        if (s.x < -DEAD) k.left = true;
        if (s.x > DEAD) k.right = true;
      });
      return k;
    },
    tick: function (t, dt) {
      var v = this.v;
      if (!vr() || !vignette) { v.set(0, 0, 0); this.fade = 0; return; }
      dt = dt / 1000;
      if (dt > 0.2) { v.set(0, 0, 0); return; }   // like wasd-controls: a long pause resets the speed
      // same easing and acceleration as wasd-controls (acceleration from the camera's wasd-controls attribute)
      var ease = Math.pow(1 / EASING, dt * 60);
      v.x *= ease; v.z *= ease;
      if (Math.abs(v.x) < 0.00001) v.x = 0;
      if (Math.abs(v.z) < 0.00001) v.z = 0;
      if (!open) {
        var acc = document.getElementById("cam").getAttribute("wasd-controls").acceleration, k = this.keys();
        if (k.left) v.x -= acc * dt;
        if (k.right) v.x += acc * dt;
        if (k.up) v.z -= acc * dt;
        if (k.down) v.z += acc * dt;
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
