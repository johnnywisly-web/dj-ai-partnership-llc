/* Holiday touch for jdaipartnership.com — active Dec 2026 season only (until Jan 7, 2027). Remove this file + its <script> tag to switch off. */
(function () {
  var now = new Date();
  if (now > new Date("2027-01-07T00:00:00-04:00")) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css = document.createElement("style");
  css.textContent =
    "#xmas-snow{position:fixed;inset:0;pointer-events:none;z-index:40}" +
    "#xmas-ribbon{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:60;display:flex;align-items:center;gap:10px;" +
    "padding:10px 14px 10px 18px;border-radius:999px;background:linear-gradient(120deg,#b3122b,#d4283f);color:#fff;font:600 14px Inter,system-ui,sans-serif;" +
    "box-shadow:0 12px 30px -10px rgba(179,18,43,.6);border:1px solid rgba(255,215,120,.55);max-width:calc(100% - 24px)}" +
    "#xmas-ribbon b{color:#ffd778}#xmas-ribbon button{background:rgba(255,255,255,.18);border:0;color:#fff;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:14px;line-height:1}" +
    ".hero::after{content:'';position:absolute;left:0;right:0;top:0;height:10px;z-index:2;pointer-events:none;" +
    "background:repeating-linear-gradient(90deg,#d4283f 0 18px,#ffd778 18px 36px,#1f9d55 36px 54px);opacity:.9}" +
    "@media(max-width:560px){#xmas-ribbon{font-size:12.5px;bottom:12px}}";
  document.head.appendChild(css);

  function start() {
    var hero = document.querySelector(".hero");
    if (hero && getComputedStyle(hero).position === "static") hero.style.position = "relative";

    if (!sessionStorage.getItem("xmasClosed")) {
      var r = document.createElement("div");
      r.id = "xmas-ribbon";
      r.innerHTML = "<span>🎄 <b>Happy Holidays</b> from DJ AI Partnership · Joyeux Noël · Jwaye Nwèl</span><button aria-label='Close'>✕</button>";
      r.querySelector("button").onclick = function () { r.remove(); sessionStorage.setItem("xmasClosed", "1"); };
      document.body.appendChild(r);
    }

    if (reduce) return;
    var c = document.createElement("canvas");
    c.id = "xmas-snow";
    document.body.appendChild(c);
    var ctx = c.getContext("2d"), W, H, flakes = [];
    function size() { W = c.width = innerWidth; H = c.height = innerHeight; }
    size(); addEventListener("resize", size);
    var n = innerWidth < 600 ? 35 : 70;
    for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.2 + 0.8, s: Math.random() * 0.6 + 0.3, d: Math.random() * 6.28 });
    (function tick() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,.85)";
      ctx.shadowColor = "rgba(120,160,220,.6)"; ctx.shadowBlur = 3;
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.s; f.d += 0.01; f.x += Math.sin(f.d) * 0.4;
        if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.28); ctx.fill();
      }
      requestAnimationFrame(tick);
    })();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
