/* Memora core, playable on the home page.
   The timing, scoring and pose maths are the web preview from github.com/dhk-developer/memora-showcase
   (web-preview/index.html), itself a port of the C# sample there. Only the presentation changed: the
   colours follow the game's current light "day field", and input, audio and drawing are scoped to the page. */
(function () {
  "use strict";
  var root = document.querySelector("[data-core]");
  if (!root) return;

  var CHART = {"title":"Showcase Etude","bpm":128.0,"offsetSeconds":0.0,"defaultApproachBeats":2.0,"lines":[{"id":"floor","length":13.0,"motion":[{"beat":0,"x":0,"y":-3.2,"rotationDegrees":0,"alpha":0.0,"easeToNext":3},{"beat":2,"x":0,"y":-3.2,"rotationDegrees":0,"alpha":1.0,"easeToNext":1},{"beat":15,"x":0,"y":-3.2,"rotationDegrees":0,"alpha":1.0,"easeToNext":4},{"beat":18,"x":-0.8,"y":-2.2,"rotationDegrees":-14,"alpha":1.0,"easeToNext":4},{"beat":23,"x":-0.8,"y":-2.2,"rotationDegrees":-14,"alpha":1.0,"easeToNext":4},{"beat":26,"x":0.8,"y":-2.6,"rotationDegrees":10,"alpha":1.0,"easeToNext":4},{"beat":31,"x":0.8,"y":-2.6,"rotationDegrees":10,"alpha":1.0,"easeToNext":4},{"beat":34,"x":0,"y":-3.2,"rotationDegrees":0,"alpha":1.0,"easeToNext":1},{"beat":46,"x":0,"y":-3.2,"rotationDegrees":0,"alpha":1.0,"easeToNext":0},{"beat":48,"x":0,"y":-3.2,"rotationDegrees":0,"alpha":0.0,"easeToNext":4}]},{"id":"sky","length":9.0,"motion":[{"beat":0,"x":0,"y":3.0,"rotationDegrees":180,"alpha":0.0,"easeToNext":1},{"beat":13,"x":0,"y":3.0,"rotationDegrees":180,"alpha":0.0,"easeToNext":3},{"beat":15,"x":0,"y":3.0,"rotationDegrees":180,"alpha":1.0,"easeToNext":4},{"beat":20,"x":2.0,"y":2.6,"rotationDegrees":192,"alpha":1.0,"easeToNext":4},{"beat":26,"x":-2.0,"y":2.8,"rotationDegrees":168,"alpha":1.0,"easeToNext":4},{"beat":32,"x":0,"y":3.0,"rotationDegrees":180,"alpha":1.0,"easeToNext":1},{"beat":42,"x":0,"y":3.0,"rotationDegrees":180,"alpha":1.0,"easeToNext":0},{"beat":44,"x":0,"y":3.0,"rotationDegrees":180,"alpha":0.0,"easeToNext":4}]}],"notes":[{"id":"n01","kind":0,"beat":4,"endBeat":0,"line":0,"along":-0.45,"side":1,"approach":[]},{"id":"n02","kind":0,"beat":5,"endBeat":0,"line":0,"along":0.45,"side":1,"approach":[]},{"id":"n03","kind":0,"beat":6,"endBeat":0,"line":0,"along":-0.45,"side":1,"approach":[]},{"id":"n04","kind":0,"beat":7,"endBeat":0,"line":0,"along":0.45,"side":1,"approach":[]},{"id":"n05","kind":0,"beat":8,"endBeat":0,"line":0,"along":-0.45,"side":1,"approach":[]},{"id":"n06","kind":0,"beat":9,"endBeat":0,"line":0,"along":0.45,"side":1,"approach":[]},{"id":"n07","kind":0,"beat":10,"endBeat":0,"line":0,"along":-0.45,"side":1,"approach":[]},{"id":"n08","kind":0,"beat":11,"endBeat":0,"line":0,"along":0.45,"side":1,"approach":[]},{"id":"n09","kind":1,"beat":12,"endBeat":14,"line":0,"along":0.0,"side":1,"approach":[]},{"id":"n10","kind":0,"beat":16,"endBeat":0,"line":1,"along":-0.3,"side":-1,"approach":[]},{"id":"n11","kind":0,"beat":16.5,"endBeat":0,"line":0,"along":0.5,"side":1,"approach":[]},{"id":"n12","kind":0,"beat":17,"endBeat":0,"line":1,"along":0.3,"side":-1,"approach":[]},{"id":"n13","kind":0,"beat":17.5,"endBeat":0,"line":0,"along":-0.5,"side":1,"approach":[]},{"id":"n14","kind":0,"beat":18,"endBeat":0,"line":1,"along":-0.3,"side":-1,"approach":[]},{"id":"n15","kind":0,"beat":18.5,"endBeat":0,"line":0,"along":0.5,"side":1,"approach":[]},{"id":"n16","kind":0,"beat":19,"endBeat":0,"line":1,"along":0.3,"side":-1,"approach":[]},{"id":"n17","kind":0,"beat":19.5,"endBeat":0,"line":0,"along":-0.5,"side":1,"approach":[]},{"id":"n18","kind":1,"beat":20,"endBeat":22,"line":0,"along":0.0,"side":1,"approach":[]},{"id":"n19","kind":0,"beat":21,"endBeat":0,"line":1,"along":-0.45,"side":-1,"approach":[]},{"id":"n20","kind":0,"beat":22,"endBeat":0,"line":1,"along":0.45,"side":-1,"approach":[]},{"id":"n21","kind":0,"beat":23,"endBeat":0,"line":0,"along":-0.5,"side":1,"approach":[{"beatOffset":-2.5,"progress":0,"lateralOffset":-2,"normalOffset":0,"alpha":0,"scale":0.7,"rotationDegrees":-25,"easeToNext":3},{"beatOffset":-0.6,"progress":0.86,"lateralOffset":0.35,"normalOffset":0,"alpha":1,"scale":1.05,"rotationDegrees":6,"easeToNext":4},{"beatOffset":0,"progress":1,"lateralOffset":0,"normalOffset":0,"alpha":1,"scale":1,"rotationDegrees":0,"easeToNext":0}]},{"id":"n22","kind":0,"beat":24,"endBeat":0,"line":0,"along":-0.15,"side":1,"approach":[{"beatOffset":-2.5,"progress":0,"lateralOffset":2,"normalOffset":0,"alpha":0,"scale":0.7,"rotationDegrees":25,"easeToNext":3},{"beatOffset":-0.6,"progress":0.86,"lateralOffset":-0.35,"normalOffset":0,"alpha":1,"scale":1.05,"rotationDegrees":-6,"easeToNext":4},{"beatOffset":0,"progress":1,"lateralOffset":0,"normalOffset":0,"alpha":1,"scale":1,"rotationDegrees":0,"easeToNext":0}]},{"id":"n23","kind":0,"beat":25,"endBeat":0,"line":0,"along":0.2,"side":1,"approach":[{"beatOffset":-2.5,"progress":0,"lateralOffset":-2,"normalOffset":0,"alpha":0,"scale":0.7,"rotationDegrees":-25,"easeToNext":3},{"beatOffset":-0.6,"progress":0.86,"lateralOffset":0.35,"normalOffset":0,"alpha":1,"scale":1.05,"rotationDegrees":6,"easeToNext":4},{"beatOffset":0,"progress":1,"lateralOffset":0,"normalOffset":0,"alpha":1,"scale":1,"rotationDegrees":0,"easeToNext":0}]},{"id":"n24","kind":0,"beat":26,"endBeat":0,"line":0,"along":0.5,"side":1,"approach":[{"beatOffset":-2.5,"progress":0,"lateralOffset":2,"normalOffset":0,"alpha":0,"scale":0.7,"rotationDegrees":25,"easeToNext":3},{"beatOffset":-0.6,"progress":0.86,"lateralOffset":-0.35,"normalOffset":0,"alpha":1,"scale":1.05,"rotationDegrees":-6,"easeToNext":4},{"beatOffset":0,"progress":1,"lateralOffset":0,"normalOffset":0,"alpha":1,"scale":1,"rotationDegrees":0,"easeToNext":0}]},{"id":"n25","kind":0,"beat":27,"endBeat":0,"line":0,"along":0.2,"side":1,"approach":[{"beatOffset":-2.5,"progress":0,"lateralOffset":-2,"normalOffset":0,"alpha":0,"scale":0.7,"rotationDegrees":-25,"easeToNext":3},{"beatOffset":-0.6,"progress":0.86,"lateralOffset":0.35,"normalOffset":0,"alpha":1,"scale":1.05,"rotationDegrees":6,"easeToNext":4},{"beatOffset":0,"progress":1,"lateralOffset":0,"normalOffset":0,"alpha":1,"scale":1,"rotationDegrees":0,"easeToNext":0}]},{"id":"n26","kind":0,"beat":28,"endBeat":0,"line":0,"along":-0.15,"side":1,"approach":[{"beatOffset":-2.5,"progress":0,"lateralOffset":2,"normalOffset":0,"alpha":0,"scale":0.7,"rotationDegrees":25,"easeToNext":3},{"beatOffset":-0.6,"progress":0.86,"lateralOffset":-0.35,"normalOffset":0,"alpha":1,"scale":1.05,"rotationDegrees":-6,"easeToNext":4},{"beatOffset":0,"progress":1,"lateralOffset":0,"normalOffset":0,"alpha":1,"scale":1,"rotationDegrees":0,"easeToNext":0}]},{"id":"n27","kind":1,"beat":29,"endBeat":31,"line":0,"along":0.35,"side":1,"approach":[]},{"id":"n28","kind":0,"beat":29.5,"endBeat":0,"line":1,"along":-0.4,"side":-1,"approach":[]},{"id":"n29","kind":0,"beat":30.5,"endBeat":0,"line":1,"along":0.4,"side":-1,"approach":[]},{"id":"n30","kind":0,"beat":32,"endBeat":0,"line":0,"along":-0.4,"side":1,"approach":[]},{"id":"n31","kind":0,"beat":32,"endBeat":0,"line":1,"along":0.4,"side":-1,"approach":[]},{"id":"n32","kind":0,"beat":33,"endBeat":0,"line":0,"along":0.4,"side":1,"approach":[]},{"id":"n33","kind":0,"beat":33,"endBeat":0,"line":1,"along":-0.4,"side":-1,"approach":[]},{"id":"n34","kind":0,"beat":34,"endBeat":0,"line":0,"along":-0.4,"side":1,"approach":[]},{"id":"n35","kind":0,"beat":34,"endBeat":0,"line":1,"along":0.4,"side":-1,"approach":[]},{"id":"n36","kind":0,"beat":35,"endBeat":0,"line":0,"along":0.4,"side":1,"approach":[]},{"id":"n37","kind":0,"beat":35,"endBeat":0,"line":1,"along":-0.4,"side":-1,"approach":[]},{"id":"n38","kind":0,"beat":36,"endBeat":0,"line":0,"along":-0.6,"side":1,"approach":[]},{"id":"n39","kind":0,"beat":36.5,"endBeat":0,"line":1,"along":-0.2,"side":-1,"approach":[]},{"id":"n40","kind":0,"beat":37,"endBeat":0,"line":0,"along":0.2,"side":1,"approach":[]},{"id":"n41","kind":0,"beat":37.5,"endBeat":0,"line":1,"along":0.6,"side":-1,"approach":[]},{"id":"n42","kind":0,"beat":38,"endBeat":0,"line":0,"along":0.6,"side":1,"approach":[]},{"id":"n43","kind":0,"beat":38.5,"endBeat":0,"line":1,"along":0.2,"side":-1,"approach":[]},{"id":"n44","kind":0,"beat":39,"endBeat":0,"line":0,"along":-0.2,"side":1,"approach":[]},{"id":"n45","kind":0,"beat":39.5,"endBeat":0,"line":1,"along":-0.6,"side":-1,"approach":[]},{"id":"n46","kind":1,"beat":40,"endBeat":42,"line":0,"along":-0.4,"side":1,"approach":[]},{"id":"n47","kind":1,"beat":40,"endBeat":42,"line":1,"along":0.4,"side":-1,"approach":[]},{"id":"n48","kind":0,"beat":43,"endBeat":0,"line":0,"along":0.0,"side":1,"approach":[]},{"id":"n49","kind":0,"beat":44,"endBeat":0,"line":0,"along":-0.5,"side":1,"approach":[]},{"id":"n50","kind":0,"beat":44,"endBeat":0,"line":0,"along":0.5,"side":1,"approach":[]}]};

  // ---- Timing / scoring / visuals: same maths as the C# sample ----
  var PERFECT = 0.100, GREAT = 0.250;
  var spb = function (bpm) { return 60 / bpm; };
  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  function ease(kind, t) {
    t = clamp01(t);
    switch (kind) {
      case 1: return 0;
      case 2: return t * t;
      case 3: return 1 - (1 - t) * (1 - t);
      case 4: return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) * 0.5;
      case 5: return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
      default: return t;
    }
  }
  function linePose(line, beat) {
    var k = line.motion, x, y, r, a;
    if (!k.length) { x = 0; y = 0; r = 0; a = 1; }
    else if (beat <= k[0].beat) { x = k[0].x; y = k[0].y; r = k[0].rotationDegrees; a = k[0].alpha; }
    else if (beat >= k[k.length - 1].beat) { var l = k[k.length - 1]; x = l.x; y = l.y; r = l.rotationDegrees; a = l.alpha; }
    else {
      for (var i = 0; i < k.length - 1; i++) {
        var f = k[i], to = k[i + 1];
        if (beat < f.beat || beat > to.beat) continue;
        var t = ease(f.easeToNext, (beat - f.beat) / Math.max(1e-5, to.beat - f.beat));
        x = lerp(f.x, to.x, t); y = lerp(f.y, to.y, t); r = lerp(f.rotationDegrees, to.rotationDegrees, t); a = lerp(f.alpha, to.alpha, t);
        break;
      }
    }
    var rad = r * Math.PI / 180, tx = Math.cos(rad), ty = Math.sin(rad);
    return { x: x, y: y, rot: r, alpha: a, len: line.length, tx: tx, ty: ty, nx: -ty, ny: tx,
      along: function (s) { return [x + tx * s * line.length * 0.5, y + ty * s * line.length * 0.5]; } };
  }
  function approachSample(note, current, target) {
    var off = current - target, keys = note.approach;
    var toS = function (f) { return { p: f.progress, lat: f.lateralOffset, nor: f.normalOffset, a: f.alpha, s: f.scale, r: f.rotationDegrees }; };
    if (keys && keys.length) {
      if (off <= keys[0].beatOffset) { var h = toS(keys[0]); h.a = 0; return h; }
      var last = keys[keys.length - 1];
      if (off >= last.beatOffset) return toS(last);
      for (var i = 0; i < keys.length - 1; i++) {
        var f = keys[i], to = keys[i + 1];
        if (off >= f.beatOffset && off <= to.beatOffset) {
          var t = ease(f.easeToNext, (off - f.beatOffset) / Math.max(1e-5, to.beatOffset - f.beatOffset));
          return { p: lerp(f.progress, to.progress, t), lat: lerp(f.lateralOffset, to.lateralOffset, t), nor: lerp(f.normalOffset, to.normalOffset, t),
            a: lerp(f.alpha, to.alpha, t), s: lerp(f.scale, to.scale, t), r: lerp(f.rotationDegrees, to.rotationDegrees, t) };
        }
      }
      return toS(last);
    }
    var lead = CHART.defaultApproachBeats;
    if (off < -lead) return { p: 0, lat: 0, nor: 0, a: 0, s: 1, r: 0 };
    var p = clamp01(1 + off / lead);
    return { p: p, lat: 0, nor: 0, a: clamp01(p * 3), s: 1, r: 0 };
  }
  function resolve(pose, note, sample, dist) {
    var side = note.side < 0 ? -1 : 1, a = pose.along(note.along);
    var nx = pose.nx * side, ny = pose.ny * side, rem = dist * (1 - sample.p);
    return [a[0] + nx * rem + pose.tx * sample.lat + nx * sample.nor, a[1] + ny * rem + pose.ty * sample.lat + ny * sample.nor];
  }
  var judgePos = function (n) { return linePose(CHART.lines[n.line], n.beat).along(n.along); };
  var headPos = function (n, beat, dist) { return resolve(linePose(CHART.lines[n.line], n.beat), n, approachSample(n, Math.min(beat, n.beat), n.beat), dist); };
  function tailPos(n, beat, dist) {
    var rem = Math.max(0, n.endBeat - Math.max(beat, n.beat));
    var p = 1 - rem / Math.max(0.25, CHART.defaultApproachBeats);
    return resolve(linePose(CHART.lines[n.line], n.beat), n, { p: p, lat: 0, nor: 0 }, dist);
  }

  function Score(units) { this.total = units; this.done = 0; this.combo = 0; this.best = 0; this.perfect = 0; this.great = 0; this.miss = 0; this.acc = 0; this.comboPts = 0; }
  Score.prototype.apply = function (tier) {
    if (this.done >= this.total) return;
    this.done++;
    this.acc += 900000 / this.total * (tier === "Perfect" ? 1 : tier === "Great" ? 0.7 : 0);
    if (tier === "Miss") { this.miss++; this.combo = 0; return; }
    if (tier === "Perfect") this.perfect++; else this.great++;
    this.combo++; this.best = Math.max(this.best, this.combo);
    this.comboPts += 100000 * this.combo / (this.total * (this.total + 1) / 2);
  };
  Score.prototype.value = function () { return Math.max(0, Math.min(1000000, Math.round(this.acc + this.comboPts))); };

  function Session() {
    var n = CHART.notes;
    this.state = n.map(function () { return 0; }); this.ptr = n.map(function () { return null; });
    this.order = n.map(function (_, i) { return i; }).sort(function (a, b) { return n[a].beat - n[b].beat; });
    this.first = 0;
    this.score = new Score(n.reduce(function (s, x) { return s + (x.kind === 1 ? 2 : 1); }, 0));
  }
  Session.prototype.finished = function () { return this.first >= this.order.length; };
  Session.prototype.judge = function (inputBeat, target) {
    var err = (inputBeat - target) * spb(CHART.bpm), a = Math.abs(err);
    return { tier: a <= PERFECT ? "Perfect" : a <= GREAT ? "Great" : "Miss", err: err };
  };
  Session.prototype.press = function (beat, id, canHit) {
    var g = GREAT / spb(CHART.bpm);
    for (var c = this.first; c < this.order.length; c++) {
      var i = this.order[c], n = CHART.notes[i];
      if (n.beat - beat > g) break;
      if (this.state[i] !== 0 || beat - n.beat > g) continue;
      if (canHit && !canHit(n)) continue;
      var j = this.judge(beat, n.beat);
      this.score.apply(j.tier);
      if (n.kind === 1) { this.state[i] = 1; this.ptr[i] = id; } else this.finish(i);
      return { i: i, tier: j.tier, err: j.err };
    }
    return null;
  };
  Session.prototype.release = function (beat, id, out) {
    var g = GREAT / spb(CHART.bpm);
    for (var c = this.first; c < this.order.length; c++) {
      var i = this.order[c];
      if (this.state[i] !== 1 || this.ptr[i] !== id) continue;
      this.completeHold(i, beat >= CHART.notes[i].endBeat - g ? "Perfect" : "Miss", out);
    }
  };
  Session.prototype.advance = function (beat, out) {
    var g = GREAT / spb(CHART.bpm);
    for (var c = this.first; c < this.order.length; c++) {
      var i = this.order[c], n = CHART.notes[i];
      if (n.beat > beat) break;
      if (this.state[i] === 0 && beat - n.beat > g) {
        for (var u = 0; u < (n.kind === 1 ? 2 : 1); u++) this.score.apply("Miss");
        out.push({ i: i, tier: "Miss" }); this.finish(i);
      } else if (this.state[i] === 1 && beat >= n.endBeat) this.completeHold(i, "Perfect", out);
    }
    this.advanceCursor();
  };
  Session.prototype.autoplay = function (beat, out) {
    for (var c = this.first; c < this.order.length; c++) {
      var i = this.order[c], n = CHART.notes[i];
      if (n.beat > beat) break;
      if (this.state[i] === 0) { var r = this.press(n.beat, -1000 - i, (function (m) { return function (x) { return x === m; }; })(n)); if (r) out.push(r); }
    }
    this.advance(beat, out);
  };
  Session.prototype.completeHold = function (i, tier, out) { this.score.apply(tier); out.push({ i: i, tier: tier, release: true }); this.finish(i); };
  Session.prototype.finish = function (i) { this.state[i] = 2; this.ptr[i] = null; this.advanceCursor(); };
  Session.prototype.advanceCursor = function () { while (this.first < this.order.length && this.state[this.order[this.first]] === 2) this.first++; };

  // ---- Presentation: the day field (paper, navy ink, white taps with an ink keyline, violet holds) ----
  var stage = root.querySelector(".core-stage"), canvas = root.querySelector("canvas"), ctx = canvas.getContext("2d");
  var overlay = root.querySelector(".core-overlay"), playBtn = root.querySelector("[data-core-play]");
  var restartBtn = root.querySelector("[data-core-restart]"), autoBox = root.querySelector("[data-core-auto]");
  var latency = root.querySelector("[data-core-latency]"), latencyOut = root.querySelector("[data-core-latency-out]");
  var status = root.querySelector("[data-core-status]");
  var W = 1280, H = 720, PPU = H / 10, DIST = 6, TOUCH_RADIUS = 1.1;
  var C = { ground: "#f7f4f8", ink: "#34365f", keyline: "#24264a", tap: "#ffffff", hold: "#6f4fb8", perfect: "#d9a21b", great: "#1c9cc9", tone: "rgba(52,54,95,0.07)" };
  var font = getComputedStyle(document.body).fontFamily;
  var toPx = function (x, y) { return [W / 2 + x * PPU, H / 2 - y * PPU]; };
  var lastBeat = Math.max.apply(null, CHART.notes.map(function (n) { return n.kind === 1 ? n.endBeat : n.beat; }));

  var session = new Session(), bursts = [], audio = null, startTime = 0, running = false, beat = -2, autoplay = false, latencyMs = 0, raf = 0;

  function rect(x, y, w, h, rotDeg, fill, alpha, stroke) {
    if (alpha <= 0.001) return;
    var p = toPx(x, y);
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(-rotDeg * Math.PI / 180);
    ctx.globalAlpha = Math.min(1, alpha); ctx.fillStyle = fill;
    ctx.fillRect(-w * PPU / 2, -h * PPU / 2, w * PPU, h * PPU);
    if (stroke) { ctx.lineWidth = 3; ctx.strokeStyle = stroke; ctx.strokeRect(-w * PPU / 2, -h * PPU / 2, w * PPU, h * PPU); }
    ctx.restore();
  }
  function onEvent(e) {
    if (e.tier === "Miss") return;
    var n = CHART.notes[e.i], p = judgePos(n);
    bursts.push({ x: p[0], y: p[1], start: beat, colour: e.tier === "Perfect" ? C.perfect : C.great });
  }
  function draw() {
    ctx.globalAlpha = 1; ctx.fillStyle = C.ground; ctx.fillRect(0, 0, W, H);
    // A fine screentone over the paper, as on the game's field.
    ctx.fillStyle = C.tone;
    for (var ty = 0; ty < H; ty += 8) for (var tx = (ty / 8) % 2 ? 4 : 0; tx < W; tx += 8) ctx.fillRect(tx, ty, 1.6, 1.6);
    CHART.lines.forEach(function (line) { var p = linePose(line, beat); rect(p.x, p.y, p.len, 0.05, p.rot, C.ink, p.alpha); });
    CHART.notes.forEach(function (n, i) {
      if (session.state[i] === 2) return;
      var s = approachSample(n, Math.min(beat, n.beat), n.beat);
      if (approachSample(n, beat, n.beat).a <= 0.001) return;
      var pose = linePose(CHART.lines[n.line], n.beat), hp = headPos(n, beat, DIST);
      if (n.kind === 1) {
        var tp = tailPos(n, beat, DIST), dx = tp[0] - hp[0], dy = tp[1] - hp[1], len = Math.hypot(dx, dy);
        if (len > 0.001) rect((hp[0] + tp[0]) / 2, (hp[1] + tp[1]) / 2, len, 0.5, Math.atan2(dy, dx) * 180 / Math.PI, C.hold, s.a * 0.28);
        rect(hp[0], hp[1], 1.3 * s.s, 0.18 * s.s, pose.rot + s.r, C.hold, s.a, C.keyline);
      } else {
        rect(hp[0], hp[1], 1.3 * s.s, 0.18 * s.s, pose.rot + s.r, C.tap, s.a, C.keyline);
      }
    });
    bursts = bursts.filter(function (b) {
      var t = (beat - b.start) / 0.75;
      if (t >= 1) return false;
      var e = 1 - (1 - t) * (1 - t), size = lerp(0.35, 1.4, e);
      rect(b.x, b.y, size, size, 45 + 90 * e, "#ffffff", 0.75 * (1 - t), b.colour);
      rect(b.x, b.y, size * 0.35, size * 0.35, 45 - 60 * e, b.colour, 0.9 * (1 - t));
      return true;
    });
    // The score and combo only show once a run has started; the resting frame is just the field.
    if (!running && !(session.finished() && beat > lastBeat + 2)) return;
    var m = H * 0.045, sc = session.score;
    ctx.globalAlpha = 1; ctx.fillStyle = C.ink; ctx.textBaseline = "top";
    ctx.font = "500 " + Math.round(H * 0.055) + "px " + font; ctx.textAlign = "left";
    ctx.fillText(String(sc.value()).padStart(7, "0"), m, m);
    if (sc.combo >= 3) { ctx.textAlign = "center"; ctx.fillText(String(sc.combo), W / 2, m); }
    if (autoplay && running) { ctx.textAlign = "right"; ctx.font = "500 " + Math.round(H * 0.03) + "px " + font; ctx.fillText("Autoplay", W - m, m + 6); }
    if (session.finished() && beat > lastBeat + 2) {
      ctx.textAlign = "center"; ctx.font = "500 " + Math.round(H * 0.04) + "px " + font;
      ctx.fillText("Perfect " + sc.perfect + "   Great " + sc.great + "   Miss " + sc.miss, W / 2, H * 0.42);
      ctx.fillText("Best combo " + sc.best + (sc.miss === 0 ? ", full combo" : ""), W / 2, H * 0.49);
    }
  }
  function step(b) {
    beat = b;
    var out = [];
    if (autoplay) session.autoplay(beat, out); else session.advance(beat, out);
    out.forEach(onEvent);
    draw();
  }

  // ---- Audio clock: the Web Audio clock plays the role of Unity's DSP clock ----
  var AC = window.AudioContext || window.webkitAudioContext;
  function scheduleClicks() {
    var s = spb(CHART.bpm), beats = Math.ceil(lastBeat) + 4;
    for (var b = 0; b <= beats; b++) {
      var t = startTime + CHART.offsetSeconds + b * s, accent = b % 4 === 0;
      var osc = audio.createOscillator(), gain = audio.createGain();
      osc.frequency.value = accent ? 1760 : 1320;
      gain.gain.setValueAtTime(accent ? 0.35 : 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain).connect(audio.destination);
      osc.start(t); osc.stop(t + 0.06);
    }
  }
  var currentBeat = function () { return (audio.currentTime - startTime - CHART.offsetSeconds - latencyMs / 1000) / spb(CHART.bpm); };
  function loop() {
    if (!running) { raf = 0; return; }
    step(currentBeat());
    if (beat > lastBeat + 6) { stop("Finished. Press Play to go again."); return; }
    raf = requestAnimationFrame(loop);
  }
  function start() {
    if (!AC) { status.textContent = "Your browser doesn't support the Web Audio clock this needs."; return; }
    if (audio) { try { audio.close(); } catch (e) { /* already closed */ } }
    audio = new AC();
    session = new Session(); bursts = [];
    startTime = audio.currentTime + 0.4;
    scheduleClicks();
    running = true;
    overlay.hidden = true; root.classList.add("is-playing");
    status.textContent = autoplay ? "Playing on autoplay." : "Playing. Tap the notes as they reach their line.";
    stage.focus({ preventScroll: true });
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function stop(message) {
    running = false;
    if (audio) { try { audio.close(); } catch (e) { /* already closed */ } audio = null; }
    overlay.hidden = false; root.classList.remove("is-playing");
    if (message) status.textContent = message;
  }

  // ---- Input: pointer on the playfield, keys only while it has focus ----
  function press(id, worldPos) {
    if (!running || autoplay) return;
    var b = currentBeat();
    var canHit = worldPos ? function (n) { var p = judgePos(n); return Math.hypot(p[0] - worldPos[0], p[1] - worldPos[1]) <= TOUCH_RADIUS; } : null;
    var r = session.press(b, id, canHit);
    if (r) onEvent(r);
  }
  function release(id) {
    if (!running || autoplay) return;
    var out = []; session.release(currentBeat(), id, out); out.forEach(onEvent);
  }
  function toWorld(ev) {
    var r = canvas.getBoundingClientRect();
    var px = (ev.clientX - r.left) / r.width * W, py = (ev.clientY - r.top) / r.height * H;
    return [(px - W / 2) / PPU, (H / 2 - py) / PPU];
  }
  canvas.addEventListener("pointerdown", function (ev) {
    if (!running) return;
    ev.preventDefault(); if (canvas.setPointerCapture) canvas.setPointerCapture(ev.pointerId); press(ev.pointerId, toWorld(ev));
  });
  canvas.addEventListener("pointerup", function (ev) { release(ev.pointerId); });
  canvas.addEventListener("pointercancel", function (ev) { release(ev.pointerId); });
  var KEYS = { Space: 0, KeyD: 1, KeyF: 2, KeyJ: 3, KeyK: 4 };
  stage.addEventListener("keydown", function (ev) {
    if (!running || !(ev.code in KEYS)) return;
    ev.preventDefault(); if (ev.repeat) return; press(-100 - KEYS[ev.code], null);
  });
  stage.addEventListener("keyup", function (ev) { if (ev.code in KEYS) release(-100 - KEYS[ev.code]); });

  playBtn.addEventListener("click", start);
  restartBtn.addEventListener("click", start);
  autoBox.addEventListener("change", function () { autoplay = autoBox.checked; if (running) start(); });
  latency.addEventListener("input", function () { latencyMs = +latency.value; latencyOut.textContent = latencyMs + " ms"; });

  // The metronome stops when the game leaves the screen or the tab is hidden.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { if (!entries[0].isIntersecting && running) stop("Paused when you scrolled away. Press Play to start again."); }, { threshold: 0.25 }).observe(stage);
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden && running) stop("Paused while the tab was hidden. Press Play to start again."); });

  // The resting frame before Play: the chart a few beats in, as autoplay would play it.
  function restingFrame() {
    var was = autoplay; autoplay = true; session = new Session(); bursts = [];
    for (var b = 0; b <= 9.35; b += 1 / 30) step(b);
    autoplay = was; session = new Session(); bursts = [];
  }
  root.classList.add("is-ready");
  restingFrame();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { font = getComputedStyle(document.body).fontFamily; if (!running) restingFrame(); });
})();
