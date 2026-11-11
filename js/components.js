/* Ant's-Eye World - stage 3: walking limits, minimap, "near a place" title. Stage 4: glowing pink place dots
   with check marks on the minimap, and the ant nest (rev 4) (hotspots and pop-up are in js/hotspots.js).
   Reads window.YARD (bounds, zones, solids) and window.PLACES from world.html, so collision and the
   minimap use the same footprint list. Put "ant-walk" on the camera, after wasd-controls.
   The rig keeps rotation 0 (the start yaw is set on look-controls), so world x/z = rig + camera. */
(function () {
  var R = 3;          // ant body radius in scene m (about 4 mm real)
  var NEAR = 450;     // title shows a place when the ant is this close to its PLACES point (nearest wins)
  var PX = 480;       // minimap canvas size in pixels (shown at about 220 px, sharp on hi-dpi screens)
  var DEG = Math.PI / 180;

  // Push point p out of one footprint. Circle {x, z, r} or box {x, z, w, d, rot} (rot = A-Frame y rotation).
  // A footprint may also have poly ([dx, dz] points around x, z): the map draws that outline, walking still uses r.
  function pushOut(p, f) {
    var dx = p.x - f.x, dz = p.z - f.z, d;
    if (f.r) {
      d = Math.hypot(dx, dz);
      if (d < f.r + R && d > 0) { p.x = f.x + dx / d * (f.r + R); p.z = f.z + dz / d * (f.r + R); }
      return;
    }
    var c = Math.cos((f.rot || 0) * DEG), s = Math.sin((f.rot || 0) * DEG);
    var lx = dx * c - dz * s, lz = dx * s + dz * c, hx = f.w / 2, hz = f.d / 2;
    var cx = Math.max(-hx, Math.min(hx, lx)), cz = Math.max(-hz, Math.min(hz, lz));
    d = Math.hypot(lx - cx, lz - cz);
    if (d >= R) return;
    if (d > 0) { lx = cx + (lx - cx) / d * R; lz = cz + (lz - cz) / d * R; }
    else if (hx - Math.abs(lx) < hz - Math.abs(lz)) lx = (lx < 0 ? -1 : 1) * (hx + R);  // inside: nearest side
    else lz = (lz < 0 ? -1 : 1) * (hz + R);
    p.x = f.x + lx * c + lz * s; p.z = f.z - lx * s + lz * c;
  }

  // Minimap view: the play area plus a margin, north (-z) up.
  function view(Y) {
    var b = Y.bounds, size = Math.max(b.x1 - b.x0, b.z1 - b.z0) + 300;
    return { x0: (b.x0 + b.x1 - size) / 2, z0: (b.z0 + b.z1 - size) / 2, s: PX / size };
  }

  function shape(c, v, f) {
    c.save();
    c.translate((f.x - v.x0) * v.s, (f.z - v.z0) * v.s);
    c.fillStyle = f.color;
    c.beginPath();
    if (f.poly) f.poly.forEach(function (q, k) { c[k ? "lineTo" : "moveTo"](q[0] * v.s, q[1] * v.s); });  // outline around x, z (cookie)
    else if (f.r) c.arc(0, 0, Math.max(f.r * v.s, 2), 0, 7);
    else {
      var w = Math.max(f.w * v.s, 3), h = Math.max(f.d * v.s, 3);
      c.rotate(-(f.rot || 0) * DEG);
      c.rect(-w / 2, -h / 2, w, h);
    }
    c.fill();
    if (f.edge) { c.strokeStyle = f.edge; c.lineWidth = 3; c.stroke(); }
    c.restore();
  }

  function drawMap(canvas, Y, v) {
    var c = canvas.getContext("2d"), b = Y.bounds;
    var bx = (b.x0 - v.x0) * v.s, bz = (b.z0 - v.z0) * v.s, bw = (b.x1 - b.x0) * v.s, bh = (b.z1 - b.z0) * v.s;
    c.fillStyle = "#7d8a5c"; c.fillRect(0, 0, PX, PX);
    Y.zones.forEach(function (f) { shape(c, v, f); });
    c.fillStyle = "rgba(255, 255, 255, 0.4)";           // outside the play area: faded
    c.beginPath(); c.rect(0, 0, PX, PX); c.rect(bx, bz, bw, bh); c.fill("evenodd");
    Y.solids.forEach(function (f) { if (f.color) shape(c, v, f); });
    if (Y.nest) {  // rev 4: the ant nest (start), a brown mound with a dark center, no text
      var nx = (Y.nest.x - v.x0) * v.s, nz = (Y.nest.z - v.z0) * v.s;
      c.beginPath(); c.arc(nx, nz, Math.max(Y.nest.r * v.s, 14), 0, 7);
      c.fillStyle = "#8b5a2b"; c.fill(); c.lineWidth = 3; c.strokeStyle = "#ffffff"; c.stroke();
      c.beginPath(); c.arc(nx, nz, Math.max(Y.nest.hole * v.s, 5), 0, 7);
      c.fillStyle = "#2a1a0e"; c.fill();
    }
    c.strokeStyle = "rgba(255, 255, 255, 0.9)"; c.lineWidth = 3; c.setLineDash([10, 8]);
    c.strokeRect(bx, bz, bw, bh); c.setLineDash([]);
    // (north mark removed at teacher's request, stage 5)
  }

  // Stage 4: a pink dot with a pulsing glow per placed place (no number), a green check once its card was opened.
  // Own canvas layer under the ant. Returns true while any dot is unread (then ant-walk keeps redrawing it).
  function drawSpots(canvas, v, t) {
    var c = canvas.getContext("2d"), read = window.ANT_READ || {}, ph = (Math.sin(t / 300) + 1) / 2, unread = false;
    c.clearRect(0, 0, PX, PX);
    (window.PLACES || []).filter(function (q) { return q.placed; }).forEach(function (q) {
      var x = (q.x - v.x0) * v.s, y = (q.z - v.z0) * v.s, done = read[q.id];
      if (done) {
        c.beginPath(); c.arc(x, y, 22, 0, 7);
        c.fillStyle = "#1e9e3a"; c.fill();
        c.lineWidth = 5; c.strokeStyle = "#ffffff"; c.stroke();
        c.lineWidth = 2; c.strokeStyle = "#222222"; c.beginPath(); c.arc(x, y, 25, 0, 7); c.stroke();
        c.strokeStyle = "#ffffff"; c.lineWidth = 6; c.lineCap = "round"; c.lineJoin = "round";
        c.beginPath(); c.moveTo(x - 10, y + 1); c.lineTo(x - 3, y + 9); c.lineTo(x + 11, y - 8); c.stroke();
        return;
      }
      unread = true;
      var r = 26 + 20 * ph, a = 0.45 + 0.55 * ph, g = c.createRadialGradient(x, y, 0, x, y, r);   // soft glow, swells and dims
      g.addColorStop(0, "rgba(255, 60, 160, " + a + ")");
      g.addColorStop(0.5, "rgba(255, 60, 160, " + a * 0.7 + ")");
      g.addColorStop(1, "rgba(255, 60, 160, 0)");
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      c.beginPath(); c.arc(x, y, 13, 0, 7);
      c.fillStyle = "#e0157f"; c.fill();
      c.lineWidth = 4; c.strokeStyle = "#ffffff"; c.stroke();
    });
    return unread;
  }

  function drawAnt(c, v, p, yaw) {
    c.clearRect(0, 0, PX, PX);
    c.save();
    c.translate((p.x - v.x0) * v.s, (p.z - v.z0) * v.s);
    c.rotate(-yaw);                                     // camera forward is -z; canvas up is -z too (head up)
    // top-down ant: legs + antennae (lines), then head, thorax, abdomen (ovals). White pass = outline.
    var limbs = new Path2D(), body = new Path2D(), sx;
    for (sx = -1; sx <= 1; sx += 2) {
      limbs.moveTo(2 * sx, -22); limbs.lineTo(4 * sx, -29); limbs.lineTo(10 * sx, -32);   // antenna
      limbs.moveTo(2 * sx, -9); limbs.lineTo(9 * sx, -13); limbs.lineTo(12 * sx, -20);    // front leg
      limbs.moveTo(2 * sx, -6); limbs.lineTo(11 * sx, -6); limbs.lineTo(15 * sx, -1);     // middle leg
      limbs.moveTo(2 * sx, -3); limbs.lineTo(9 * sx, 3); limbs.lineTo(12 * sx, 13);       // back leg
    }
    body.ellipse(0, -18, 5, 4.5, 0, 0, 7); body.closePath();                              // head
    body.moveTo(3.5, -6); body.ellipse(0, -6, 3.5, 5.5, 0, 0, 7); body.closePath();       // thorax
    body.moveTo(7, 11); body.ellipse(0, 11, 7, 9, 0, 0, 7);                               // abdomen
    c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = "#ffffff";
    c.lineWidth = 7; c.stroke(limbs);
    c.lineWidth = 5; c.stroke(body);
    c.strokeStyle = c.fillStyle = "#1c1410";
    c.lineWidth = 3; c.stroke(limbs);
    c.fill(body);
    c.restore();
  }

  AFRAME.registerComponent("ant-walk", {
    init: function () {
      this.rig = this.el.parentNode.object3D;
      this.base = document.getElementById("map-base");
      this.ant = document.getElementById("map-ant").getContext("2d");
      this.titleEl = document.getElementById("place-name");
      this.spots = document.getElementById("map-spots");
      this.v = null; this.last = ""; this.nextTitle = 0; this.nextSpots = 0; this.pulse = true;
      var self = this;
      document.addEventListener("ant-read", function () { if (self.v) self.pulse = drawSpots(self.spots, self.v, performance.now()); });
    },
    tick: function (t) {
      var Y = window.YARD;
      if (!Y) return;
      var cam = this.el.object3D.position, rig = this.rig.position, b = Y.bounds;
      var p = { x: rig.x + cam.x, z: rig.z + cam.z }, i, k;
      for (k = 0; k < 2; k++) for (i = 0; i < Y.solids.length; i++) pushOut(p, Y.solids[i]);
      p.x = Math.min(b.x1, Math.max(b.x0, p.x));
      p.z = Math.min(b.z1, Math.max(b.z0, p.z));
      // Computer: the keyboard moves the camera, so correct the camera. Headset: A-Frame freezes the camera entity and
      // js/vr.js walks the rig, so correct the rig (same walls either way).
      if (this.el.sceneEl.is("vr-mode")) { rig.x = p.x - cam.x; rig.z = p.z - cam.z; }
      else { cam.x = p.x - rig.x; cam.z = p.z - rig.z; }

      if (!this.v) { this.v = view(Y); drawMap(this.base, Y, this.v); }
      if (this.pulse && t > this.nextSpots) { this.nextSpots = t + 40; this.pulse = drawSpots(this.spots, this.v, t); }  // glow: ~25 fps, stops when all read
      var yaw = this.el.object3D.rotation.y, key = Math.round(p.x) + "," + Math.round(p.z) + "," + yaw.toFixed(2);
      if (key !== this.last) { this.last = key; drawAnt(this.ant, this.v, p, yaw); }   // redraw only on change
      if (t > this.nextTitle) { this.nextTitle = t + 250; this.updateTitle(p); }
    },
    updateTitle: function (p) {
      var placed = (window.PLACES || []).filter(function (q) { return q.placed; });
      var best = -1, bd = NEAR;
      placed.forEach(function (q, n) {
        var d = Math.hypot(q.x - p.x, q.z - p.z);
        if (d < bd) { bd = d; best = n; }
      });
      var text = "Ant's-Eye World";
      if (best >= 0) {
        var card = (window.ANT_PROBLEMS || []).filter(function (c) { return c.id === placed[best].id; })[0];
        text += " - " + (card ? card.title : placed[best].id);
      }
      if (this.titleEl.textContent !== text) this.titleEl.textContent = text;
    }
  });
})();
