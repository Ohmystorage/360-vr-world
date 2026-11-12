/* Ant's-Eye World - stage 4: glowing hotspots (pulsing ring + envelope icon) and the card pop-up.
   world.html makes one <a-entity class="hotspot" hotspot="id; tip"> per placed place (at its PLACES x, z).
   Clicking one (scene cursor="rayOrigin: mouse", raycaster objects .hotspot) opens the card from
   window.ANT_PROBLEMS. Rev 5 (teacher, Quest feedback 2026-11-11): no "Read the message" button; a card opens only
   right in front of its place (OPEN_DIST past where the ant stops at the place's solid edge): click the envelope or press Enter.
   window.ANT_READ remembers opened cards; the minimap (components.js) draws check marks.
   Quest: js/vr.js shows the same card inside the headset (right-hand line + trigger opens and closes it). It listens to the
   events "ant-card-open", "ant-card-close" and "ant-hint" sent from here and uses window.antCanOpen / antOpenCard /
   antCloseCard. */
(function () {
  var SHOW_DIST = 400;   // within this distance of a place (PLACES x, z) its ring is drawn on top of everything
  var OPEN_DIST = 50;    // a card opens only this close to where the ant stops in front of the place (~1 s walk)
  var R = 4;             // ring size unit in scene m at scale 1 (rev 2: half of the old 8)
  var A = 2.8;           // the ring's center sits A m (x scale) above `tip` (where the old arrow's tip was)
  var PINK = "#d4006e";
  window.ANT_READ = {};

  function glow(opts) { opts.fog = false; return new THREE.MeshBasicMaterial(opts); }  // unlit, no fog: bright from far

  // Rev 4: white envelope with a pink outline and flap lines (one canvas texture shared by all hotspots)
  var envTex = null;
  function envelopeTexture() {
    if (envTex) return envTex;
    var cv = document.createElement("canvas"), g = cv.getContext("2d");
    cv.width = 128; cv.height = 96;
    g.lineWidth = 8; g.lineJoin = "round"; g.lineCap = "round"; g.strokeStyle = PINK; g.fillStyle = "#ffffff";
    g.beginPath();
    if (g.roundRect) g.roundRect(6, 6, 116, 84, 10); else g.rect(6, 6, 116, 84);
    g.fill(); g.stroke();
    g.beginPath(); g.moveTo(12, 14); g.lineTo(64, 56); g.lineTo(116, 14); g.stroke();   // flap
    envTex = new THREE.CanvasTexture(cv);
    envTex.colorSpace = THREE.SRGBColorSpace;
    return envTex;
  }

  // Pulsing ring (always faces the ant) with an envelope in its center; both bob together. The ring sits on an
  // invisible hit circle (a bit bigger than the ring) so the spot is easy to click. Far away it grows (radius at
  // least ~1.5 degrees) so it can be seen across the yard.
  AFRAME.registerComponent("hotspot", {
    schema: { id: { type: "string" }, tip: { default: 30 } },
    init: function () {
      var el = this.el, id = this.data.id;
      // Within click range ring + envelope skip the depth test (drawn on top, like a game waypoint): at ant height a
      // mat edge or grass would hide them otherwise. Farther away (rev 3) objects hide them normally (see tick).
      this.badge = new THREE.Mesh(new THREE.CircleGeometry(R * 1.4, 24), new THREE.MeshBasicMaterial({ visible: false }));
      this.ring = new THREE.Mesh(new THREE.RingGeometry(R * 1.02, R * 1.28, 40), glow({ color: "#ff4fa8", transparent: true, depthTest: false, depthWrite: false }));
      // 6.4 x 4.8 m: about the old arrow's size; its corners (4.0 m from the center) stay inside the ring (4.08 m)
      this.env = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.8), glow({ map: envelopeTexture(), transparent: true, depthTest: false, depthWrite: false }));
      this.ring.renderOrder = 10;
      this.env.renderOrder = 11;
      this.badge.add(this.ring);
      this.badge.add(this.env);
      el.setObject3D("badge", this.badge);  // setObject3D (not object3D.add) so the raycaster sees them
      this.cam = new THREE.Vector3();
      el.addEventListener("click", function () { window.antOpenCard(id); });
    },
    tick: function (t) {
      var o = this.el.object3D, camera = this.el.sceneEl.camera;
      if (!camera) return;
      camera.getWorldPosition(this.cam);
      var d = Math.hypot(this.cam.x - o.position.x, this.cam.z - o.position.z), s = Math.max(1, d / 150);
      // rev 3: drawn through objects within click range (400 m); objects hide it again only past 420 m,
      // so it cannot flicker at the boundary
      var m = this.ring.material;
      if (m.depthTest ? d < SHOW_DIST : d > SHOW_DIST + 20) this.env.material.depthTest = m.depthTest = !m.depthTest;
      o.scale.setScalar(s);
      o.position.y = this.data.tip + (A + Math.sin(t / 250) * 1.5) * s;  // ring + envelope bob together
      this.badge.lookAt(this.cam);
      var ph = (t % 1500) / 1500;
      this.ring.scale.setScalar(1 + ph * 0.7);
      this.ring.material.opacity = 0.9 - 0.5 * ph;  // never fully clear: 0.9 down to 0.4
    }
  });

  // ---- Pop-up ----
  var openId = null, hintTimer = 0;
  function $(id) { return document.getElementById(id); }
  function antPos() {
    var rig = $("rig").object3D.position, cam = $("cam").object3D.position;
    return { x: rig.x + cam.x, z: rig.z + cam.z };
  }
  // The cookie and the doormat are solid, so the ant cannot reach their x, z. "Right in front" = within OPEN_DIST of
  // the place itself, or of a solid thing next to it (within 150 m of x, z) on the straight way from the ant to x, z.
  function gap(f, x, z) {  // distance from x, z to footprint f (YARD.solids: circle {r} or box {w, d, rot})
    var dx = x - f.x, dz = z - f.z;
    if (f.r) return Math.max(0, Math.hypot(dx, dz) - f.r);
    var a = (f.rot || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    var lx = dx * c - dz * s, lz = dx * s + dz * c, hx = f.w / 2, hz = f.d / 2;
    return Math.hypot(lx - Math.max(-hx, Math.min(hx, lx)), lz - Math.max(-hz, Math.min(hz, lz)));
  }
  function place(id) { return (window.PLACES || []).filter(function (q) { return q.placed && q.id === id; })[0]; }
  function canOpen(id) {  // the ant is right in front of this place
    var q = place(id), p = antPos();
    if (!q) return false;
    var d = Math.hypot(q.x - p.x, q.z - p.z);
    if (d <= OPEN_DIST) return true;
    var own = ((window.YARD && YARD.solids) || []).filter(function (f) { return gap(f, q.x, q.z) < 150; });
    for (var r = 0; r <= OPEN_DIST + 4; r += 2) {   // step toward x, z; the ant body is 3 m
      var x = p.x + (q.x - p.x) / d * r, z = p.z + (q.z - p.z) / d * r;
      if (own.some(function (f) { return gap(f, x, z) < 1; })) return true;
    }
    return false;
  }
  function nearest() {  // id of a placed place the ant is right in front of, or null
    var best = null;
    (window.PLACES || []).forEach(function (q) { if (!best && q.placed && canOpen(q.id)) best = q.id; });
    return best;
  }
  function freeze(on) {  // stop walking and looking; drop held keys and speed so nothing moves after closing
    var cam = $("cam"), w = cam.components["wasd-controls"];
    w.keys = {}; w.velocity.set(0, 0, 0);
    cam.setAttribute("wasd-controls", "enabled", !on);
    cam.setAttribute("look-controls", "enabled", !on);
  }
  function hint(text) {
    var h = $("hint");
    h.textContent = text; h.hidden = false;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () { h.hidden = true; }, 2500);
    document.dispatchEvent(new CustomEvent("ant-hint", { detail: text }));
  }

  window.antOpenCard = function (id) {
    if (openId) return;
    if (place(id) && !canOpen(id)) { hint("Walk closer to read this!"); return; }
    var card = (window.ANT_PROBLEMS || []).filter(function (c) { return c.id === id; })[0];
    if (!card) { console.warn("No card for hotspot id:", id); return; }
    $("card-title-text").textContent = card.title;
    $("card-problem").textContent = card.problem;
    $("card-why").textContent = card.whyHard;
    $("card-q").textContent = card.question;
    var words = card.words || [], list = $("card-words");
    list.textContent = "";
    words.forEach(function (w) {
      var li = document.createElement("li"), b = document.createElement("b");
      b.textContent = w.word;
      li.appendChild(b);
      li.appendChild(document.createTextNode(": " + w.meaning));
      list.appendChild(li);
    });
    $("card-words-box").hidden = !words.length;
    $("hint").hidden = true;
    $("card-back").hidden = false;
    $("card").scrollTop = 0;
    freeze(true);
    openId = id;
    $("card-close").focus();
    if (!window.ANT_READ[id]) { window.ANT_READ[id] = true; document.dispatchEvent(new Event("ant-read")); }
    document.dispatchEvent(new CustomEvent("ant-card-open", { detail: card }));
  };

  function closeCard() {
    if (!openId) return;
    $("card-back").hidden = true;
    openId = null;
    freeze(false);
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();  // keys go back to the scene
    document.dispatchEvent(new Event("ant-card-close"));
  }

  window.antCanOpen = canOpen;          // for js/vr.js
  window.antCloseCard = closeCard;

  document.addEventListener("DOMContentLoaded", function () {
    $("card-close").addEventListener("click", closeCard);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeCard();
    if (e.key !== "Enter") return;
    if (e.repeat) { e.preventDefault(); return; }  // a held Enter must not close the card it just opened
    var id = !openId && nearest();   // Enter = the envelope right in front of the ant
    if (id) { e.preventDefault(); window.antOpenCard(id); }
  });
})();
