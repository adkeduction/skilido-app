/* Skilido One · demo build
 * Flow: every visit starts at the Skilido sign-in. After sign-in, the dashboard opens.
 * Products inside Skilido (designed demo pages): Learn (3L ecosystem), Ayati Academy, Skill Passport, LifeLab.
 * Platforms open their own landing pages directly, no role screens (checked live on 2026-11-21):
 *   FLY https://fly.skilido.com/ · FLY Bazaar https://fly.skilido.com/bazaar
 *   Spotlight https://spotlight.skilido.com/ · Icons Family Club https://club.skilido.com/
 * Demo sign-in only: credentials are checked in the browser and nothing is sent anywhere.
 */
(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.getElementById("root");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const ic = (id, cls = "ic") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

  /* ================= demo account ================= */
  const DEMO = { id: "demo@skilido.com", phone: "9848012345", pw: "Skilido@2026", name: "Neha", full: "Neha Sharma", child: "Aarav", ctx: "Aarav · Grade 5 · Accord School" };

  /* ================= products and platforms ================= */
  const PRODUCTS = {
    learn: { name: "Learn", sub: "The 3L learning ecosystem", icon: "book", c: "#0A84FF", d: "#0040A8", t: "#EAF4FF",
      tabs: [["overview", "Overview", "grid"], ["stories", "Stories", "mask"], ["leap", "LEAP", "rocket"], ["home", "Home tasks", "home"]] },
    ayati: { name: "Ayati Academy", sub: "Training and certification", icon: "cap", c: "#7C3AED", d: "#43108F", t: "#F3EDFF",
      tabs: [["overview", "Overview", "grid"], ["programs", "Courses", "award"], ["modules", "Modules", "book"], ["live", "Live", "video"], ["certificates", "Certificates", "idcard"]] },
    passport: { name: "Skill Passport", sub: "Verified growth for life", icon: "idcard", c: "#2563EB", d: "#1E3A8A", t: "#EAF1FF",
      tabs: [["overview", "Overview", "grid"], ["skills", "My skills", "chart"], ["timeline", "Evidence", "video"], ["journey", "Growth journey", "trend"], ["recs", "Recommendations", "bulb"], ["badges", "Badges", "award"]] },
    lifelab: { name: "LifeLab", sub: "Real problems, solved by children", icon: "bulb", c: "#F59E0B", d: "#A15C00", t: "#FFF6E3",
      tabs: [["challenges", "My challenges", "bulb"], ["open", "Open", "search"], ["post", "Post", "plus"]] },
  };
  const PLATFORMS = {
    fly: { name: "FLY", sub: "Venture Lab for young founders", icon: "rocket", c: "#F04E23", d: "#9A2A0C", url: "https://fly.skilido.com/" },
    bazaar: { name: "FLY Bazaar", sub: "Products made by kids", icon: "store", c: "#F59E0B", d: "#8A5200", url: "https://fly.skilido.com/bazaar" },
    spotlight: { name: "Spotlight", sub: "The national talent stage", icon: "mic", c: "#C026D3", d: "#6B0F78", url: "https://spotlight.skilido.com/" },
    club: { name: "Family Club", sub: "Icons Family Club", icon: "users", c: "#4F46E5", d: "#27238A", url: "https://club.skilido.com/" },
  };
  const P_ORDER = ["learn", "ayati", "passport", "lifelab"];
  const X_ORDER = ["fly", "bazaar", "spotlight", "club"];
  const CAT_OF = { learn: ["learning"], ayati: ["learning", "skills"], passport: ["skills"], lifelab: ["learning", "events"],
    fly: ["platforms"], bazaar: ["platforms"], spotlight: ["platforms", "events"], club: ["platforms", "events"], upcoming: ["events"] };
  const CATS = [["all", "All"], ["learning", "Learning"], ["skills", "Skills"], ["platforms", "Platforms"], ["events", "Events"]];
  const SKILLS = [["Communication", 3, 2], ["Confidence", 4, 3], ["Critical Thinking", 3, null], ["Problem-Solving", 2, null]];
  const INDEX = [
    ["The Clever Crow", "Learn · 3L story 6", "#/learn/stories"], ["The 3L method", "Learn · Listen, Understand, Become, Speak, Reflect", "#/learn/overview"],
    ["StoryBox tools", "Learn · 10 hands-on tools", "#/learn/overview"], ["Picking the best problem", "Learn · LEAP lesson", "#/learn/leap"],
    ["Rehearse together", "Learn · at home", "#/learn/home"], ["Skill Champion certification", "Ayati Academy · 3 of 5 modules", "#/ayati/overview"],
    ["3L Facilitation", "Ayati Academy · track", "#/ayati/programs"], ["Assessing with the rubric", "Ayati Academy · module 4", "#/ayati/modules"],
    ["Raising confident speakers", "Ayati Academy · live today 7 PM", "#/ayati/live"], ["Certificates", "Ayati Academy", "#/ayati/certificates"],
    ["Confidence", "Skill Passport · Level 4", "#/passport/skills"], ["Badges", "Skill Passport", "#/passport/badges"],
    ["Save Water challenge", "LifeLab · step 3 of 4", "#/lifelab/challenges"], ["Post a challenge", "LifeLab", "#/lifelab/post"],
    ["FLY", "Opens fly.skilido.com", "ext:fly"], ["FLY Bazaar", "Opens fly.skilido.com/bazaar", "ext:bazaar"],
    ["Spotlight", "Opens spotlight.skilido.com", "ext:spotlight"], ["Family Club", "Opens club.skilido.com", "ext:club"],
  ];
  const NAV = [["home", "Home", "home"], ["learn", "Learn", "book"], ["ayati", "Ayati", "cap"], ["passport", "Passport", "idcard"], ["lifelab", "LifeLab", "bulb"]];

  /* ================= session ================= */
  const KEY = "skilido.one";
  const session = {
    get() { try { return JSON.parse(localStorage.getItem(KEY) || sessionStorage.getItem(KEY)); } catch { return null; } },
    set(v, keep) { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); if (v) (keep ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(v)); } catch {} },
  };
  let S = session.get();
  let cur = { view: null };
  const done = new Set();   // home activities marked done (demo state)

  /* ================= transitions (View Transitions API, progressive) ================= */
  const canVT = () => !!document.startViewTransition && !reduce.matches && !document.hidden;
  function vt(update, dir) {
    if (!canVT()) { update(); return Promise.resolve(); }
    document.documentElement.dataset.dir = dir || "fade";
    let ran = false;
    const once = () => { if (ran) return; ran = true; update(); };
    setTimeout(once, 600);   // background tabs may not paint; never leave the screen stuck
    const t = document.startViewTransition(once);
    t.ready.catch(() => {}); t.updateCallbackDone.catch(() => {});
    return t.finished.catch(() => {}).finally(() => { delete document.documentElement.dataset.dir; });
  }
  const clearNames = () => $$("[style*='view-transition-name']").forEach((e) => (e.style.viewTransitionName = ""));

  /* ================= router ================= */
  function parse() {
    if (!S) return { view: "login" };
    const p = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (PRODUCTS[p[0]]) { const tabs = PRODUCTS[p[0]].tabs.map((t) => t[0]); return { view: "product", p: p[0], tab: tabs.includes(p[1]) ? p[1] : tabs[0] }; }
    return { view: "home" };
  }
  const go = (h) => { if (location.hash !== h) location.hash = h; else render(); };
  addEventListener("hashchange", () => render());

  function render(first = false) {
    const next = parse(), prev = cur;
    if (next.view === "login") {
      if (location.hash !== "#/login") history.replaceState(null, "", "#/login");
      const u = () => { root.innerHTML = loginHTML(); bindLogin(); document.title = "Sign in · Skilido"; cur = next; };
      first ? u() : vt(u, "fade"); return;
    }
    // tab change inside a product page
    if (prev.view === "product" && next.view === "product" && prev.p === next.p) {
      if (prev.tab === next.tab) return;
      const order = PRODUCTS[next.p].tabs.map((t) => t[0]);
      vt(() => {
        $("#pane").innerHTML = paneHTML(next.p, next.tab);
        setTabs(next.tab);
        enhance($("#pane"));
        const ln = $(".lnav"); if (ln && scrollY > ln.offsetTop) scrollTo({ top: ln.offsetTop - 0, behavior: "instant" });
        cur = next;
      }, order.indexOf(next.tab) > order.indexOf(prev.tab) ? "tab-fwd" : "tab-back");
      return;
    }
    const opening = prev.view === "home" && next.view === "product";
    const closing = prev.view === "product" && next.view === "home";
    if (opening) { const a = $(`[data-p="${next.p}"] .pc-art`); if (a) a.style.viewTransitionName = "hero"; }
    if (closing) { const a = $(".phx-art"); if (a) a.style.viewTransitionName = "hero"; }
    const update = () => {
      clearNames();
      if (!$(".shell")) { root.innerHTML = shellHTML(); bindShell(); }
      const screen = $("#screen");
      screen.innerHTML = next.view === "home" ? homeHTML() : productHTML(next.p, next.tab);
      next.view === "home" ? bindHome() : bindProduct(next.p, next.tab);
      setNav(next.view === "home" ? "home" : next.p);
      document.title = next.view === "home" ? "Skilido" : `${PRODUCTS[next.p].name} · Skilido`;
      if (opening) { const a = $(".phx-art"); if (a) a.style.viewTransitionName = "hero"; }
      if (closing) { const a = $(`[data-p="${prev.p}"] .pc-art`); if (a) { a.style.viewTransitionName = "hero"; a.closest("a").scrollIntoView({ block: "center" }); } }
      else scrollTo({ top: 0, behavior: "instant" });
      enhance(screen);
      cur = next;
      requestAnimationFrame(() => $("h1", screen)?.focus({ preventScroll: true }));
    };
    if (first) update(); else vt(update, opening ? "open" : closing ? "close" : "fade").then(clearNames);
  }

  /* ================= LOGIN ================= */
  function loginHTML() {
    const orbit = [...P_ORDER.map((k) => PRODUCTS[k]), ...X_ORDER.map((k) => PLATFORMS[k])];
    return `
    <div class="login">
      <aside class="login-art" aria-hidden="true">
        <img class="la-logo" src="assets/brand/skilido-light.webp" alt="" width="140" height="42">
        <div class="orbit">${orbit.map((x, i) => `<span class="orb" style="--c:${x.c};--i:${i}">${ic(x.icon)}</span>`).join("")}<span class="orbit-core"><img src="assets/brand/skilido-light.webp" alt="" width="120" height="36"></span></div>
        <p class="la-line">One account.<br><span>Every Skilido product.</span></p>
      </aside>
      <main class="login-main" id="screen">
        <div class="lcard">
          <img class="lc-logo" src="assets/brand/skilido-dark.webp" alt="Skilido" width="128" height="38">
          <h1 tabindex="-1">Sign in</h1>
          <p class="lc-sub">Use your Skilido account to continue.</p>
          <form id="lf" novalidate>
            <div class="fld">
              <input id="lid" name="username" autocomplete="username" placeholder=" " aria-describedby="lid-err">
              <label for="lid">Mobile number or email</label>
            </div>
            <span class="ferr" id="lid-err" role="alert"></span>
            <div class="fld fld-pw">
              <input id="lpw" name="password" type="password" autocomplete="current-password" placeholder=" " aria-describedby="lpw-err">
              <label for="lpw">Password</label>
              <button type="button" class="eye" id="eye" aria-label="Show password" aria-pressed="false">${ic("eye")}</button>
            </div>
            <span class="ferr" id="lpw-err" role="alert"></span>
            <div class="lrow">
              <label class="chk"><input type="checkbox" id="keep"><span class="box">${ic("check")}</span>Keep me signed in</label>
              <button type="button" class="tlink" data-toast="In the live product this sends a reset link. For the demo, use the demo account below.">Forgot password?</button>
            </div>
            <button class="btn btn-primary btn-block" id="go" type="submit"><span>Sign in</span></button>
          </form>
          <div class="or"><span>or</span></div>
          <button class="demo" id="demo" type="button">
            <span class="demo-av">N</span>
            <span class="demo-t"><b>Continue with the demo account</b><small>${DEMO.id} · ${DEMO.pw}</small></span>
            ${ic("chev")}
          </button>
          <p class="fine">${ic("shield")}Demo environment. Your details stay in this browser and are never sent anywhere.</p>
        </div>
      </main>
    </div>`;
  }
  function bindLogin() {
    const f = $("#lf"), id = $("#lid"), pw = $("#lpw"), btn = $("#go");
    const err = (el, box, msg) => { $(box).textContent = msg; el.closest(".fld").classList.toggle("bad", !!msg); if (msg) shake(el.closest(".fld")); };
    id.addEventListener("input", () => err(id, "#lid-err", ""));
    pw.addEventListener("input", () => err(pw, "#lpw-err", ""));
    $("#eye").addEventListener("click", (e) => {
      const show = pw.type === "password"; pw.type = show ? "text" : "password";
      e.currentTarget.setAttribute("aria-pressed", show); e.currentTarget.setAttribute("aria-label", show ? "Hide password" : "Show password");
      e.currentTarget.innerHTML = ic(show ? "eyeoff" : "eye");
    });
    const valid = () => {
      const v = id.value.trim(), digits = v.replace(/\D/g, "");
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), isPhone = /^(\+?91)?\d{10}$/.test(v.replace(/[\s-]/g, "")) && (digits.length === 10 || digits.length === 12);
      let ok = true;
      if (!v) { err(id, "#lid-err", "Enter your mobile number or email."); ok = false; }
      else if (!isEmail && !isPhone) { err(id, "#lid-err", "That doesn't look like a 10-digit mobile number or an email address."); ok = false; }
      if (!pw.value) { err(pw, "#lpw-err", "Enter your password."); ok = ok && false; ok = false; }
      if (!ok) return false;
      const isDemo = (v.toLowerCase() === DEMO.id || digits.endsWith(DEMO.phone)) && pw.value === DEMO.pw;
      if (!isDemo) { err(pw, "#lpw-err", `Those details don't match a demo account. Use ${DEMO.id} with ${DEMO.pw}.`); return false; }
      return true;
    };
    const signIn = () => {
      btn.classList.add("busy"); btn.disabled = true;
      setTimeout(() => { S = { user: DEMO.id }; session.set(S, $("#keep").checked); go("#/home"); }, reduce.matches ? 0 : 700);
    };
    f.addEventListener("submit", (e) => { e.preventDefault(); if (valid()) signIn(); });
    // demo: type the credentials in, then sign in
    $("#demo").addEventListener("click", async () => {
      $("#demo").disabled = true;
      const type = async (el, text) => { el.focus(); el.value = ""; for (const ch of text) { el.value += ch; await new Promise((r) => setTimeout(r, reduce.matches ? 0 : 22)); } };
      await type(id, DEMO.id); await type(pw, DEMO.pw);
      id.dispatchEvent(new Event("input")); pw.dispatchEvent(new Event("input"));
      signIn();
    });
  }
  function shake(el) { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }

  /* ================= SHELL ================= */
  function shellHTML() {
    const link = (cls) => NAV.map(([k, l, i]) => `<a class="${cls}" data-nav="${k}" href="#/${k === "home" ? "home" : k}">${ic(i)}<span>${k === "ayati" && cls === "gl" ? "Ayati Academy" : k === "passport" && cls === "gl" ? "Skill Passport" : l}</span></a>`).join("");
    return `
    <div class="shell">
      <header class="gbar">
        <div class="gbar-in">
          <a class="g-back" id="gback" href="#/home" aria-label="Back to home" hidden>${ic("back")}</a>
          <a class="g-logo" href="#/home" aria-label="Skilido home"><img src="assets/brand/skilido-dark.webp" alt="Skilido" width="104" height="31"></a>
          <nav class="gnav" aria-label="Main"><span class="gpill" aria-hidden="true"></span>${link("gl")}</nav>
          <div class="g-end">
            <div class="gsearch">
              <button class="ibtn" id="sbtn" aria-label="Search" aria-expanded="false" aria-controls="spop">${ic("search")}</button>
              <div class="spop" id="spop" hidden>
                <form class="sform" id="sf" role="search">${ic("search")}<input id="q" type="search" autocomplete="off" placeholder="Search stories, courses, skills or platforms" aria-label="Search Skilido"><button type="button" class="sclose" id="sclose" aria-label="Close search">${ic("x")}</button></form>
                <div class="results" id="results"><p class="res-none">Try “crow”, “certificate”, “confidence” or “FLY”.</p></div>
              </div>
            </div>
            <button class="ibtn" data-toast="3 updates: Confidence moved to Level 4, a 3L video is waiting for review, and LifeLab step 3 is done." aria-label="Notifications">${ic("bell")}<i class="dot"></i></button>
            <div class="me">
              <button class="me-btn" id="me" aria-haspopup="menu" aria-expanded="false" aria-label="Account: ${DEMO.full}"><span class="av">N</span><span class="me-n"><b>${DEMO.name}</b><small>${DEMO.child} · Grade 5</small></span>${ic("down", "ic me-c")}</button>
              <div class="me-menu" role="menu" hidden>
                <div class="me-h"><span class="av av-l">N</span><span><b>${DEMO.full}</b><small>${DEMO.id}</small></span></div>
                <p class="me-ctx">Viewing ${DEMO.ctx}</p>
                <button role="menuitem" id="signout">${ic("logout")}Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main id="screen" class="screen" tabindex="-1"></main>
      <nav class="tabbar" aria-label="Main"><span class="tpill" aria-hidden="true"></span>${link("tbl")}</nav>
    </div>`;
  }
  function bindShell() {
    const b = $("#me"), m = $(".me-menu");
    b.addEventListener("click", (e) => { e.stopPropagation(); const open = m.hidden; m.hidden = !open; b.setAttribute("aria-expanded", open); if (open) $("#signout").focus(); });
    document.addEventListener("click", (e) => { if (!e.target.closest(".me") && m) { m.hidden = true; b.setAttribute("aria-expanded", "false"); } });
    $("#signout").addEventListener("click", () => { S = null; session.set(null); toast("You're signed out."); go("#/login"); });
    // search popover, available on every page
    const sb = $("#sbtn"), sp = $("#spop"), q = $("#q"), box = $("#results");
    const open = (on) => { sp.hidden = !on; sb.setAttribute("aria-expanded", on); if (on) { q.value = ""; run(); setTimeout(() => q.focus(), 30); } };
    const run = () => {
      const v = q.value.trim().toLowerCase();
      if (!v) { box.innerHTML = `<p class="res-none">Try “crow”, “certificate”, “confidence” or “FLY”.</p>`; return; }
      const hits = INDEX.filter(([t, s]) => (t + " " + s).toLowerCase().includes(v)).slice(0, 7);
      box.innerHTML = hits.length ? hits.map(([t, s, href]) => {
        const ext = href.startsWith("ext:") ? href.slice(4) : null, k = ext || href.split("/")[1], item = ext ? PLATFORMS[ext] : PRODUCTS[k];
        return `<a class="res" href="${ext ? item.url : href}" ${ext ? `data-x="${ext}"` : ""} style="--c:${item.c}"><span class="res-ic">${ic(item.icon)}</span><span><b>${esc(t)}</b><small>${esc(s)}</small></span>${ext ? ic("ext", "ic res-x") : ""}</a>`;
      }).join("") : `<p class="res-none">No results for “${esc(q.value.trim())}”. Try “crow”, “certificate” or “water”.</p>`;
    };
    sb.addEventListener("click", (e) => { e.stopPropagation(); open(sp.hidden); });
    $("#sclose").addEventListener("click", () => open(false));
    q.addEventListener("input", run);
    q.addEventListener("keydown", (e) => { if (e.key === "Escape") open(false); });
    $("#sf").addEventListener("submit", (e) => { e.preventDefault(); $(".res", box)?.click(); });
    box.addEventListener("click", (e) => { if (e.target.closest(".res")) open(false); });
    document.addEventListener("click", (e) => { if (!e.target.closest(".gsearch")) { sp.hidden = true; sb.setAttribute("aria-expanded", "false"); } });
    addEventListener("resize", () => setNav(cur.view === "home" ? "home" : cur.p, false));
  }
  function setNav(k, anim = true) {
    const back = $("#gback"); if (back) back.hidden = k === "home";
    [[".gnav", ".gpill", ".gl"], [".tabbar", ".tpill", ".tbl"]].forEach(([w, p, c]) => {
      const wrap = $(w); if (!wrap) return;
      $$(c, wrap).forEach((a) => a.dataset.nav === k ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
      const a = $(`${c}[data-nav="${k}"]`, wrap), pill = $(p, wrap);
      if (!a || !pill || !a.offsetWidth) return;
      pill.style.transition = anim ? "" : "none";
      pill.style.width = a.offsetWidth + "px";
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
    });
  }

  /* ================= HOME (dashboard, reference 1) ================= */
  const TILE_SUB = { learn: "3L & LEAP", passport: "Verified growth", ayati: "Train & certify", lifelab: "Real-world challenges", fly: "Venture Lab", bazaar: "Kids' products", spotlight: "Talent stage", club: "Icons Family Club" };
  const EXPLORE = ["learn", "passport", "fly", "bazaar", "spotlight", "ayati", "club", "lifelab"];
  function homeHTML() {
    const left = TODOS.filter(([id]) => !done.has(id)).length;
    return `
    <div class="dash">
      <section class="hx">
        <div class="hx-copy">
          <h1 tabindex="-1">Learn. Build. ${swoosh("Grow.")}</h1>
          <p>Real-world learning for confident, future-ready kids.</p>
          <a class="btn btn-sun btn-lg" href="#/learn">Start learning ${ic("arrow")}</a>
        </div>
        <div class="hx-art"><span class="hx-pic float">${art("kits", "Skilido 3L StoryBox and LEAP Young Founders Kit")}</span><span class="hx-floor" aria-hidden="true"></span></div>
      </section>

      <section class="explore" aria-labelledby="ex-h">
        <h2 id="ex-h" class="ex-h"><i class="tick-l" aria-hidden="true"></i>Explore Skilido<i class="tick-r" aria-hidden="true"></i></h2>
        <div class="ex-grid">${EXPLORE.map((k, i) => {
          const isP = !!PRODUCTS[k], x = isP ? PRODUCTS[k] : PLATFORMS[k];
          return `<a class="ext rv" ${isP ? `data-p="${k}" href="#/${k}"` : `data-x="${k}" href="${x.url}"`} style="--c:${x.c};--i:${i}">
            <span class="pc-art">${art("ic-" + k, "", "ic3d")}</span><b>${x.name}</b><small>${TILE_SUB[k]}</small>${isP ? "" : `<span class="ex-out" aria-label="Opens its own website">${ic("ext")}</span>`}</a>`;
        }).join("")}</div>
      </section>

      <a class="nextact rv" href="#/learn/leap">
        <span class="na-pic">${art("rocket")}</span>
        <span class="na-t"><small>Your next LEAP activity</small><b>Find a problem worth solving</b><span>Continue Module 4 · Picking the best problem</span></span>
        <span class="na-p">${bar(62, "#22C55E")}<em>62%</em></span>
        <span class="btn btn-navy">Continue ${ic("arrow")}</span>
      </a>

      <section class="mysk rv" aria-labelledby="my-h">
        <div class="mysk-h"><h2 id="my-h">My Skilido</h2><p>Pick up where you left off, ${DEMO.name}!</p><span class="grade">${ic("cap")}${DEMO.child} · Grade 5</span></div>
        <div class="mysk-grid">
          ${[["book", "#0A84FF", "Continue learning", "Story 6 · The Clever Crow", "#/learn/stories"], ["checkbox", "#F26B1D", "My activities", left ? `${left} task${left > 1 ? "s" : ""} to complete` : "All done this week", "#/learn/overview"], ["chart", "#16A34A", "My progress", "See how you're growing", "#/passport"], ["cal", "#7C3AED", "My events", "What's coming up", "#/ayati/live"]]
            .map(([i, c, t, s, href], n) => `<a class="mys" href="${href}" style="--c:${c};--i:${n}"><span class="mys-ic">${ic(i)}</span><b>${t}</b><small>${s}</small></a>`).join("")}
        </div>
      </section>

      <section class="coming rv" aria-labelledby="up-h">
        <div class="sec-h"><div><h2 id="up-h">Coming up</h2><p>Live sessions and events.</p></div></div>
        <div class="ulist2">
          <a class="urow2" href="#/ayati/live" style="--c:#7C3AED">${gi("mic", "#7C3AED", "gi-sm")}<span><b>Raising confident speakers at home</b><small>Ayati Academy · live course</small></span><span class="when">Today · 7:00 PM</span></a>
          <a class="urow2" href="#/learn/overview" style="--c:#0A84FF">${gi("rocket", "#F26B1D", "gi-sm")}<span><b>LEAP class · Picking the best problem</b><small>Learn · with Ms. Priya</small></span><span class="when">Tuesday</span></a>
          <a class="urow2" href="${PLATFORMS.spotlight.url}" data-x="spotlight" style="--c:#C026D3">${gi("cal", "#C026D3", "gi-sm")}<span><b>Spotlight 2027 school registrations</b><small>Opens spotlight.skilido.com</small></span><span class="when">Open now</span></a>
        </div>
      </section>
      <p class="foot">© 2026 ADK Education Park Private Limited · <a href="https://skilido.com/privacy">Privacy</a> · <a href="https://skilido.com/terms">Terms</a> · <a href="mailto:support@skilido.com">Help</a></p>
    </div>`;
  }
  function bindHome() {
    $$(".ext, .mys, .nextact").forEach((t) => t.addEventListener("pointermove", (e) => { const r = t.getBoundingClientRect(); t.style.setProperty("--mx", `${e.clientX - r.left}px`); t.style.setProperty("--my", `${e.clientY - r.top}px`); }));
    const h = $(".hx");
    if (h && matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce.matches) {
      h.addEventListener("pointermove", (e) => { const r = h.getBoundingClientRect(); h.style.setProperty("--px", ((e.clientX - r.left) / r.width - .5).toFixed(3)); h.style.setProperty("--py", ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
      h.addEventListener("pointerleave", () => { h.style.setProperty("--px", 0); h.style.setProperty("--py", 0); });
    }
  }

  /* ================= PRODUCT PORTALS (inside Skilido) ================= */
  function productHTML(k, tab) {
    const p = PRODUCTS[k];
    return `
    <div class="prod" data-prod="${k}" style="--c:${p.c};--d:${p.d};--t:${p.t}">
      <div class="lnav">
        <div class="lnav-in">
          <a class="ln-t" href="#/${k}/${p.tabs[0][0]}"><span class="gi gi-xs">${ic(p.icon)}</span><span>${p.name}</span></a>
          <nav class="ltabs" aria-label="${p.name} sections"><span class="lpill" aria-hidden="true"></span>${p.tabs.map(([t, l, i]) => `<a class="lt" data-tab="${t}" href="#/${k}/${t}">${ic(i)}<span>${l}</span></a>`).join("")}</nav>
          <span class="ln-demo" title="Designed preview with sample data">Preview</span>
        </div>
      </div>
      <div id="pane" class="pane">${paneHTML(k, tab)}</div>
    </div>`;
  }
  function bindProduct(k, tab) { requestAnimationFrame(() => setTabs(tab, false)); }
  function setTabs(tab, anim = true) {
    const nav = $(".ltabs"); if (!nav) return;
    $$(".lt", nav).forEach((a) => a.dataset.tab === tab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    const a = $(`.lt[data-tab="${tab}"]`, nav), pill = $(".lpill", nav);
    if (!a || !pill) return;
    pill.style.transition = anim ? "" : "none";
    pill.style.width = a.offsetWidth + "px";
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
    nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: anim && !reduce.matches ? "smooth" : "auto" });
  }
  addEventListener("resize", () => cur.view === "product" && setTabs(cur.tab, false));
  const paneHTML = (k, tab) => ({ learn: learnPane, ayati: ayatiPane, passport: passportPane, lifelab: lifelabPane })[k](tab);

  /* ---------- shared building blocks ---------- */
  // glossy icon tile, the signature element of the portal design
  // artwork cut from the Skilido design references (assets/art)
  const art = (name, alt = "", cls = "") => `<img class="art ${cls}" src="assets/art/${name}.webp" alt="${alt}" decoding="async">`;
  const gi = (icon, c, size = "") => `<span class="gi ${size}"${c ? ` style="--c:${c}"` : ""}>${ic(icon)}</span>`;
  const swoosh = (word) => `<span class="sw">${word}<svg viewBox="0 0 220 22" preserveAspectRatio="none" aria-hidden="true"><path d="M4 15 C 60 4, 150 3, 216 12"/></svg></span>`;
  const ring = (pct, c, cls = "") => `<div class="ring ${cls}" style="--c:${c};--to:${pct}" role="img" aria-label="${pct} percent"><div><b data-count="${pct}">0</b><small>%</small></div></div>`;
  const bar = (pct, c) => `<span class="bar"${c ? ` style="--c:${c}"` : ""}><span style="--w:${pct}%"></span></span>`;
  const rows = (list, accent) => `<div class="card list rv">${list.map(([s, t, d, tag], i) => `<div class="row" style="--i:${i}"><span class="st st-${s}" style="--a:${accent}">${ic(s === "done" ? "check" : s === "now" ? "play" : "lock")}</span><span class="row-t"><b>${t}</b><small>${d}</small></span>${tag ? `<span class="tag tag-now">${tag}</span>` : ""}</div>`).join("")}</div>`;
  const head = (title, sub, more) => `<div class="sec-h rv"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${more || ""}</div>`;
  // big hero banner for each product's first tab
  const hero = (title, sub, art, ctas = "") => `
    <section class="phx" data-tilt>
      <div class="phx-copy"><h1 tabindex="-1">${title}</h1><p>${sub}</p>${ctas ? `<div class="ctas">${ctas}</div>` : ""}</div>
      <div class="phx-art" aria-hidden="true">${art}<i class="ray r1"></i><i class="ray r2"></i><i class="ray r3"></i></div>
    </section>`;
  // compact banner for the other tabs
  const banner = (icon, title, sub) => `<section class="pbx rv">${gi(icon, null, "gi-lg")}<div><h1 tabindex="-1">${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div></section>`;

  /* ================= LEARN ================= */
  const TODOS = [["t1", "rocket", "#F26B1D", "Picking the best problem", "LEAP lesson", "Due Fri"], ["t2", "mask", "#C026D3", "Rehearse the Crow's lines", "3L · with family", "Due Sat"], ["t3", "mic", "#0A84FF", "Neighbourhood interview", "Home task", "Due Sun"]];
  function learnPane(tab) {
    if (tab === "overview") {
      const tiles = [["book", "#0A84FF", "Learn", "Watch · read · understand", "#/learn/stories"], ["target", "#F26B1D", "Practise", "Try activities, build skills", "#/learn/leap"],
        ["checkbox", "#16A34A", "Assessment", "Show what you've learned", "#/passport/skills"], ["video", "#7C3AED", "Join class", "Live and virtual sessions", "scroll:classes"], ["home", "#E11D74", "Home tasks", "Do them together", "#/learn/home"]];
      return hero(`Learn. Practise. ${swoosh("Prove.")}`, `${DEMO.child}'s 3L and LEAP learning space.`,
        `<span class="hero-pic float">${art("learn-hero")}</span>`,
        `<a class="btn btn-sun" href="#/learn/leap">Continue LEAP ${ic("arrow")}</a><a class="tlink tlink-lg" href="#/learn/stories">Open Story 6 ${ic("chev")}</a>`) + `
      <nav class="qtiles" aria-label="Learning shortcuts">${tiles.map(([i, c, t, s, href], n) => href.startsWith("scroll:")
        ? `<button class="qt rv" data-scroll="${href.slice(7)}" style="--c:${c};--i:${n}"><span class="qi">${ic(i)}</span><b>${t}</b><small>${s}</small></button>`
        : `<a class="qt rv" href="${href}" style="--c:${c};--i:${n}"><span class="qi">${ic(i)}</span><b>${t}</b><small>${s}</small></a>`).join("")}</nav>

      <div class="duo">
        <section class="panel rv" aria-labelledby="cp-h">
          <h2 id="cp-h" class="panel-h">My current programmes</h2>
          <a class="prow" href="#/learn/leap" style="--c:#F26B1D"><span class="thumb-pic">${art("prog-rocket")}</span><span class="prow-t"><b>LEAP · Young Founders</b><small>Module 4: Find a problem worth solving</small><span class="prow-bar">${bar(62, "#22C55E")}<em>62%</em></span></span><span class="go">${ic("arrow")}</span></a>
          <a class="prow" href="#/learn/stories" style="--c:#C026D3">${gi("mask", "#C026D3", "gi-thumb")}<span class="prow-t"><b>3L Dramatics · Season 2</b><small>Story 6: The Clever Crow</small><span class="prow-bar">${bar(40, "#22C55E")}<em>40%</em></span></span><span class="go">${ic("arrow")}</span></a>
        </section>
        <section class="panel rv" aria-labelledby="td-h">
          <h2 id="td-h" class="panel-h">To do next <span class="count" id="todo-count"></span></h2>
          <ul class="todos">${TODOS.map(([id, i, c, t, s, due], n) => `<li class="todo ${done.has(id) ? "is-done" : ""}" style="--c:${c};--i:${n}">
            <button class="tick" data-todo="${id}" aria-pressed="${done.has(id)}" aria-label="Mark “${t}” done"><span class="tk-i">${ic(i)}</span>${ic("check", "ic tk-c")}</button>
            <span class="todo-t"><b>${t}</b><small>${s}</small></span><span class="due">${due}</span></li>`).join("")}</ul>
        </section>
      </div>

      <section class="panel rv" id="classes" aria-labelledby="uc-h">
        <div class="panel-row"><h2 id="uc-h" class="panel-h">Upcoming classes</h2><a class="tlink" href="#/learn/leap">See LEAP ${ic("chev")}</a></div>
        <div class="classes">
          <div class="cls" style="--c:#0A84FF;--d:#0040A8"><span class="cls-art cls-photo">${art("teacher", "Ms. Priya, LEAP teacher")}<span class="badge-live"><i></i>Next</span></span>
            <span class="cls-t"><b>LEAP class</b><span>Picking the best problem</span><small>${ic("cal")}Tuesday · with Ms. Priya</small></span>
            <button class="btn btn-acc btn-sm" data-join>${ic("play")}<span>Remind me</span></button></div>
          <div class="cls" style="--c:#C026D3;--d:#6B0F78"><span class="cls-art"><span class="badge-live"><i></i>Stage</span>${gi("mask", "#C026D3", "gi-md")}</span>
            <span class="cls-t"><b>3L performance day</b><span>The Clever Crow</span><small>${ic("cal")}Saturday · at school</small></span>
            <button class="btn btn-acc btn-sm" data-join>${ic("play")}<span>Remind me</span></button></div>
        </div>
      </section>

      <section class="stats rv">${[["16", "Original story episodes"], ["192", "Structured sessions"], ["32", "Planned performances"]].map(([n, l]) => `<div><b data-count="${n}">0</b><span>${l}</span></div>`).join("")}</section>
      <section class="sec">${head("Three Ls. One confident child.", "Each story is built to grow all three, together.")}
        <div class="bento3">${[["msg", "Language", "New words, narration and the courage to speak up in front of others.", "#0A84FF"], ["grid", "Logic", "Story order, cause and effect, and solving the problem inside every tale.", "#7C3AED"], ["heart", "Life skills", "Honesty, teamwork and empathy, learned by becoming the characters.", "#F04E23"]]
          .map(([i, t, d, c], n) => `<div class="b3 rv" style="--c:${c};--i:${n}">${gi(i, c)}<b>${t}</b><p>${d}</p></div>`).join("")}</div></section>
      <section class="sec">${head("From story, to stage, to self.", "Every 12-session cycle follows the same five steps.")}
        <ol class="steps5">${[["Listen", "to a story"], ["Understand", "words, order and reasons"], ["Become", "a character on stage"], ["Speak", "alone, as yourself"], ["Reflect", "on how you grew"]].map(([t, d], i) => `<li class="rv ${i < 2 ? "ok" : i === 2 ? "now" : ""}" style="--i:${i}"><span class="s5-n">${i < 2 ? ic("check") : i + 1}</span><b>${t}</b><span>${d}</span></li>`).join("")}</ol></section>
      <section class="sec">${head("Everything in the StoryBox.", "Ten hands-on tools for school and home.")}
        <div class="tools">${[["book", "Storybooks", "#0A84FF"], ["layers", "Story sequencing cards", "#7C3AED"], ["dice", "Story dice", "#F26B1D"], ["msg", "Words of the day", "#16A34A"], ["mic", "My speaking cards", "#C026D3"], ["users", "Finger puppets", "#E11D74"], ["mask", "Little stage mat", "#F59E0B"], ["idcard", "3L Journey Book", "#0EA5E9"], ["heart", "Family challenge cards", "#EF4444"], ["star", "Achievement stickers", "#EAB308"]]
          .map(([i, t, c], n) => `<div class="tool rv" style="--i:${n}">${gi(i, c, "gi-sm")}<b>${t}</b></div>`).join("")}</div></section>
      <section class="band rv"><div><h2>Rehearse together tonight.</h2><p>Play the Crow's lines with ${DEMO.child} for ten minutes and record his practice.</p></div><a class="btn btn-white" href="#/learn/home">See home tasks ${ic("arrow")}</a></section>`;
    }
    if (tab === "stories") return banner("mask", "Stories", "Season 2 · Language, Logic and Life skills") + `
      <div class="card feature rv">
        <button class="video" data-toast="Video playback arrives when Learn launches."><span class="vplay">${ic("play")}</span><span class="vcap">The Clever Crow · rehearsal · 2:14</span></button>
        <div class="fr-b"><span class="tag tag-now">Now</span><b>Story 6 · The Clever Crow</b><p>A thirsty crow finds a clever way to reach the water. Aarav plays the Crow and practises the narrator's lines.</p>
          <div class="fr-row"><span>${ic("cal")}Performance Saturday</span><span>${ic("clock")}12 sessions</span></div></div>
      </div>
      ${head("Season 2", "16 original episodes")}
      ${rows([["done", "1 · The Mango Tree Gang", "Performed"], ["done", "2 · The Brave Little Ant", "Performed"], ["done", "3 · Sharing the Sun", "Performed"], ["done", "4 · The Lost Kite", "Performed"], ["done", "5 · The Honest Woodcutter", "Performed · video reviewed"], ["now", "6 · The Clever Crow", "Rehearsing", "Now"], ["lock", "7 · The Lion and the Mouse", "Unlocks after Story 6"], ["lock", "8 · The Talking Drum", "Coming up"]], "#0A84FF")}`;
    if (tab === "leap") return banner("rocket", "LEAP", "Leadership, Entrepreneurship and Achievement · Grades 3 to 10") + `
      <div class="card prog rv">${ring(62, "#0A84FF")}<div><span class="tag">Module 4</span><b class="pt">Find a problem worth solving</b><small>5 of 8 lessons · next class Tuesday</small></div></div>
      ${head("The venture journey", "One real venture every year")}
      <div class="journey6 rv">${["Spot a problem", "Research customers", "Design a solution", "Build a product", "Pitch", "Sell on Sales Day"].map((t, i) => `<span class="${i < 2 ? "ok" : i === 2 ? "now" : ""}" style="--i:${i}"><i>${i < 2 ? ic("check") : i + 1}</i>${t}</span>`).join("")}</div>
      ${head("Lessons")}
      ${rows([["done", "Spotting problems around you", "Completed · quiz 4/5"], ["done", "Talking to real users", "Completed · interview uploaded"], ["now", "Picking the best problem", "In progress · due Friday", "Now"], ["lock", "Sketching your first idea", "Unlocks next week"]], "#0A84FF")}
      <a class="card xlink rv" href="${PLATFORMS.fly.url}" data-x="fly" style="--x:#F04E23">${gi("rocket", "#F04E23")}<span><b>Build the venture on FLY</b><small>Teams run their company on fly.skilido.com</small></span>${ic("ext")}</a>`;
    const acts = [["a1", "Rehearse together", "Play the Crow's lines with Aarav for 10 minutes. Record and upload his practice.", "15 min", "mask", "#C026D3"],
      ["a2", "Neighbourhood interview", "Ask Aarav: “What's one thing that annoys people in our street?” Let him interview one neighbour.", "20 min", "mic", "#0A84FF"],
      ["a3", "Words of the day", "Use today's three words at dinner: thirsty, clever, pebble.", "5 min", "msg", "#16A34A"]];
    return banner("home", "Home tasks", "Small things you can do together this week") +
      `<div class="acts">${acts.map(([id, t, d, m, i, c], n) => `<div class="act rv ${done.has(id) ? "is-done" : ""}" style="--i:${n};--c:${c}">${gi(i, c)}<div class="act-t"><b>${t}</b><p>${d}</p><small>${ic("clock")}${m}</small></div><button class="act-btn" data-act="${id}" aria-pressed="${done.has(id)}">${ic("check")}<span>${done.has(id) ? "Done" : "Mark done"}</span></button></div>`).join("")}</div>
      <p class="fine">${ic("sparkle")}Home tasks show in the Skill Passport as learning activity, never as a skill score.</p>`;
  }

  /* ================= SKILL PASSPORT ================= */
  const LEVEL_NAME = ["", "Beginning", "Emerging", "Developing", "Advancing", "Mastery"];
  const SK_STYLE = { Communication: ["msg", "#0A84FF"], Confidence: ["users", "#F26B1D"], "Critical Thinking": ["bulb", "#EAB308"], "Problem-Solving": ["grid", "#16A34A"] };
  function radar() {
    const cx = 130, cy = 120, R = 92, n = SKILLS.length;
    const pt = (i, v) => { const a = -Math.PI / 2 + i * (2 * Math.PI / n); return [cx + Math.cos(a) * R * v / 5, cy + Math.sin(a) * R * v / 5]; };
    const poly = (vals) => vals.map((v, i) => pt(i, v).map((x) => x.toFixed(1)).join(",")).join(" ");
    const grid = [1, 2, 3, 4, 5].map((l) => `<polygon class="rg" points="${poly(Array(n).fill(l))}"/>`).join("");
    const axes = SKILLS.map((_, i) => { const [x, y] = pt(i, 5); return `<line class="ra" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`; }).join("");
    const before = SKILLS.map(([, v, f]) => f || v), now = SKILLS.map(([, v]) => v);
    const labels = SKILLS.map(([name, v], i) => { const [x, y] = pt(i, 6.35); return `<text x="${x}" y="${y}" class="rl" text-anchor="middle">${name.replace("-", "‑")}</text><text x="${x}" y="${y + 15}" class="rv-l" text-anchor="middle">L${v}</text>`; }).join("");
    return `<svg class="radar" viewBox="-36 -4 332 258" role="img" aria-label="Skills radar: ${SKILLS.map(([n, v]) => `${n} level ${v}`).join(", ")}">
      ${grid}${axes}<polygon class="rp-before" points="${poly(before)}"/><polygon class="rp-now" points="${poly(now)}"/>
      ${now.map((v, i) => { const [x, y] = pt(i, v); return `<circle class="rdot" cx="${x}" cy="${y}" r="4.5" style="--i:${i}"/>`; }).join("")}${labels}</svg>`;
  }
  // growth journey: each skill before the last review vs now, plus the average
  function growth(mini) {
    const W = 320, H = mini ? 150 : 200, L = 34, Rr = W - 96, T = 14, B = H - 26;
    const y = (v) => B - (v - 1) / 4 * (B - T);
    const before = SKILLS.map(([, v, f]) => f || v), now = SKILLS.map(([, v]) => v);
    const avg = (a) => a.reduce((x, z) => x + z, 0) / a.length, a0 = avg(before), a1 = avg(now);
    const grid = [1, 2, 3, 4, 5].map((l) => `<line class="gj-g" x1="${L}" x2="${Rr}" y1="${y(l)}" y2="${y(l)}"/><text class="gj-y" x="${L - 10}" y="${y(l) + 4}" text-anchor="end">L${l}</text>`).join("");
    // label positions: start at each line's end, then push apart so no two labels overlap
    const ly = SKILLS.map((_, i) => ({ i, y: y(now[i]) + (i - 1.5) * 3 + 4 })).sort((p, q) => p.y - q.y);
    ly.forEach((l, k) => { if (k && l.y - ly[k - 1].y < 14) l.y = ly[k - 1].y + 14; });
    const labY = []; ly.forEach((l) => { labY[l.i] = l.y; });
    const lines = SKILLS.map(([n], i) => { const c = SK_STYLE[n][1]; const off = (i - 1.5) * 3;
      return `<g style="--c:${c};--i:${i}"><line class="gj-l" x1="${L + 18}" y1="${y(before[i]) + off}" x2="${Rr - 18}" y2="${y(now[i]) + off}"/><circle class="gj-d" cx="${L + 18}" cy="${y(before[i]) + off}" r="3.5"/><circle class="gj-d" cx="${Rr - 18}" cy="${y(now[i]) + off}" r="4.5"/>${mini ? "" : `<text class="gj-n" x="${Rr - 6}" y="${labY[i]}">${n.split(" ")[0].replace("-", "‑")}</text>`}</g>`; }).join("");
    const avgLine = `<line class="gj-avg" x1="${L + 18}" y1="${y(a0)}" x2="${Rr - 18}" y2="${y(a1)}"/><circle class="gj-ad" cx="${L + 18}" cy="${y(a0)}" r="5"/><circle class="gj-ad" cx="${Rr - 18}" cy="${y(a1)}" r="6"/>`;
    const labels = `<text class="gj-x" x="${L + 18}" y="${H - 6}" text-anchor="middle">Before</text><text class="gj-x" x="${Rr - 18}" y="${H - 6}" text-anchor="middle">Now</text>`;
    const tags = mini ? `<text class="gj-av" x="${Rr - 4}" y="${y(a1) + 4}">avg ${a1.toFixed(1)}</text>` : "";
    return `<svg class="gj${mini ? " gj-mini" : ""}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Average level ${a0.toFixed(1)} before the last review, ${a1.toFixed(1)} now">${grid}${lines}${avgLine}${labels}${tags}</svg>`;
  }
  const REC_LIST = [["drop", "#0EA5E9", "Save Water: build your prototype", "LifeLab · Problem-Solving", "Challenge", "#/lifelab/challenges", "Problem-Solving"], ["rocket", "#F26B1D", "Picking the best problem", "LEAP lesson · due Friday", "Lesson", "#/learn/leap", "Critical Thinking"], ["traffic", "#EF4444", "Safer school gate", "Open challenge · community", "Challenge", "#/lifelab/open", "Problem-Solving"], ["mask", "#C026D3", "Rehearse the Crow's lines", "3L · speaking practice", "Practice", "#/learn/home", "Communication"]];
  function passportPane(tab) {
    if (tab === "overview") {
      const gained = SKILLS.filter(([, v, f]) => f && v > f).length;
      const low = [...SKILLS].sort((a, b) => a[1] - b[1])[0];
      return hero(`My Skill ${swoosh("Passport")}`, "A lifelong record of skills, growth and achievements.",
        `<span class="pass-pics"><span class="pp-boy float">${art("pass-boy")}</span><span class="pp-book float f2">${art("pass-book")}</span></span>`) + `
      <section class="pp-top">
        <div class="panel who rv">
          <span class="avatar-xl avatar-pic">${art("aarav", "Aarav")}</span>
          <div><b class="who-n">Aarav Sharma</b><small>Grade 5 · Accord School, Tirupati</small><small>Skilido ID <b>SK-0425</b></small>
            <span class="life">${ic("shield")}Lifelong passport, LKG to Grade 10</span></div>
        </div>
        <div class="panel gauge-card rv">
          <h2 class="panel-h">Overall skill level</h2>
          <div class="gauge"><svg viewBox="0 0 200 116" aria-hidden="true"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#22C55E"/><stop offset="1" stop-color="#16A34A"/></linearGradient></defs><path class="g-track" d="M20 100 A80 80 0 0 1 180 100"/><path class="g-val" d="M20 100 A80 80 0 0 1 180 100" style="--v:${4 / 5}"/></svg>
            <span class="g-lbl"><b>Level <span data-count="4">0</span></b><small>${LEVEL_NAME[4]}</small></span></div>
          <div class="g-stats"><span>${gi("trend", "#16A34A", "gi-xs")}<b>+${gained} levels</b> since the last review</span><span>${gi("check", "#7C3AED", "gi-xs")}<b>${SKILLS.length} of 10</b> life skills assessed</span></div>
        </div>
      </section>
      <section class="duo">
        <div class="panel rv"><h2 class="panel-h">Skills profile</h2>${radar()}<p class="legend"><span class="lg-now">Now</span><span class="lg-before">Before last review</span></p></div>
        <div class="panel rv"><h2 class="panel-h">Progress at a glance</h2>
          <div class="glance">${SKILLS.map(([n, v, f], i) => { const [icn, c] = SK_STYLE[n]; return `<a class="gl-t" href="#/passport/skills" style="--c:${c};--i:${i}">${gi(icn, c, "gi-sm")}<b>${n}</b><span class="gl-l">L${v}${f ? `<i class="up">${ic("trend")}</i>` : ""}</span><small>${LEVEL_NAME[v]}</small></a>`; }).join("")}</div>
        </div>
      </section>
      <section class="duo duo-wide">
        <div class="panel improve rv"><h2 class="panel-h">${gi("target", "#F26B1D", "gi-xs")}Improve next</h2>
          <p class="muted">Focus here to move up a level.</p>
          <div class="imp" style="--c:${SK_STYLE[low[0]][1]}">${gi(SK_STYLE[low[0]][0], SK_STYLE[low[0]][1])}<span><b>${low[0]}</b><small>Now L${low[1]} · Next L${low[1] + 1}</small>${bar(low[1] * 20, SK_STYLE[low[0]][1])}</span></div>
        </div>
        <div class="panel rv"><div class="panel-row"><h2 class="panel-h">${ic("star", "ic star")}Recommended for Aarav</h2><button class="arrow-btn" data-slide="1" aria-label="Next recommendations">${ic("arrow")}</button></div>
          <div class="recs" id="recs">${REC_LIST
            .map(([i, c, t, s, tag, href], n) => `<a class="rec" href="${href}" style="--c:${c};--i:${n}"><span class="rec-art${n < 3 ? " rec-photo" : ""}">${n < 3 ? art("rec-" + (n + 1)) : gi(i, c, "gi-md")}</span><b>${t}</b><small>${s}</small><span class="rec-f"><span class="tag">${tag}</span><span class="go">${ic("arrow")}</span></span></a>`).join("")}</div>
        </div>
      </section>
      <section class="duo">
        <div class="panel rv"><div class="panel-row"><h2 class="panel-h">${gi("trend", "#16A34A", "gi-xs")}Growth journey</h2><a class="tlink" href="#/passport/journey">Details ${ic("chev")}</a></div>${growth(true)}
          <p class="gj-cap">Average level <b>2.5</b> before the last review, <b>3.0</b> now.</p></div>
        <div class="card how rv"><b>How levels are decided</b><p><span class="tag">Verified</span> only from rubric assessments by teachers or Skill Champions.</p><p><span class="tag tag-g">Learning activity</span> lessons and home tasks are shown but never counted as a score.</p></div>
      </section>
      <div class="btn-row rv"><button class="btn btn-ghost" data-toast="Downloads a one-page PDF when the Passport launches.">${ic("download")}Download</button><button class="btn btn-acc" data-toast="Shares a read-only link when the Passport launches.">${ic("share")}Share passport</button></div>`;
    }
    if (tab === "skills") return banner("chart", "My skills", "A five-level rubric, verified by teachers") + `
      <div class="card rv">${SKILLS.map(([n, v, from], i) => { const [icn, c] = SK_STYLE[n]; return `<div class="skill" style="--i:${i}">${gi(icn, c, "gi-sm")}<div class="sk-b"><div class="sk-h"><b>${n}</b><small>Level ${v} · ${LEVEL_NAME[v]}${from ? ` · up from L${from}` : ""}</small></div><div class="dots" style="--c:${c}">${[1, 2, 3, 4, 5].map((d) => `<i class="${d <= v ? "f" : ""}" style="--d:${d}"></i>`).join("")}</div></div></div>`; }).join("")}</div>
      <div class="rubric rv">${LEVEL_NAME.slice(1).map((t, i) => `<span style="--i:${i}"><b>${i + 1}</b>${t}</span>`).join("")}</div>`;
    if (tab === "timeline") return banner("video", "Evidence", "Every level has a source") + `
      <div class="card tl rv">${[["v", "Confidence → Level 4", "12 Nov · Ms. Priya · Rubric assessment, LEAP pitch", "Verified"], ["p", "3L Dramatics Championship entry", "5 Nov · Spotlight · School round", "Participant"], ["v", "Save Water challenge", "28 Oct · LifeLab · Problem-Solving", "Verified"], ["a", "8 activities completed", "15 Oct · Learn", "Learning activity"]]
        .map(([t, a, b, p], i) => `<div class="tl-e tl-${t}" style="--i:${i}"><b>${a}</b><small>${b}</small><span class="tag ${t === "a" ? "tag-g" : t === "p" ? "tag-p" : ""}">${p}</span></div>`).join("")}</div>`;
    if (tab === "journey") return banner("trend", "Growth journey", "How each skill moved at the last teacher review") + `
      <div class="duo">
        <div class="panel rv"><h2 class="panel-h">Before and now</h2>${growth(false)}<p class="legend"><span class="lg-avg">Average · 2.5 to 3.0</span></p></div>
        <div class="panel rv"><h2 class="panel-h">Skill by skill</h2><div class="gj-list">${SKILLS.map(([n, v, f], i) => { const [icn, c] = SK_STYLE[n]; const moved = f && v > f;
          return `<div class="gj-row" style="--c:${c};--i:${i}">${gi(icn, c, "gi-sm")}<span><b>${n}</b><small>${f ? `L${f} → L${v} · ${LEVEL_NAME[v]}` : `First assessed at L${v} · ${LEVEL_NAME[v]}`}</small></span><span class="tag ${moved ? "" : "tag-g"}">${moved ? "+1 level" : f ? "Steady" : "New"}</span></div>`; }).join("")}</div>
          <p class="fine">${ic("shield")}Only rubric assessments by teachers or Skill Champions move a level.</p></div>
      </div>`;
    if (tab === "recs") return banner("bulb", "Recommendations", "Picked from the skills with the most room to grow") + `
      <div class="recgrid">${REC_LIST.map(([i, c, t, s, tag, href, sk], n) => `<a class="rec rec-l rv" href="${href}" style="--c:${c};--i:${n}"><span class="rec-art${n < 3 ? " rec-photo" : ""}">${n < 3 ? art("rec-" + (n + 1)) : gi(i, c, "gi-md")}</span><b>${t}</b><small>${s}</small><span class="rec-why">${ic("target")}Builds ${sk}</span><span class="rec-f"><span class="tag">${tag}</span><span class="go">${ic("arrow")}</span></span></a>`).join("")}</div>`;
    return banner("award", "Badges", "Earned through verified evidence") + `
      <div class="badges">${[["mic", "Confident Speaker", "#F59E0B"], ["drop", "Water Saver", "#0EA5E9"], ["mask", "3L Performer", "#C026D3"], ["bulb", "Problem Spotter", "#16A34A"], ["rocket", "First Venture", null]]
        .map(([i, t, c], n) => `<div class="badge rv ${c ? "" : "locked"}" style="--c:${c || "#A1A1AA"};--i:${n}"><span class="medal">${ic(c ? i : "lock")}</span><b>${t}</b><small>${c ? "Earned" : "Locked"}</small></div>`).join("")}</div>`;
  }

  /* ================= AYATI ACADEMY ================= */
  let ayatiRole = "parent", resTab = "parents";
  const registered = new Set();
  const PROGRAMS = [
    ["mask", "3L Facilitation", "Run story, drama and speaking sessions for LKG to Grade 2.", 3, 4, "#C026D3", "Certificate"],
    ["rocket", "LEAP Facilitation", "Coach venture teams through pitches and Sales Day.", 2, 5, "#F04E23", "Certificate"],
    ["chart", "Assessment & Skill Passport", "Use the five-level rubric and the evidence workflow.", 1, 3, "#16A34A", "Certificate"],
    ["heart", "Parenting courses", "Confidence, screen time, money skills and exams.", 1, 6, "#0A84FF", "Live + self-paced"],
  ];
  const progCard = ([i, t, d, dn, n, c, tag], k) => `<a class="prc rv" href="#/ayati/modules" style="--c:${c};--i:${k}">${gi(i, c)}<span class="tag">${tag}</span><b>${t}</b><p>${d}</p>${bar(Math.round(dn / n * 100), c)}<small>${dn} of ${n} modules</small></a>`;
  const VIDART = { "How to talk about failure": "vid-3", "Supporting your child on stage": "vid-1", "Money conversations with kids": "vid-2", "Growth mindset for parents": "vid-4",
    "The Skilido way": "vid-4", "Running a 3L session": "vid-1", "Coaching a LEAP team": "vid-2", "Assessing with the rubric": "vid-3" };
  const COURSEART = { "3L Facilitation": "course-2", "LEAP Facilitation": "course-1", "Parenting courses": "course-1" };
  function ayatiRoleBlock() {
    const t = ayatiRole === "teacher";
    const vids = t
      ? [["book", "#7C3AED", "The Skilido way", "Module 1", "18 min"], ["mask", "#C026D3", "Running a 3L session", "Module 2", "25 min"], ["rocket", "#F26B1D", "Coaching a LEAP team", "Module 3", "30 min"], ["chart", "#16A34A", "Assessing with the rubric", "Module 4", "25 min"]]
      : [["mic", "#F59E0B", "How to talk about failure", "4 short videos", "20 min"], ["mask", "#C026D3", "Supporting your child on stage", "Linked to 3L", "3 lessons"], ["store", "#16A34A", "Money conversations with kids", "Linked to LEAP", "5 lessons"], ["bulb", "#7C3AED", "Growth mindset for parents", "Self-paced", "6 modules"]];
    const courses = t ? PROGRAMS.slice(0, 3) : PROGRAMS.slice(3).concat([["award", "Screen-smart family", "Earned October 2026", 1, 1, "#F59E0B", "Earned"]]);
    const live = t ? ["Thursday · 4:30 PM", "Running a 3L performance day", "Monthly refresher for Skill Champions"] : ["Today · 7:00 PM", "Raising confident speakers at home", "Live parent course · 45 min"];
    const lid = t ? "lv-t" : "lv-p";
    return `
      <section class="sec-s">${head(`${gi("play", "#7C3AED", "gi-xs")}Learn and watch`, t ? "Core modules for Skill Champions." : "Short, practical videos for home.", `<a class="tlink" href="#/ayati/${t ? "modules" : "live"}">View all ${ic("chev")}</a>`)}
        <div class="vids">${vids.map(([i, c, title, meta, dur], n) => `<button class="vid rv" style="--c:${c};--i:${n}" data-toast="Videos play inside Ayati Academy when it launches."><span class="vid-art${VIDART[title] ? " vid-photo" : ""}">${VIDART[title] ? art(VIDART[title]) : gi(i, c, "gi-md")}<span class="vid-play">${ic("play")}</span><span class="dur">${dur}</span></span><b>${title}</b><small>${meta}</small></button>`).join("")}</div>
      </section>
      <section class="duo">
        <div class="panel rv"><h2 class="panel-h">${gi("award", "#7C3AED", "gi-xs")}${t ? "Certification courses" : "Courses for you"}</h2><p class="muted">${t ? "Get certified. Build your expertise." : "Learn at your own pace."}</p>
          <div class="clist">${courses.map(([i, title, d, dn, n, c, tag]) => `<a class="crow" href="#/ayati/${tag === "Earned" ? "certificates" : "programs"}" style="--c:${c}">${COURSEART[title] ? `<span class="thumb-pic">${art(COURSEART[title])}</span>` : gi(i, c, "gi-thumb")}<span><b>${title}</b><small>${ic(tag === "Earned" ? "award" : "book")}${tag === "Earned" ? d : `${n} modules · ${tag}`}</small></span><span class="go">${ic("arrow")}</span></a>`).join("")}</div>
        </div>
        <div class="panel rv"><h2 class="panel-h">${gi("folder", "#7C3AED", "gi-xs")}Resources</h2><p class="muted">Ready-to-use materials for classroom and home.</p>
          <div class="seg2" role="tablist"><span class="seg2-pill" aria-hidden="true"></span>${[["teachers", "For teachers"], ["parents", "For parents"]].map(([k, l]) => `<button role="tab" data-res="${k}" aria-selected="${resTab === k}">${l}</button>`).join("")}</div>
          <div class="res-grid" id="res-grid">${resTiles()}</div>
        </div>
      </section>
      <section class="panel rv">${head(`${gi("cal", "#7C3AED", "gi-xs")}Virtual expert sessions`, "Live sessions with education and parenting experts.", `<a class="tlink" href="#/ayati/live">All sessions ${ic("chev")}</a>`)}
        <div class="xsess"><span class="xs-art xs-photo">${art("expert", "Session expert")}</span>
          <span class="xs-t"><span class="badge-live"><i></i>Live</span><b>${live[1]}</b><small>${live[2]}</small><small>${ic("cal")}${live[0]}</small></span>
          <button class="btn btn-acc" data-register="${lid}" aria-pressed="${registered.has(lid)}">${registered.has(lid) ? `${ic("check")}Registered` : `Register now ${ic("arrow")}`}</button></div>
      </section>`;
  }
  function resTiles() {
    const r = resTab === "teachers"
      ? [["file", "#0A84FF", "Lesson plans"], ["image", "#F26B1D", "Activity sheets"], ["checkbox", "#16A34A", "Worksheets"], ["box", "#7C3AED", "Project kits"]]
      : [["home", "#E11D74", "Home activity guides"], ["heart", "#EF4444", "Family challenges"], ["msg", "#16A34A", "Words of the day"], ["mic", "#0A84FF", "Speaking cards"]];
    return r.map(([i, c, t], n) => `<button class="rtile" style="--c:${c};--i:${n}" data-toast="The resource library opens when Ayati Academy launches.">${gi(i, c, "gi-sm")}<b>${t}</b></button>`).join("");
  }
  function ayatiPane(tab) {
    const live = (when, t, d, btn, id) => `<div class="card live rv"><span class="badge-live"><i></i>${when}</span><b>${t}</b><small>${d}</small><button class="btn btn-white btn-sm" data-register="${id}" aria-pressed="${registered.has(id)}">${registered.has(id) ? `${ic("check")}Registered` : btn}</button></div>`;
    if (tab === "overview") return hero(`<span class="brandblk"><span class="bb-l">${gi("cap", "#7C3AED", "gi-bb")}<span><span class="bb-n">Ayati Academy</span><span class="bb-t">Learn · Train · Empower</span></span></span><span class="bb-d" aria-hidden="true"></span><span class="bb-r">For educators ${swoosh("&amp; parents")}</span></span>`, "Practical learning, expert guidance and certification for better child development.",
        `<span class="hero-pic float">${art("ayati-family")}</span>`,
        `<a class="btn btn-sun" href="#/ayati/modules">Continue Module 4 ${ic("arrow")}</a><a class="tlink tlink-lg" href="#/ayati/programs">All courses ${ic("chev")}</a>`) + `
      <section class="iam rv" aria-label="I am a">
        <span class="iam-l">I am a</span>
        <div class="iam-sw" role="radiogroup">
          <span class="iam-pill" aria-hidden="true"></span>
          <button role="radio" data-role="teacher" aria-checked="${ayatiRole === "teacher"}">${ic("user")}<span><b>Teacher</b><small>Teach better, access classroom resources</small></span></button>
          <button role="radio" data-role="parent" aria-checked="${ayatiRole === "parent"}">${ic("users")}<span><b>Parent</b><small>Support your child's growth at home</small></span></button>
        </div>
      </section>
      <div id="role-block">${ayatiRoleBlock()}</div>
      <a class="card xlink rv" href="${PLATFORMS.club.url}" data-x="club" style="--x:#4F46E5">${gi("users", "#4F46E5")}<span><b>Ayati modules are live in Icons Family Club</b><small>Teachers take today's modules in the Club's teacher space.</small></span>${ic("ext")}</a>`;
    if (tab === "programs") return banner("award", "Courses", "Certification tracks for educators and courses for parents") + `<div class="prgrid">${PROGRAMS.map(progCard).join("")}</div>`;
    if (tab === "modules") return banner("book", "Modules", "Skill Champion core curriculum") + `
      <div class="card nextmod rv">
        <span class="tag">Up next</span><b class="pt">Module 4 · Assessing with the rubric</b>
        <p>Learn the five-level rubric, practise with sample evidence, and score a real pitch.</p>
        <ol class="lessons">${[["done", "The five levels, explained", "6 min"], ["now", "Scoring sample evidence", "9 min"], ["lock", "Practice: score a LEAP pitch", "10 min"]].map(([s, t, m]) => `<li class="${s}">${ic(s === "done" ? "check" : s === "now" ? "play" : "lock")}<span>${t}</span><small>${m}</small></li>`).join("")}</ol>
        <button class="btn btn-acc btn-block" data-toast="Lessons play inside Ayati Academy when it launches. Today the modules are in the Club's teacher space.">${ic("play")}Resume lesson 2</button>
      </div>
      ${head("All modules")}
      ${rows([["done", "1 · The Skilido way", "Video · 18 min"], ["done", "2 · Running a 3L session", "Video + PDF · 25 min"], ["done", "3 · Coaching a LEAP team", "Video + PDF · 30 min"], ["now", "4 · Assessing with the rubric", "Video + practice · 25 min", "Now"], ["lock", "5 · Evidence and the Skill Passport", "Unlocks after Module 4"]], "#7C3AED")}`;
    if (tab === "live") return banner("video", "Live", "Live courses and monthly refreshers") +
      `<div class="duo duo-tight">${live("Today · 7:00 PM", "Raising confident speakers at home", "Parent course · 45 min · 128 parents joined", "Remind me and join", "lv-p")}${live("Thursday · 4:30 PM", "Running a 3L performance day", "Skill Champion refresher · 45 min", "Remind me", "lv-t")}</div>` +
      head("Recordings") + rows([["done", "Coaching shy speakers", "Recorded · 40 min"], ["done", "Screen-smart families", "Recorded · 35 min"], ["done", "Sales Day without stress", "Recorded · 38 min"]], "#7C3AED");
    return banner("idcard", "Certificates", "Earned and in progress") + `
      <div class="certificate rv">
        <div class="ce-in">
          <img src="assets/brand/skilido-dark.webp" alt="Skilido" width="96" height="29">
          <small>Ayati Academy · Certificate of completion</small>
          <b class="ce-name">${DEMO.full}</b><p>has completed the parent course</p><b class="ce-course">Screen-smart family</b>
          <div class="ce-foot"><span>October 2026</span><span class="ce-seal">${ic("award")}</span><span>No. AY-2026-0418</span></div>
        </div>
      </div>
      <div class="btn-row rv"><button class="btn btn-ghost" data-toast="Downloads a PDF when certificates launch.">${ic("download")}Download</button><button class="btn btn-acc" data-toast="Shares a verification link when certificates launch.">${ic("share")}Share</button></div>
      ${head("In progress")}
      <div class="card course rv">${gi("award", "#7C3AED", "gi-thumb")}<span class="row-t"><b>Skill Champion · 3L and LEAP</b><small>3 of 5 modules</small>${bar(60)}</span></div>
      <div class="card course rv">${gi("bulb", "#0A84FF", "gi-thumb")}<span class="row-t"><b>Growth mindset for parents</b><small>Module 3 of 6</small>${bar(50, "#0A84FF")}</span></div>`;
  }

  /* ================= LIFELAB ================= */
  function lifelabPane(tab) {
    if (tab === "challenges") return hero(`Real problems. ${swoosh("Real impact.")}`, `${DEMO.child}'s challenges from school, family and community.`,
        `<span class="art-main">${gi("bulb", "#F59E0B", "gi-hero")}</span>
         <span class="spark s1">${ic("sparkle")}</span><span class="spark s2">${ic("star")}</span>`) + `
      <div class="cgrid">
        <div class="chal rv" style="--a:#0EA5E9;--b:#2563EB"><div class="ban">${gi("drop", "#0EA5E9", "gi-md")}<span class="tag tag-w">In progress</span></div>
          <div class="chal-b"><b class="pt">Help our school save water</b><small>Accord School · Grades 5–9 · team of 4</small>
          <div class="seg4">${[1, 2, 3, 4].map((n) => `<i class="${n <= 3 ? "f" : ""}" style="--d:${n}"></i>`).join("")}</div>
          <small>Understand · Ideate · <b>Build</b> · Present</small>
          <p class="idea">Aarav's idea: “Drip-tray bottles under every tap to reuse water for the garden.”</p></div></div>
        <div class="chal rv" style="--a:#22C55E;--b:#15803D"><div class="ban">${gi("leaf", "#16A34A", "gi-md")}<span class="tag tag-w">Completed</span></div>
          <div class="chal-b"><b class="pt">Zero-waste lunchbox week</b><small>Family challenge · verified by a Skill Champion</small></div></div>
      </div>`;
    if (tab === "open") return banner("search", "Open challenges", "Matched to grade and interests") + `<div class="cgrid">${[["traffic", "Safer school gate at pickup time", "Tirupati Ward 12 · Grades 6–9 · 2 weeks", "Community", "#F97316", "#DC2626"], ["library", "Get more kids into the library", "Accord School · Grades 3–6 · 3 weeks", "School", "#A855F7", "#6D28D9"]]
      .map(([i, t, s, tag, a, b]) => `<div class="chal rv" style="--a:${a};--b:${b}"><div class="ban">${gi(i, a, "gi-md")}<span class="tag tag-w">${tag}</span></div><div class="chal-b"><b class="pt">${t}</b><small>${s}</small><button class="btn btn-acc btn-sm" data-toast="Aarav accepts in the student app, then joins a team.">Suggest to Aarav</button></div></div>`).join("")}</div>`;
    return banner("plus", "Post a challenge", "Children solve real problems and earn verified evidence.") + `
      <form class="card pform rv" id="pform" novalidate>
        <div class="fld fld-light"><input id="pt" placeholder=" "><label for="pt">Challenge title</label></div>
        <span class="ferr" id="pt-err" role="alert"></span>
        <div class="fld fld-light fld-ta"><textarea id="pd" rows="3" placeholder=" "></textarea><label for="pd">What's the problem?</label></div>
        <p class="flab">Who should solve it?</p>
        <div class="opts">${["Grades 3–5", "Grades 6–8", "Grades 9–10"].map((g, i) => `<button type="button" class="opt" aria-pressed="${i === 0}">${g}</button>`).join("")}</div>
        <button class="btn btn-acc btn-block" type="submit">${ic("plus")}Send for review</button>
        <p class="fine">${ic("shield")}The Skilido team reviews every challenge before it goes live.</p>
      </form>`;
  }

  /* ---------- portal interactions ---------- */
  function enhancePortal(scope) {
    // to-do ticks
    const countTodos = () => { const c = $("#todo-count", scope); if (c) { const left = TODOS.filter(([id]) => !done.has(id)).length; c.textContent = left ? `${left} left` : "All done"; c.classList.toggle("all", !left); } };
    countTodos();
    $$("[data-todo]", scope).forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.todo, on = !done.has(id);
      on ? done.add(id) : done.delete(id);
      b.setAttribute("aria-pressed", on); b.closest(".todo").classList.toggle("is-done", on);
      countTodos();
      if (on) toast(TODOS.every(([x]) => done.has(x)) ? "Everything's done for this week. Great work!" : "Marked done.");
    }));
    // scroll shortcut (Join class)
    $$("[data-scroll]", scope).forEach((b) => b.addEventListener("click", () => {
      const t = document.getElementById(b.dataset.scroll); if (!t) return;
      t.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
      t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash");
    }));
    // class reminders
    $$("[data-join]", scope).forEach((b) => b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on); b.innerHTML = on ? `${ic("check")}<span>Reminder set</span>` : `${ic("play")}<span>Remind me</span>`;
      if (on) toast("Reminder set. Skilido will notify you before class.");
    }));
    // session registration
    $$("[data-register]", scope).forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.register, on = !registered.has(id);
      on ? registered.add(id) : registered.delete(id);
      b.setAttribute("aria-pressed", on);
      b.innerHTML = on ? `${ic("check")}Registered` : (b.classList.contains("btn-white") ? "Remind me" : `Register now ${ic("arrow")}`);
      if (on) toast("You're registered. The join link opens inside Skilido at start time.");
    }));
    // Ayati "I am a" switch
    const sw = $(".iam-sw", scope);
    if (sw) {
      const pill = $(".iam-pill", sw), btns = $$("button", sw);
      const place = (anim) => { const b = btns.find((x) => x.dataset.role === ayatiRole); pill.style.transition = anim ? "" : "none"; pill.style.width = b.offsetWidth + "px"; pill.style.height = b.offsetHeight + "px"; pill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`; };
      requestAnimationFrame(() => place(false));
      btns.forEach((b) => b.addEventListener("click", () => {
        if (b.dataset.role === ayatiRole) return;
        ayatiRole = b.dataset.role; resTab = ayatiRole === "teacher" ? "teachers" : "parents";
        btns.forEach((x) => x.setAttribute("aria-checked", x === b)); place(true);
        vt(() => { $("#role-block").innerHTML = ayatiRoleBlock(); enhance($("#role-block")); }, "swap");
      }));
      addEventListener("resize", () => document.body.contains(sw) && place(false));
    }
    // resources toggle
    const seg = $(".seg2", scope);
    if (seg) {
      const pill = $(".seg2-pill", seg), btns = $$("button", seg);
      const place = (anim) => { const b = btns.find((x) => x.dataset.res === resTab); pill.style.transition = anim ? "" : "none"; pill.style.width = b.offsetWidth + "px"; pill.style.transform = `translateX(${b.offsetLeft - 4}px)`; };
      requestAnimationFrame(() => place(false));
      btns.forEach((b) => b.addEventListener("click", () => {
        resTab = b.dataset.res; btns.forEach((x) => x.setAttribute("aria-selected", x === b)); place(true);
        const g = $("#res-grid", scope); g.classList.add("swap"); setTimeout(() => { g.innerHTML = resTiles(); g.classList.remove("swap"); }, reduce.matches ? 0 : 140);
      }));
    }
    // recommendations slider
    $$("[data-slide]", scope).forEach((b) => b.addEventListener("click", () => {
      const r = $("#recs", scope); const step = r.firstElementChild.offsetWidth + 12;
      r.scrollBy({ left: r.scrollLeft + r.clientWidth >= r.scrollWidth - 4 ? -r.scrollWidth : step, behavior: reduce.matches ? "auto" : "smooth" });
    }));
    // hero parallax (pointer devices only)
    const h = $("[data-tilt]", scope);
    if (h && matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce.matches) {
      h.addEventListener("pointermove", (e) => { const r = h.getBoundingClientRect(); h.style.setProperty("--px", ((e.clientX - r.left) / r.width - .5).toFixed(3)); h.style.setProperty("--py", ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
      h.addEventListener("pointerleave", () => { h.style.setProperty("--px", 0); h.style.setProperty("--py", 0); });
    }
    // light that follows the pointer across cards
    $$(".qt, .prow, .rec, .vid, .rtile, .prc, .gl-t, .crow, .tool", scope).forEach((t) => t.addEventListener("pointermove", (e) => { const r = t.getBoundingClientRect(); t.style.setProperty("--mx", `${e.clientX - r.left}px`); t.style.setProperty("--my", `${e.clientY - r.top}px`); }));
  }

  /* ================= enhancers ================= */
  let io = null;
  let floatIO = null;
  function enhance(scope) {
    // reveal on scroll
    // pause ambient loops while they are off screen
    if ("IntersectionObserver" in window) {
      if (!floatIO) floatIO = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("paused", !e.isIntersecting)));
      $$(".float", scope).forEach((el) => floatIO.observe(el));
    }
    if ("IntersectionObserver" in window && !reduce.matches) {
      if (!io) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
      $$(".rv:not(.in)", scope).forEach((el) => io.observe(el));
      setTimeout(() => $$(".rv:not(.in)", scope).forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add("in"); }), 1200);
    } else $$(".rv", scope).forEach((el) => el.classList.add("in"));
    // count up
    $$("[data-count]", scope).forEach((el) => {
      const to = +el.dataset.count;
      if (reduce.matches) { el.textContent = to; return; }
      const t0 = performance.now(), dur = 1000;
      const tick = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    // toggles
    $$("[data-act]", scope).forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.act, on = !done.has(id);
      on ? done.add(id) : done.delete(id);
      b.setAttribute("aria-pressed", on); $("span", b).textContent = on ? "Done" : "Mark done";
      b.closest(".act").classList.toggle("is-done", on);
      if (on) toast("Nice. It's added to Aarav's learning activity.");
    }));
    $$(".opt", scope).forEach((o) => o.addEventListener("click", () => $$(".opt", o.parentElement).forEach((x) => x.setAttribute("aria-pressed", x === o))));
    enhancePortal(scope);
    const pf = $("#pform", scope);
    if (pf) pf.addEventListener("submit", (e) => {
      e.preventDefault();
      const t = $("#pt", pf);
      if (!t.value.trim()) { $("#pt-err").textContent = "Give the challenge a title."; t.closest(".fld").classList.add("bad"); shake(t.closest(".fld")); t.focus(); return; }
      $("#pt-err").textContent = ""; t.closest(".fld").classList.remove("bad");
      toast("Sent for review. In the live product the Skilido team checks it before it goes live."); pf.reset();
    });
  }

  /* ================= platforms: straight to their landing pages ================= */
  const wash = $("#wash");
  document.addEventListener("click", (e) => {
    const tb = e.target.closest("[data-toast]");
    if (tb) { toast(tb.dataset.toast); return; }
    const a = e.target.closest("a[data-x]");
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const x = PLATFORMS[a.dataset.x];
    e.preventDefault();
    if (window.top !== window) { window.open(x.url, "_blank", "noopener"); return; }   // inside the review showcase
    if (reduce.matches) { location.href = x.url; return; }
    // a short colour wash in the platform's colour, then the platform's own landing page
    wash.style.setProperty("--c", x.c); wash.style.setProperty("--d", x.d);
    $("#wash-ic").innerHTML = ic(x.icon); $("#wash-name").textContent = x.name;
    wash.hidden = false; wash.classList.remove("on"); void wash.offsetWidth; wash.classList.add("on");
    setTimeout(() => { location.href = x.url; }, 380);
  });
  addEventListener("pageshow", () => { wash.hidden = true; wash.classList.remove("on"); });

  let tt;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false; t.classList.remove("out");
    clearTimeout(tt); tt = setTimeout(() => { t.classList.add("out"); setTimeout(() => (t.hidden = true), 220); }, 3400);
  }

  if (!location.hash) history.replaceState(null, "", S ? "#/home" : "#/login");
  render(true);
})();
