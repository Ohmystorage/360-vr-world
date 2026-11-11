/* Ant's-Eye World - stage 4: glowing hotspots (pulsing ring + envelope icon) and the card pop-up.
   world.html makes one <a-entity class="hotspot" hotspot="id; tip"> per placed place (at its PLACES x, z).
   Clicking one (scene cursor="rayOrigin: mouse", raycaster objects .hotspot) opens the card from
   window.ANT_PROBLEMS. Rev 4: near a place, a big "Read the message" button (or Enter) opens it too.
   window.ANT_READ remembers opened cards; the minimap (components.js) draws check marks.
   Quest: js/vr.js shows the same card inside the headset (A or X opens and closes it). It listens to the events
   "ant-card-open", "ant-card-close" and "ant-hint" sent from here and uses window.antNearest / antReadNearest /
   antCloseCard. */
(function () {
  var READ_DIST = 400;   // the ant must be this close to the place (PLACES x, z) to open its card (~10 s walk)
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
      if (m.depthTest ? d < READ_DIST : d > READ_DIST + 20) this.env.material.depthTest = m.depthTest = !m.depthTest;
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
  function nearest() {  // id of the nearest placed place within READ_DIST, or null
    var p = antPos(), best = null, bd = READ_DIST;
    (window.PLACES || []).forEach(function (q) {
      var d = q.placed ? Math.hypot(q.x - p.x, q.z - p.z) : Infinity;
      if (d <= bd) { bd = d; best = q.id; }
    });
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
    var placed = (window.PLACES || []).filter(function (q) { return q.placed; });
    var place = placed.filter(function (q) { return q.id === id; })[0], p = antPos();
    if (place && Math.hypot(place.x - p.x, place.z - p.z) > READ_DIST) { hint("Walk closer to read this!"); return; }
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
    $("read-btn").hidden = true;
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

  // Rev 4: the Read button shows while the ant is within READ_DIST of a place and no card is open (checked 10x a second).
  // A system runs on every scene by itself, so no attribute is needed.
  AFRAME.registerSystem("read-button", {
    init: function () { this.next = 0; },
    tick: function (t) {
      if (t < this.next) return;
      this.next = t + 100;
      var btn = $("read-btn"), show = !openId && !!nearest();
      if (btn && btn.hidden === show) btn.hidden = !show;
    }
  });
  function readNearest() { var id = !openId && nearest(); if (id) window.antOpenCard(id); }
  window.antNearest = nearest;          // for js/vr.js
  window.antReadNearest = readNearest;
  window.antCloseCard = closeCard;

  document.addEventListener("DOMContentLoaded", function () {
    $("card-close").addEventListener("click", closeCard);
    $("read-btn").addEventListener("click", readNearest);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeCard();
    if (e.key !== "Enter") return;
    if (e.repeat) { e.preventDefault(); return; }  // a held Enter must not close the card it just opened
    if (!openId && !$("read-btn").hidden) { e.preventDefault(); readNearest(); }
  });
})();
