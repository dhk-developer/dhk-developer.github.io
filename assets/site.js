/* Dae Kang portfolio: small enhancements. Every page works without this file,
   apart from the timing demo on the Memora page, which says so. */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) { /* storage blocked: the setting just won't persist */ }
    return null;
  }

  /* ---- Theme: auto (system) -> light -> dark -> auto ---- */
  var toggle = doc.querySelector("[data-theme-toggle]");
  if (toggle) {
    var order = ["auto", "light", "dark"];
    var label = function (mode) {
      toggle.textContent = "Theme: " + mode;
      toggle.setAttribute("aria-label", "Colour theme: " + (mode === "auto" ? "follows your system" : mode) + ". Change");
    };
    var current = root.getAttribute("data-theme") || "auto";
    label(current);
    toggle.addEventListener("click", function () {
      current = order[(order.indexOf(current) + 1) % order.length];
      if (current === "auto") { root.removeAttribute("data-theme"); store("theme", null); }
      else { root.setAttribute("data-theme", current); store("theme", current); }
      label(current);
    });
  }

  /* ---- Copy email ---- */
  var copy = doc.querySelector("[data-copy]");
  if (copy) {
    var status = doc.querySelector(".copy-status");
    copy.addEventListener("click", function () {
      var text = copy.getAttribute("data-copy");
      var done = function (ok) {
        status.textContent = ok ? "Copied" : "Couldn't copy. Select the address instead.";
        setTimeout(function () { status.textContent = ""; }, 3000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  }

  /* ---- Work filter ---- */
  var filter = doc.querySelector("[data-filter]");
  var list = doc.querySelector("[data-filter-list]");
  if (filter && list) {
    var buttons = Array.prototype.slice.call(filter.querySelectorAll("button[data-lens]"));
    var rows = Array.prototype.slice.call(list.querySelectorAll("[data-lenses]"));
    var live = doc.querySelector("[data-filter-status]");
    var apply = function (lens, announce) {
      var shown = 0;
      rows.forEach(function (row) {
        var match = lens === "all" || row.getAttribute("data-lenses").split(" ").indexOf(lens) !== -1;
        row.hidden = !match;
        if (match) shown += 1;
      });
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lens") === lens)); });
      if (announce && live) live.textContent = "Showing " + shown + (shown === 1 ? " project" : " projects");
    };
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var lens = b.getAttribute("data-lens");
        apply(lens, true);
        if (history.replaceState) history.replaceState(null, "", lens === "all" ? location.pathname : "#" + lens);
      });
    });
    var initial = location.hash.replace("#", "");
    if (buttons.some(function (b) { return b.getAttribute("data-lens") === initial; })) apply(initial, false);
  }

  /* ---- Video clips: click to play, one at a time, pause when off screen ---- */
  var players = [];
  Array.prototype.slice.call(doc.querySelectorAll("[data-video]")).forEach(function (frame) {
    var video = frame.querySelector("video");
    var play = frame.querySelector(".play");
    var controls = frame.parentNode.querySelector(".video-controls");
    var toggleBtn = controls && controls.querySelector("[data-video-toggle]");
    if (!video || !play) return;
    video.removeAttribute("controls");
    play.hidden = false;
    var sync = function () {
      var playing = !video.paused;
      frame.classList.toggle("is-playing", playing);
      if (toggleBtn) toggleBtn.textContent = playing ? "Pause" : "Play";
    };
    var start = function () {
      players.forEach(function (p) { if (p !== video) p.pause(); });
      if (controls) controls.hidden = false;
      var p = video.play();
      if (p && p.catch) p.catch(function () { video.setAttribute("controls", ""); play.hidden = true; if (controls) controls.hidden = true; });
    };
    play.addEventListener("click", function () { start(); if (toggleBtn) toggleBtn.focus(); });
    video.addEventListener("click", function () { if (!video.paused) video.pause(); });
    if (toggleBtn) toggleBtn.addEventListener("click", function () { if (video.paused) start(); else video.pause(); });
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    players.push(video);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting && !video.paused) video.pause();
      }, { threshold: 0.1 }).observe(frame);
    }
  });

  /* ---- "On this page": collapse on small screens, highlight the current section ---- */
  var tocDetails = doc.querySelector("[data-toc]");
  if (tocDetails) {
    if (window.matchMedia("(max-width: 63.99rem)").matches) tocDetails.open = false;
    var links = Array.prototype.slice.call(tocDetails.querySelectorAll("a[href^='#']"));
    var targets = links.map(function (a) { return doc.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
    if ("IntersectionObserver" in window && targets.length) {
      var visible = {};
      var mark = function () {
        var active = null;
        for (var i = 0; i < targets.length; i++) if (visible[targets[i].id]) { active = targets[i].id; break; }
        if (!active) return;
        links.forEach(function (a) {
          if (a.getAttribute("href") === "#" + active) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      };
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
        mark();
      }, { rootMargin: "0px 0px -70% 0px" });
      targets.forEach(function (t) { sectionObserver.observe(t); });
    }
  }

  /* ---- Timing demo (Memora page) ---- */
  var pad = doc.querySelector("[data-demo-pad]");
  if (pad) timingDemo(pad);

  function timingDemo(pad) {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ring = doc.querySelector("[data-demo-ring]");
    var flash = doc.querySelector("[data-demo-flash]");
    var result = doc.querySelector("[data-demo-result]");
    var detail = doc.querySelector("[data-demo-detail]");
    var scale = doc.querySelector("[data-demo-scale]");
    var startBtn = doc.querySelector("[data-demo-start]");
    var resetBtn = doc.querySelector("[data-demo-reset]");
    var sound = doc.querySelector("[data-demo-sound]");
    if (!AC) { result.textContent = "Your browser doesn't support the Web Audio clock this demo uses."; startBtn.disabled = true; return; }

    var BPM = 100, BEAT = 60 / BPM, PERFECT = 0.1, GREAT = 0.25, LEAD = 1.5;
    var ctx = null, running = false, t0 = 0, nextClick = 0, raf = 0, timer = 0, taps = [];

    function beatTime(n) { return t0 + n * BEAT; }
    function schedule() {
      // Schedule clicks slightly ahead on the audio clock, the same way the game schedules its song.
      while (nextClick < ctx.currentTime + 0.3) {
        if (sound.checked) {
          var osc = ctx.createOscillator(), gain = ctx.createGain();
          osc.frequency.value = 1000;
          gain.gain.setValueAtTime(0.0001, nextClick);
          gain.gain.exponentialRampToValueAtTime(0.25, nextClick + 0.002);
          gain.gain.exponentialRampToValueAtTime(0.0001, nextClick + 0.05);
          osc.connect(gain).connect(ctx.destination);
          osc.start(nextClick); osc.stop(nextClick + 0.06);
        }
        nextClick += BEAT;
      }
    }
    function draw() {
      if (!running) return;
      var now = ctx.currentTime;
      var n = Math.ceil((now - t0) / BEAT - 0.25);
      var until = beatTime(n) - now; // seconds until the next beat
      var p = Math.max(0, Math.min(1, until / BEAT));
      ring.setAttribute("r", (22 + p * 28).toFixed(2));
      ring.style.opacity = until < -0.05 ? "0" : "1";
      raf = requestAnimationFrame(draw);
    }
    function start() {
      if (!ctx) ctx = new AC();
      if (ctx.resume) ctx.resume();
      running = true;
      t0 = ctx.currentTime + LEAD;
      nextClick = t0;
      schedule();
      timer = setInterval(schedule, 50);
      result.textContent = "Get ready";
      result.className = "demo-result";
      startBtn.textContent = "Stop";
      if (!reduceMotion) draw(); else ring.setAttribute("r", "22");
      pad.focus();
    }
    function stop() {
      running = false;
      clearInterval(timer);
      cancelAnimationFrame(raf);
      ring.setAttribute("r", "50");
      startBtn.textContent = "Start";
    }
    function judge() {
      if (!running) return;
      var now = ctx.currentTime;
      // Compare against the nearest scheduled beat, as the game compares input with the nearest note.
      var n = Math.round((now - t0) / BEAT);
      if (n < 0) return;
      var offset = now - beatTime(n); // positive = late
      var ms = Math.round(offset * 1000);
      var a = Math.abs(offset);
      var verdict = a <= PERFECT ? "Perfect" : a <= GREAT ? "Great" : "Miss";
      result.textContent = verdict + ", " + (ms === 0 ? "exactly on the beat" : Math.abs(ms) + " ms " + (ms < 0 ? "early" : "late"));
      result.className = "demo-result" + (verdict === "Perfect" ? " is-perfect" : verdict === "Miss" ? " is-miss" : "");
      taps.push(ms);
      if (taps.length > 8) taps.shift();
      var mean = Math.round(taps.reduce(function (s, x) { return s + x; }, 0) / taps.length);
      detail.textContent = taps.length >= 4
        ? "Average of your last " + taps.length + " taps: " + Math.abs(mean) + " ms " + (mean < 0 ? "early" : "late") + ". In Memora, the calibration screen measures this and corrects for it."
        : "After four taps, you'll see your average offset here.";
      renderTicks();
      if (!reduceMotion) {
        flash.style.transition = "none"; flash.style.opacity = "0.35";
        requestAnimationFrame(function () { flash.style.transition = "opacity 180ms ease-out"; flash.style.opacity = "0"; });
      }
    }
    function renderTicks() {
      Array.prototype.slice.call(scale.querySelectorAll(".tick")).forEach(function (t) { t.remove(); });
      taps.forEach(function (ms, i) {
        var t = doc.createElement("span");
        t.className = "tick" + (i < taps.length - 1 ? " old" : "");
        var x = Math.max(-250, Math.min(250, ms));
        t.style.left = (50 + (x / 250) * 50) + "%";
        scale.appendChild(t);
      });
    }
    startBtn.addEventListener("click", function () { if (running) stop(); else start(); });
    resetBtn.addEventListener("click", function () {
      taps = []; renderTicks();
      result.textContent = running ? "Get ready" : "Not started"; result.className = "demo-result";
      detail.textContent = "Your last eight taps will appear on the scale below.";
    });
    pad.addEventListener("pointerdown", function (e) { e.preventDefault(); if (!running) start(); else judge(); });
    pad.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!e.repeat) { if (!running) start(); else judge(); } }
    });
    pad.addEventListener("click", function (e) { if (e.detail === 0 && !running) start(); });
    doc.addEventListener("visibilitychange", function () { if (doc.hidden && running) stop(); });
  }
})();
