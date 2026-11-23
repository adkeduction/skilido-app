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
      tabs: [["overview", "Overview", "grid"], ["stories", "Stories", "mask"], ["leap", "LEAP", "rocket"], ["assess", "Assessments", "checkbox"], ["home", "Home tasks", "home"]] },
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
    ["Rehearse together", "Learn · at home", "#/learn/home"], ["Self-assessment quizzes", "Learn · Assessments", "#/learn/assess"], ["Practice activities", "Learn · Assessments", "#/learn/assess"], ["Skill Champion certification", "Ayati Academy · 3 of 5 modules", "#/ayati/overview"],
    ["3L Facilitation", "Ayati Academy · track", "#/ayati/programs"], ["Assessing with the rubric", "Ayati Academy · module 4", "#/ayati/modules"],
    ["Coaching shy speakers in class", "Ayati Academy · teacher workshop, today 7 PM", "#/ayati/live"], ["Certificates", "Ayati Academy", "#/ayati/certificates"],
    ["Confidence", "Skill Passport · Level 4", "#/passport/skills"], ["Badges", "Skill Passport", "#/passport/badges"],
    ["Save Water challenge", "LifeLab · submit by 28 Nov", "#/lifelab/challenges"], ["LifeLab stars", "LifeLab · stars earned", "#/lifelab/challenges"], ["Mini market for a cause", "LifeLab · open challenge", "#/lifelab/open"], ["Post a challenge", "LifeLab", "#/lifelab/post"],
    ["FLY", "Opens fly.skilido.com", "ext:fly"], ["FLY Bazaar", "Opens fly.skilido.com/bazaar", "ext:bazaar"],
    ["Spotlight", "Opens spotlight.skilido.com", "ext:spotlight"], ["Family Club", "Opens club.skilido.com", "ext:club"],
  ];
  const NAV = [["home", "Home", "home"], ["learn", "Learn", "book"], ["ayati", "Ayati", "cap"], ["passport", "Passport", "idcard"], ["lifelab", "LifeLab", "bulb"]];

  document.fonts?.ready.then(() => {
    if (cur.view && cur.view !== "login") { setNav(cur.view === "home" ? "home" : cur.p, false); if (cur.view === "product") setTabs(cur.tab, false); }
  });

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
      // swap the section at once with a short fade (a view transition here stacked with the reveal and left a blank gap)
      const pane = $("#pane");
      pane.innerHTML = paneHTML(next.p, next.tab);
      setTabs(next.tab);
      const ln = $(".lnav"); if (ln && scrollY > ln.offsetTop) scrollTo({ top: ln.offsetTop, behavior: "instant" });
      enhance(pane);
      pane.classList.toggle("pane-in", false); void pane.offsetWidth; pane.classList.toggle("pane-in", true);
      document.title = `${PRODUCTS[next.p].name} · Skilido`;
      cur = next;
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

  /* ================= HOME (dashboard) ================= */
  const EXPLORE = [
    ["learn", "x-learn", "3L & LEAP programmes with stories, activities and practice"],
    ["passport", "x-passport", "Track skills, progress and achievements"],
    ["fly", "x-fly", "A Venture Lab for curious young founders"],
    ["bazaar", "x-bazaar", "Kids' own creations and products"],
    ["ayati", "x-ayati", "Training and certification for teachers"],
    ["lifelab", "x-lifelab", "Build life skills like confidence, empathy and teamwork"],
    ["spotlight", "x-mic", "The national stage for young talent and achievers"],
    ["club", "x-club", "Icons Family Club: activities, perks and parent circles"],
  ];
  // shared 3D card: pastel tile, floating object, title, text, arrow chip
  const c3 = ({ tag = "a", attrs = "", c, obj, title, sub, ext = false, cls = "", i = 0, alt = "" }) =>
    `<${tag} class="c3 rv ${cls}" ${attrs} style="--c:${c};--i:${i}"><span class="c3-obj">${art(obj, alt)}</span><span class="c3-t"><b>${title}</b><small>${sub}</small></span><span class="go3" aria-hidden="true">${ic(ext ? "ext" : "arrow")}</span></${tag}>`;
  const secHead = (id, title, sub, more = "", center = false) => `<div class="sh3${center ? " sh3-c" : ""}"><h2 id="${id}">${center ? `<i class="rays rays-l" aria-hidden="true"></i>` : `<i class="rays" aria-hidden="true"></i>`}${title}${center ? `<i class="rays rays-r" aria-hidden="true"></i>` : ""}</h2>${sub ? `<p>${sub}</p>` : ""}${more}</div>`;
  function homeHTML() {
    const left = TODOS.filter(([id]) => !done.has(id)).length;
    return `
    <div class="dash">
      <section class="hx2">${deco()}
        <div class="hx2-copy">
          <p class="hello"><span class="av-s">${art("aarav")}</span>Hi ${DEMO.child}! Ready to learn today? ${ic("sparkle", "ic hello-sp")}</p>
          <h1 tabindex="-1">Learn. Build. ${swoosh("Grow.")}</h1>
          <p class="hx2-sub">Real-world learning for confident, future-ready kids.</p>
          <div class="ctas2">
            <a class="btn btn-sun btn-lg" href="#/learn">${ic("play", "ic ic-solid")}Start learning ${ic("arrow")}</a>
            <a class="btn btn-glass btn-lg" href="#/learn/home">${ic("cal")}View my plan</a>
          </div>
          <ul class="trust">
            <li style="--c:#7C3AED"><span class="tr-ic">${ic("shield")}</span>Age-appropriate learning</li>
            <li style="--c:#16A34A"><span class="tr-ic">${ic("chart")}</span>Skill-based growth</li>
            <li style="--c:#E11D74"><span class="tr-ic">${ic("star")}</span>Trusted by parents & educators</li>
          </ul>
        </div>
        <div class="hx2-art float">${learningScene("kits")}</div>
      </section>

      <section class="sec3" aria-labelledby="ex-h">
        ${secHead("ex-h", "Explore Skilido", "A complete learning ecosystem for your child's growth.", "", true)}
        <div class="grid3 g-explore">${EXPLORE.map(([k, obj, sub], i) => {
          const isP = !!PRODUCTS[k], x = isP ? PRODUCTS[k] : PLATFORMS[k];
          return c3({ attrs: isP ? `data-p="${k}" href="#/${k}"` : `data-x="${k}" href="${x.url}" aria-label="${x.name}, opens its own website"`, c: x.c, obj, title: x.name, sub, ext: !isP, i, cls: "c3-tile" }).replace('class="c3-obj"', 'class="c3-obj pc-art"');
        }).join("")}</div>
      </section>

      <a class="na2 rv" href="#/learn/leap">${deco()}
        <span class="na2-pic">${art("x-rocket")}</span>
        <span class="na2-t"><small>Your next LEAP activity <i class="rays" aria-hidden="true"></i></small><b>Find a problem worth solving</b><span>Continue Module 4 · Picking the best problem</span></span>
        <span class="na2-art" aria-hidden="true">${art("x-bulbbooks")}</span>
        <span class="na2-p"><span class="bar3"><span style="--w:62%"></span></span><em>62%</em></span>
        <span class="btn btn-sun">Continue ${ic("arrow")}</span>
      </a>

      <section class="sec3" aria-labelledby="my-h">
        ${secHead("my-h", "My Skilido", `Pick up where you left off, ${DEMO.name}!`, `<span class="grade">${ic("cap")}${DEMO.child} · Grade 5</span>`)}
        <div class="grid3 g-my">
          ${[["x-mybook", "#0A84FF", "Continue learning", "Story 6 · The Clever Crow", "#/learn/stories"], ["x-myclip", "#F26B1D", "My activities", left ? `${left} task${left > 1 ? "s" : ""} to complete` : "All done this week", "#/learn/overview"], ["x-mychart", "#16A34A", "My progress", "See how you're growing", "#/passport"], ["x-mycal", "#7C3AED", "My events", "What's coming up", "#/ayati/live"]]
            .map(([obj, c, t, sub, href], i) => c3({ attrs: `href="${href}"`, c, obj, title: t, sub, i, cls: "c3-wide" })).join("")}
        </div>
      </section>

      <section class="sec3" aria-labelledby="up-h">
        ${secHead("up-h", "Coming up", "Live sessions and events.")}
        <div class="ulist2">
          <a class="urow2 rv" href="#/ayati/live" style="--c:#7C3AED">${gi("mic", "#7C3AED", "gi-sm")}<span><b>Coaching shy speakers in class</b><small>Ayati Academy · teacher workshop</small></span><span class="when">Today · 7:00 PM</span></a>
          <a class="urow2 rv" href="#/learn/overview" style="--c:#0A84FF;--i:1">${gi("rocket", "#F26B1D", "gi-sm")}<span><b>LEAP class · Picking the best problem</b><small>Learn · with Ms. Priya</small></span><span class="when">Tuesday</span></a>
          <a class="urow2 rv" href="${PLATFORMS.spotlight.url}" data-x="spotlight" style="--c:#C026D3;--i:2">${gi("cal", "#C026D3", "gi-sm")}<span><b>Spotlight 2027 school registrations</b><small>Opens spotlight.skilido.com</small></span><span class="when">Open now</span></a>
        </div>
      </section>
      <nav class="platform-links" aria-label="More Skilido platforms"><a href="${PLATFORMS.spotlight.url}" data-x="spotlight">${ic("mic")}Spotlight ${ic("ext")}</a><a href="${PLATFORMS.club.url}" data-x="club">${ic("users")}Icons Family Club ${ic("ext")}</a></nav><p class="foot">© 2026 ADK Education Park Private Limited · <a href="https://skilido.com/privacy">Privacy</a> · <a href="https://skilido.com/terms">Terms</a> · <a href="mailto:support@skilido.com">Help</a></p>
    </div>`;
  }
  function bindHome() {
    $$(".c3, .na2").forEach((t) => t.addEventListener("pointermove", (e) => { const r = t.getBoundingClientRect(); t.style.setProperty("--mx", `${e.clientX - r.left}px`); t.style.setProperty("--my", `${e.clientY - r.top}px`); }));
  }

  // illustrated banner for every inner tab: title on the left, a floating 3D object on the right
  const BANNER_ART = { "Assessments": "x-qshield", "LEAP": "x-fly", "Home tasks": "x-qhouse", "My skills": "x-mychart", "Evidence": "x-qvideo", "Growth journey": "x-schart", "Recommendations": "x-lifelab",
    "Badges": "t-stickers", "Courses": "x-capbook", "Modules": "x-books", "Live": "x-mic", "Certificates": "x-qshield", "Open challenges": "x-lifelab", "Post a challenge": "x-clip2" };
  const banner = (icon, title, sub) => `<section class="pbx3 rv">${deco()}<div class="pbx3-t"><h1 tabindex="-1">${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div><span class="pbx3-art float" aria-hidden="true">${BANNER_ART[title] ? art(BANNER_ART[title]) : gi(icon, null, "gi-lg")}</span></section>`;

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
  const paneHTML = (k, tab) => ({ learn: learnPane, ayati: ayatiPane, passport: passportPane, lifelab: lifelabPane })[k](tab) + (EXTRA[`${k}/${tab}`] ? EXTRA[`${k}/${tab}`]() : "");
  // a row of illustrated "how it works" / "next up" cards
  const how3 = (id, title, sub, items) => `<section class="sec3">${secHead(id, title, sub)}<div class="grid3 g-how">${items.map(([obj, t, d, c = "#7C3AED", href], i) =>
    `<${href ? `a href="${href}"${href.startsWith("http") ? ` data-x="${Object.keys(PLATFORMS).find((k) => PLATFORMS[k].url === href)}"` : ""}` : "div"} class="how3 rv" style="--c:${c};--i:${i}"><span class="how3-obj">${art(obj)}</span><span class="how3-n">${i + 1}</span><b>${t}</b><p>${d}</p></${href ? "a" : "div"}>`).join("")}</div></section>`;
  // extra sections for the inner tabs, so none of them opens half-empty
  const EXTRA = {
    "passport/skills": () => how3("pr-h", "Where to practise each skill", "Every skill has a place to grow inside Skilido.", [
      ["x-qbook", "Communication", "Stories and speaking cards in 3L.", "#0A84FF", "#/learn/stories"],
      ["x-mic", "Confidence", "Perform on the Spotlight stage.", "#F26B1D", PLATFORMS.spotlight.url],
      ["x-lifelab", "Critical Thinking", "LEAP lessons: picking the best problem.", "#EAB308", "#/learn/leap"],
      ["x-qshield", "Problem-Solving", "LifeLab challenges with real teams.", "#16A34A", "#/lifelab/challenges"]]),
    "passport/timeline": () => {
      const v = 2, pp = 1, la = 1;
      return `<section class="stats3 rv">${[["x-qshield", v, "Verified by teachers"], ["t-stickers", pp, "Participation records"], ["x-myclip", la, "Learning activity"]].map(([obj, n, l], i) => `<div style="--i:${i}"><span class="st3-obj">${art(obj)}</span><span><b>${n}</b><small>${l}</small></span></div>`).join("")}</section>
      <p class="fine">${ic("shield")}Only verified evidence moves a skill level. Participation and learning activity are shown for the full picture.</p>`;
    },
    "passport/recs": () => how3("why-h", "Practise at home this week", "Ten-minute ideas that build the same skills.", [
      ["x-masks", "Act it out", "Play the Crow's lines together and swap roles.", "#C026D3", "#/learn/home"],
      ["x-mic", "One-minute talk", "Aarav explains his water-saving idea at dinner.", "#0A84FF", "#/learn/home"],
      ["x-books", "Story order", "Shuffle the sequencing cards and rebuild the story.", "#7C3AED", "#/learn/stories"]]),
    "passport/badges": () => `<section class="sec3">${secHead("nx-h", "Next badges to earn", "Each one needs teacher-verified evidence.")}
      <div class="grid3 g-next">${[["x-fly", "First Venture", "Sell your LEAP product on Sales Day.", 62, "#F26B1D", "#/learn/leap"], ["x-qshield", "Team Player", "Finish a LifeLab challenge with your team.", 75, "#16A34A", "#/lifelab/challenges"], ["x-headph", "Great Listener", "Retell three stories in your own words.", 40, "#7C3AED", "#/learn/stories"]]
        .map(([obj, t, d, pc, c, href], i) => `<a class="nxb rv" href="${href}" style="--c:${c};--i:${i}"><span class="nxb-obj">${art(obj)}</span><span class="nxb-t"><b>${t}</b><small>${d}</small><span class="prow-bar"><span class="bar3"><span style="--w:${pc}%"></span></span><em>${pc}%</em></span></span></a>`).join("")}</div></section>
      ${how3("hb-h", "How badges work", "", [["x-qvideo", "Show it", "Aarav does the activity in class, at home or on stage."], ["x-myclip", "Check it", "A teacher or Skill Champion checks it against the rubric."], ["t-stickers", "Earn it", "The badge appears here and on his Skill Passport."]])}`,
    "ayati/programs": () => {
      const dn = PROGRAMS.reduce((a, x) => a + x[3], 0), n = PROGRAMS.reduce((a, x) => a + x[4], 0);
      return `<section class="stats3 rv">${[["x-books", `${dn}/${n}`, "Modules completed"], ["x-qshield", String(PROGRAMS.length), "Certification tracks"], ["x-mic", "2", "Live sessions this week"]].map(([obj, v, l], i) => `<div style="--i:${i}"><span class="st3-obj">${art(obj)}</span><span><b>${v}</b><small>${l}</small></span></div>`).join("")}</section>`
        + how3("pt-h", "Which track is right for you?", "Pick by the grades you teach.", [
        ["x-masks", "LKG to Grade 2", "3L Facilitation: story, drama and speaking.", "#C026D3"],
        ["x-fly", "Grades 3 to 10", "LEAP Facilitation: ventures and problem-solving.", "#F04E23"],
        ["x-qshield", "Any grade", "Skill Champion: assessing with the rubric.", "#16A34A"]]);
    },
    "ayati/live": () => how3("hl-h", "How live sessions work", "Join from inside Skilido, nothing to install.", [["x-myclip", "Register", "Tap Remind me or Register on any session."], ["x-mycal", "Get a reminder", "Skilido notifies you 30 minutes before."], ["x-qvideo", "Join live", "The join link opens here at start time."]]),
    "ayati/certificates": () => how3("hc-h", "Every certificate can be verified", "Schools and employers check it with one link.", [["x-capbook", "Complete the course", "Finish every module and the practice task."], ["x-qshield", "Get verified", "An Ayati assessor reviews your final task."], ["x-folder", "Share it", "Download the PDF or share the verification link."]]),
    "learn/stories": () => how3("sw-h", "How a 3L story session works", "One story, five short steps, about 30 minutes.", [
      ["x-headph", "Listen", "Hear the story read aloud with expression.", "#0A84FF"],
      ["x-qbook", "Understand", "New words, the order of events and why things happened.", "#7C3AED"],
      ["x-masks", "Become", "Act out a character with the puppets and masks.", "#C026D3"],
      ["x-mic", "Speak & reflect", "Retell it in your own words and share what you learnt.", "#F26B1D"]])
      + how3("sh-h", "Keep the story going at home", "Small ideas for the rest of the week.", [
      ["x-masks", "Swap roles", "Aarav plays the Crow, you play the narrator.", "#C026D3", "#/learn/home"],
      ["x-books", "Draw the ending", "Make a new ending and tell it at dinner.", "#0A84FF", "#/learn/home"],
      ["x-qshield", "Quick quiz", "Five friendly questions on Story 6.", "#16A34A", "#/learn/assess"]]),
    "learn/leap": () => how3("lp-h", "The LEAP venture journey", "Eight modules from an idea to Sales Day.", [
      ["x-lifelab", "Spot a problem", "Modules 1–4: notice, ask and pick the best problem.", "#EAB308"],
      ["x-myclip", "Plan the solution", "Modules 5–6: design it, cost it, test it.", "#0A84FF"],
      ["x-fly", "Build the venture", "Module 7: the team runs it as a company on FLY.", "#F04E23", PLATFORMS.fly.url],
      ["x-bazaar", "Sales Day", "Module 8: sell the product on FLY Bazaar.", "#F59E0B", PLATFORMS.bazaar.url]])
      + how3("lps-h", "Skills LEAP builds", "Each module adds evidence to the Skill Passport.", [
      ["x-mic", "Confidence", "Pitching to classmates and parents.", "#F26B1D", "#/passport/skills"],
      ["x-qchart", "Critical thinking", "Comparing problems and choosing one.", "#16A34A", "#/passport/skills"],
      ["x-headph", "Teamwork", "Working in a venture team of four.", "#7C3AED", "#/passport/skills"]]),
    "learn/home": () => how3("hm-h", "More ten-minute ideas", "No kit needed. Each one builds a Skill Passport skill.", [
      ["x-mic", "One-minute talk", "Aarav explains something he learnt today.", "#0A84FF"],
      ["x-books", "Story order", "Shuffle the sequencing cards and rebuild the story.", "#7C3AED"],
      ["x-qhouse", "Spot a problem", "Find one small problem at home and suggest a fix.", "#16A34A"],
      ["x-masks", "Feelings charades", "Act a feeling without words; others guess.", "#C026D3"]])
      + `<p class="fine">${ic("shield")}Ticked tasks show on the Skill Passport as learning activity. Only teacher-verified evidence moves a skill level.</p>`,
    "ayati/modules": () => how3("mw-h", "How each module works", "About 45 minutes, done at your own pace.", [
      ["x-qvideo", "Watch", "A short video of the method in a real class.", "#7C3AED"],
      ["x-books", "Read", "The facilitator notes and a one-page summary.", "#0A84FF"],
      ["x-myclip", "Practise", "Try it with your class and upload one piece of evidence.", "#16A34A"],
      ["x-qshield", "Check", "A short quiz unlocks the next module.", "#F59E0B"]])
      + how3("mr-h", "Classroom resources", "Ready to print or project.", [
      ["x-folder", "Lesson plans", "Week-by-week plans for 3L and LEAP.", "#0A84FF"],
      ["x-qshield", "Rubric cards", "The five-level rubric for each skill.", "#16A34A"],
      ["x-masks", "Story kits", "Puppet scripts and speaking cards.", "#C026D3"]]),
    "passport/journey": () => how3("jn-h", "How a skill moves up a level", "Every move has a source you can open.", [
      ["x-qvideo", "Practise", "Aarav uses the skill in class, at home or on stage.", "#0A84FF"],
      ["x-myclip", "Evidence", "A teacher records a video, photo or note.", "#7C3AED"],
      ["x-qshield", "Verify", "It is scored against the five-level rubric.", "#16A34A"],
      ["x-schart", "Level up", "The new level appears here and in Evidence.", "#F59E0B", "#/passport/timeline"]])
      + how3("jx-h", "Next review", "Teacher reviews happen every term.", [
      ["x-mycal", "Term 2 review", "12 February · Ms. Priya, Accord School.", "#7C3AED"],
      ["x-lifelab", "Before then", "Finish the Save Water challenge for Problem-Solving.", "#16A34A", "#/lifelab/challenges"],
      ["x-mic", "Spotlight entry", "A stage performance counts towards Confidence.", "#C026D3", PLATFORMS.spotlight.url]]),
    "lifelab/challenges": () => EXTRA["lifelab/open"](),
    "lifelab/open": () => how3("hw-h", "How a challenge works", "Four steps, about two weeks, one real result.", [["x-headph", "Understand", "Talk to the people who have the problem.", "#0EA5E9"], ["x-lifelab", "Ideate", "Sketch ideas as a team and pick one.", "#F59E0B"], ["x-qhouse", "Build", "Make a simple prototype and test it.", "#16A34A"], ["x-mic", "Present", "Show the result and earn verified evidence.", "#7C3AED"]]),
    "lifelab/post": () => how3("gc-h", "What makes a good challenge", "Reviewers look for these three things.", [["x-qhouse", "Real and local", "A problem children can see at school, at home or nearby.", "#16A34A"], ["x-qshield", "Safe to solve", "No risk, no money, and an adult nearby.", "#F59E0B"], ["x-schart", "Clear success", "A result you can measure in two to three weeks.", "#0A84FF"]]),
  };

  /* ---------- shared building blocks ---------- */
  // glossy icon tile, the signature element of the portal design
  // New generated artwork is independent from the semantic interface.
  const SPRITES = {
    "x-learn":0,"x-qbook":0,"x-mybook":0,"x-sbook":0,"t-books":0,
    "x-passport":1,"x-qchart":1,"x-mychart":1,"x-schart":1,
    "x-fly":2,"x-rocket":2,"rocket":2,"prog-rocket":2,
    "x-bazaar":3,"x-ayati":4,"ic-ayati":4,"x-capbook":4,
    "x-lifelab":5,"x-bulbbooks":5,"x-myclip":6,"x-clip2":6,
    "x-mycal":7,"x-scal":7,"x-qshield":8,"x-qvideo":9,
    "x-qhouse":10,"x-headph":11,"x-books":12,"x-masks":13,
    "t-stage":13,"x-mic":14,"x-micbooks":14,"t-speak":14,"x-clapper":15
  };
  const TOOL_ICONS = {"t-seq":"layers","t-dice":"dice","t-words":"msg","t-puppets":"users","t-journey":"book","t-family":"heart","t-stickers":"star","x-folder":"folder","x-trophy":"award","x-club":"users"};
  const art = (name, alt = "", cls = "") => {
    if (Object.hasOwn(SPRITES,name)) {
      const n=SPRITES[name], x=(n%4)*100/3, y=Math.floor(n/4)*100/3;
      return `<span class="art art-sprite ${cls}" style="background-position:${x}% ${y}%" ${alt ? `role="img" aria-label="${esc(alt)}"` : 'aria-hidden="true"'}></span>`;
    }
    if (TOOL_ICONS[name]) return `<span class="art art-drawn ${cls}" aria-hidden="true">${ic(TOOL_ICONS[name])}</span>`;
    const generated = ["teacher","expert","course-1","course-2","vid-1","vid-2","vid-3","vid-4"].includes(name) ? "educators" : name === "aarav" ? "student" : null;
    return `<img class="art ${cls}" src="${generated ? `assets/generated/${generated}-v1.webp` : `assets/art/${name}.webp?v=4`}" alt="${esc(alt)}" decoding="async">`;
  };
  const learningScene = (kind) => `<span class="scene scene-kind-${kind}" aria-hidden="true"><span class="scene-hill"></span><span class="scene-podium"></span>${kind === "teachers" ? '<img class="scene-educators" src="assets/generated/educators-v1.webp" alt="">' : `${kind === "kits" ? '<img class="scene-kits" src="assets/generated/kits-v1.webp" alt="">' : `<span class="scene-books">${art("x-books")}</span><span class="scene-rocket">${art("x-fly")}</span>`}<img class="scene-student" src="assets/generated/student-v1.webp" alt="">`}<span class="scene-spark scene-spark-a">${ic("sparkle")}</span><span class="scene-spark scene-spark-b">${ic("sparkle")}</span><span class="scene-book">${ic("book")}</span><span class="scene-cloud scene-cloud-a"></span><span class="scene-cloud scene-cloud-b"></span></span>`;
  const deco = () => `<span class="deco" aria-hidden="true"><i class="d1"></i><i class="d2"></i><i class="d3"></i><i class="d4"></i><i class="d5"></i><i class="st s-a">${ic("sparkle")}</i><i class="st s-b">${ic("star")}</i></span>`;
  const gi = (icon, c, size = "") => `<span class="gi ${size}"${c ? ` style="--c:${c}"` : ""}>${ic(icon)}</span>`;
  const swoosh = (word) => `<span class="sw">${word}<svg viewBox="0 0 220 22" preserveAspectRatio="none" aria-hidden="true"><path d="M4 15 C 60 4, 150 3, 216 12"/></svg></span>`;
  const ring = (pct, c, cls = "") => `<div class="ring ${cls}" style="--c:${c};--to:${pct}" role="img" aria-label="${pct} percent"><div><b data-count="${pct}">0</b><small>%</small></div></div>`;
  const bar = (pct, c) => `<span class="bar"${c ? ` style="--c:${c}"` : ""}><span style="--w:${pct}%"></span></span>`;
  const rows = (list, accent) => `<div class="card list rv">${list.map(([s, t, d, tag], i) => `<div class="row" style="--i:${i}"><span class="st st-${s}" style="--a:${accent}">${ic(s === "done" ? "check" : s === "now" ? "play" : "lock")}</span><span class="row-t"><b>${t}</b><small>${d}</small></span>${tag ? `<span class="tag tag-now">${tag}</span>` : ""}</div>`).join("")}</div>`;
  const head = (title, sub, more) => `<div class="sec-h rv"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${more || ""}</div>`;
  // big hero banner for each product's first tab
  const hero = (title, sub, art, ctas = "") => `
    <section class="phx" data-tilt>${deco()}
      <div class="phx-copy"><h1 tabindex="-1">${title}</h1><p>${sub}</p>${ctas ? `<div class="ctas">${ctas}</div>` : ""}</div>
      <div class="phx-art" aria-hidden="true">${art}<i class="ray r1"></i><i class="ray r2"></i><i class="ray r3"></i></div>
    </section>`;

  /* ================= LEARN ================= */
  const TODOS = [["t1", "rocket", "#F26B1D", "Picking the best problem", "LEAP lesson", "Due Fri"], ["t2", "mask", "#C026D3", "Rehearse the Crow's lines", "3L · with family", "Due Sat"], ["t3", "mic", "#0A84FF", "Neighbourhood interview", "Home task", "Due Sun"]];
  function learnPane(tab) {
    if (tab === "overview") {
      const tiles = [["x-qbook", "#0A84FF", "Learn", "Watch · read · understand", "#/learn/stories"], ["x-qchart", "#16A34A", "Practise", "Try activities, build skills", "#/learn/leap"],
        ["x-qshield", "#F59E0B", "Assessment", "Quizzes and self-checks", "#/learn/assess"], ["x-qvideo", "#7C3AED", "Join class", "Live and virtual sessions", "scroll:classes"], ["x-qhouse", "#E11D74", "Home tasks", "Do them together", "#/learn/home"]];
      return hero(`Learn. Practise. ${swoosh("Prove.")}`, `${DEMO.child}'s 3L and LEAP learning space.`,
        `<span class="hero-pic hero-scene">${learningScene("learn")}</span>`,
        `<a class="btn btn-sun" href="#/learn/leap">Continue LEAP ${ic("arrow")}</a><a class="btn btn-glass" href="#/learn/stories">Open Story 6 ${ic("chev")}</a>`) + `
      <nav class="grid3 g-quick" aria-label="Learning shortcuts">${tiles.map(([obj, c, t, sub, href], i) => href.startsWith("scroll:")
        ? c3({ tag: "button", attrs: `type="button" data-scroll="${href.slice(7)}"`, c, obj, title: t, sub, i, cls: "c3-tile" })
        : c3({ attrs: `href="${href}"`, c, obj, title: t, sub, i, cls: "c3-tile" })).join("")}</nav>

      <div class="duo">
        <section class="panel rv" aria-labelledby="cp-h">
          <h2 id="cp-h" class="panel-h">My current programmes</h2>
          <a class="prow" href="#/learn/leap" style="--c:#F26B1D"><span class="thumb-cut">${art("x-rocket")}</span><span class="prow-t"><b>LEAP · Young Founders</b><small>Module 4: Find a problem worth solving</small><span class="prow-bar"><span class="bar3"><span style="--w:62%"></span></span><em>62%</em></span></span><span class="go3">${ic("arrow")}</span></a>
          <a class="prow" href="#/learn/stories" style="--c:#C026D3"><span class="thumb-cut">${art("x-masks")}</span><span class="prow-t"><b>3L Dramatics · Season 2</b><small>Story 6: The Clever Crow</small><span class="prow-bar"><span class="bar3"><span style="--w:40%"></span></span><em>40%</em></span></span><span class="go3">${ic("arrow")}</span></a>
        </section>
        <section class="panel rv" aria-labelledby="td-h">
          <h2 id="td-h" class="panel-h">To do next <span class="count" id="todo-count"></span></h2>
          <ul class="todos">${TODOS.map(([id, i, c, t, sub, due], n) => `<li class="todo ${done.has(id) ? "is-done" : ""}" style="--c:${c};--i:${n}">
            <button class="tick" data-todo="${id}" aria-pressed="${done.has(id)}" aria-label="Mark “${t}” done"><span class="tk-i">${ic(i)}</span>${ic("check", "ic tk-c")}</button>
            <span class="todo-t"><b>${t}</b><small>${sub}</small></span><span class="due">${due}</span></li>`).join("")}</ul>
        </section>
      </div>

      <section class="panel panel3 rv" id="classes" aria-labelledby="uc-h">${deco()}
        ${secHead("uc-h", "Upcoming classes", "Live and curated sessions for real-world learning.", `<a class="tlink" href="#/learn/leap">See LEAP ${ic("chev")}</a>`)}
        <div class="classes">
          <div class="cls3" style="--c:#0A84FF"><span class="cls3-pic">${art("teacher", "Ms. Priya, LEAP teacher")}<span class="badge-live"><i></i>Next</span></span>
            <span class="cls-t"><b>LEAP class</b><span>Picking the best problem</span><small>${ic("cal")}Tuesday · with Ms. Priya</small></span>
            <button class="btn btn-acc btn-sm" data-join>${ic("play")}<span>Remind me</span></button></div>
          <div class="cls3" style="--c:#C026D3"><span class="cls3-pic cls3-obj">${art("x-trophy", "3L performance day")}</span>
            <span class="cls-t"><b>3L performance day</b><span>The Clever Crow</span><small>${ic("cal")}Saturday · at school</small></span>
            <button class="btn btn-acc btn-sm" data-join>${ic("play")}<span>Remind me</span></button></div>
        </div>
      </section>

      <section class="stats3 rv">${[["x-sbook", "16", "Original story episodes"], ["x-schart", "192", "Structured sessions"], ["x-scal", "32", "Planned performances"]].map(([obj, n, l], i) => `<div style="--i:${i}"><span class="st3-obj">${art(obj)}</span><span><b data-count="${n}">0</b><small>${l}</small></span></div>`).join("")}</section>

      <section class="sec3">${secHead("tl-h", `Three Ls. One confident ${swoosh("child.")}`, "Each story is built to grow all three, together.")}
        <div class="grid3 g-three">${[["msg", "Language", "New words, narration and the courage to speak up in front of others.", "#0A84FF", "#/learn/stories"], ["grid", "Logic", "Story order, cause and effect, and solving the problem inside every tale.", "#7C3AED", "#/learn/leap"], ["heart", "Life skills", "Honesty, teamwork and empathy, learned by becoming the characters.", "#F04E23", "#/learn/home"]]
          .map(([i, t, d, c, href], n) => `<a class="l3 rv" href="${href}" style="--c:${c};--i:${n}">${gi(i, c, "gi-md")}<span><b>${t}</b><p>${d}</p></span><span class="go3" aria-hidden="true">${ic("arrow")}</span></a>`).join("")}</div></section>`;
    }
    if (tab === "stories") {
      const steps = [["x-headph", "Listen", "to a story", "ok"], ["x-books", "Understand", "words, order and reasons", "ok"], ["x-masks", "Become", "a character on stage", "now"], ["x-mic", "Speak", "alone, as yourself", ""], ["x-clip2", "Reflect", "on how you grew", ""]];
      const tools = [["t-books", "Storybooks"], ["t-seq", "Story sequencing cards"], ["t-dice", "Story dice"], ["t-words", "Words of the day"], ["t-speak", "My speaking cards"], ["t-puppets", "Finger puppets"], ["t-stage", "Little stage mat"], ["t-journey", "3L Journey Book"], ["t-family", "Family challenge cards"], ["t-stickers", "Achievement stickers"]];
      return hero(`Learn with ${swoosh("Stories.")}`, "A step-by-step learning journey that builds language, confidence and life skills.",
        `<span class="hero-pic hero-scene">${learningScene("kits")}</span>`) + `
      <ol class="grid3 g-steps" aria-label="Every 12-session cycle">${steps.map(([obj, t, d, st], i) => `<li class="step3 rv ${st}" style="--i:${i}"><span class="s3-n">${st === "ok" ? ic("check") : i + 1}</span><span class="s3-t"><b>${t}</b><small>${d}</small></span><span class="s3-obj">${art(obj)}</span></li>`).join("")}</ol>

      <section class="sec3">${secHead("sb-h", "Everything in the StoryBox.", "Ten hands-on tools for school and home.", "", true)}
        <div class="grid3 g-tools">${tools.map(([obj, t], i) => `<button type="button" class="tool3 rv" style="--i:${i}" data-toast="${t}: part of the 3L StoryBox, used in class and at home."><span class="tool3-obj">${art(obj)}</span><b>${t}</b><span class="go3" aria-hidden="true">${ic("arrow")}</span></button>`).join("")}</div></section>

      <section class="band3 rv">${deco()}<span class="band3-obj">${art("x-clapper")}</span><div><h2>Rehearse together tonight. <i class="rays rays-w" aria-hidden="true"></i></h2><p>Play the Crow's lines with ${DEMO.child} for ten minutes and record his practice.</p></div><a class="btn btn-white" href="#/learn/home">See home tasks ${ic("arrow")}</a></section>
      <details class="story-library"><summary>Story 6 and the Season 2 library ${ic("down")}</summary>      <div class="card feature rv">
        <button class="video" data-toast="Video playback arrives when Learn launches."><span class="vplay">${ic("play")}</span><span class="vcap">The Clever Crow · rehearsal · 2:14</span></button>
        <div class="fr-b"><span class="tag tag-now">Now</span><b>Story 6 · The Clever Crow</b><p>A thirsty crow finds a clever way to reach the water. Aarav plays the Crow and practises the narrator's lines.</p>
          <div class="fr-row"><span>${ic("cal")}Performance Saturday</span><span>${ic("clock")}12 sessions</span></div></div>
      </div>

      ${head("Season 2", "16 original episodes")}
      ${rows([["done", "1 · The Mango Tree Gang", "Performed"], ["done", "2 · The Brave Little Ant", "Performed"], ["done", "3 · Sharing the Sun", "Performed"], ["done", "4 · The Lost Kite", "Performed"], ["done", "5 · The Honest Woodcutter", "Performed · video reviewed"], ["now", "6 · The Clever Crow", "Rehearsing", "Now"], ["lock", "7 · The Lion and the Mouse", "Unlocks after Story 6"], ["lock", "8 · The Talking Drum", "Coming up"]], "#0A84FF")}

</details>`;
    }
    if (tab === "assess") {
      const sc = ["Still learning", "Getting there", "I can do it!"];
      return banner("checkbox", "Assessments", "Quick quizzes and activities to check what you've learned") + `
      <section class="sec3">${secHead("qz-h", "Self-assessment quizzes", "Short, friendly quizzes. Try as many times as you like.")}
        <div class="grid3 g-quiz">${QUIZZES.map((q, i) => quizCard(q, i)).join("")}</div></section>

      <section class="panel panel3 rv" aria-labelledby="sc-h">${deco()}
        ${secHead("sc-h", "How am I doing?", "Pick how you feel about each skill. There are no wrong answers.")}
        <div class="scx">${SKILLS.map(([n], i) => { const [icn, c] = SK_STYLE[n]; return `<div class="scx-row" style="--c:${c};--i:${i}">${gi(icn, c, "gi-sm")}<b>${n}</b><div class="scx-opts" role="radiogroup" aria-label="${n}">${sc.map((l, k) => `<button type="button" role="radio" class="scx-o" data-sc="${n}" data-v="${k}" aria-checked="${selfCheck[n] === k}">${l}</button>`).join("")}</div></div>`; }).join("")}</div>
        <button class="btn btn-acc" id="sc-save" style="--c:#2563EB">${ic("check")}Save my self-check</button>
      </section>

      <section class="sec3">${secHead("pa-h", "Practice activities", "Hands-on tasks that build the same skills.")}
        <div class="grid3 g-pact">${PRACTICE.map(([id, obj, c, t, d, m], n) => `<div class="act pact rv ${done.has(id) ? "is-done" : ""}" style="--i:${n};--c:${c}"><span class="pact-obj">${art(obj)}</span><div class="act-t"><b>${t}</b><p>${d}</p><small>${ic("clock")}${m}</small></div><button class="act-btn" data-act="${id}" aria-pressed="${done.has(id)}">${ic("check")}<span>${done.has(id) ? "Done" : "Mark done"}</span></button></div>`).join("")}</div></section>
      <p class="fine">${ic("shield")}Quizzes and self-checks are for practice. They show as learning activity, never as a skill level.</p>`;
    }
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
    const doneActs = acts.filter(([id]) => done.has(id)).length;
    return banner("home", "Home tasks", "Small things you can do together this week") +
      `<div class="card wk3 rv"><span class="wk3-obj">${art("x-myclip")}</span><span class="wk3-t"><b><span id="wk-n">${doneActs}</span> of ${acts.length} done this week</b><small>About 40 minutes in total. Finished tasks show in the Skill Passport as learning activity.</small><span class="bar3"><span id="wk-bar" style="--w:${Math.round(doneActs / acts.length * 100)}%"></span></span></span></div>
      <div class="acts">${acts.map(([id, t, d, m, i, c], n) => `<div class="act rv ${done.has(id) ? "is-done" : ""}" style="--i:${n};--c:${c}">${gi(i, c)}<div class="act-t"><b>${t}</b><p>${d}</p><small>${ic("clock")}${m}</small></div><button class="act-btn" data-act="${id}" aria-pressed="${done.has(id)}">${ic("check")}<span>${done.has(id) ? "Done" : "Mark done"}</span></button></div>`).join("")}</div>
      <p class="fine">${ic("sparkle")}Home tasks show in the Skill Passport as learning activity, never as a skill score.</p>`;
  }

  /* ---------- self-assessment quizzes ---------- */
  const QUIZZES = [
    { id: "q1", obj: "x-masks", c: "#C026D3", title: "The Clever Crow", tag: "3L · Language", mins: 3, qs: [
      ["Why did the crow drop pebbles into the pot?", ["To make the water rise", "To break the pot", "To build a nest"], 0],
      ["What does “thirsty” mean?", ["Wanting to sleep", "Wanting a drink", "Wanting to play"], 1],
      ["Which word describes the crow best?", ["Lazy", "Clever", "Scared"], 1],
      ["What happened first in the story?", ["The crow drank the water", "The crow found a pot", "The crow flew home"], 1],
      ["What can we learn from the crow?", ["Give up quickly", "Think of a smart way", "Wait for someone else"], 1]] },
    { id: "q2", obj: "x-fly", c: "#F26B1D", title: "Picking the best problem", tag: "LEAP · Critical thinking", mins: 3, qs: [
      ["A good problem to solve is one that…", ["Only you have", "Many people really have", "Nobody can ever fix"], 1],
      ["What should you do before choosing a problem?", ["Talk to real people", "Guess quickly", "Copy a friend"], 0],
      ["Which of these is a real problem at school?", ["Long queues at the water tap", "The sky is blue", "Friday comes after Thursday"], 0],
      ["After picking a problem, the next step is…", ["Designing a solution", "Selling the product", "Forgetting about it"], 0]] },
    { id: "q3", obj: "t-words", c: "#16A34A", title: "Words of the day", tag: "3L · Vocabulary", mins: 2, qs: [
      ["A “pebble” is…", ["A small stone", "A tiny bird", "A kind of fruit"], 0],
      ["Someone “clever” is…", ["Quick at thinking", "Very tall", "Always sleepy"], 0],
      ["Which sentence uses “thirsty” correctly?", ["I am thirsty, may I have some water?", "The thirsty book is red.", "She ran thirsty to school."], 0]] },
  ];
  const quizBest = {};
  const selfCheck = {};
  const starsFor = (score, total) => (score === total ? 3 : score / total >= .6 ? 2 : score > 0 ? 1 : 0);
  const starRow = (n, cls = "") => `<span class="qstars ${cls}" aria-label="${n} of 3 stars">${[1, 2, 3].map((k) => `<i class="${k <= n ? "on" : ""}" style="--k:${k}">${ic("star")}</i>`).join("")}</span>`;
  const quizCard = (q, i) => { const b = quizBest[q.id];
    return `<div class="qcard rv" style="--c:${q.c};--i:${i}" id="card-${q.id}"><span class="qcard-obj">${art(q.obj)}</span><span class="tag">${q.tag}</span><b>${q.title}</b>
      <small>${q.qs.length} questions · about ${q.mins} min</small>
      <span class="qcard-best">${b ? `${starRow(starsFor(b, q.qs.length))}Best: ${b} of ${q.qs.length}` : "Not tried yet"}</span>
      <button class="btn btn-acc btn-sm" data-quiz="${q.id}">${b ? "Try again" : `Start quiz ${ic("arrow")}`}</button></div>`; };
  const PRACTICE = [
    ["p1", "x-books", "#7C3AED", "Retell the story in 5 pictures", "Draw five boxes and show the Crow's story in order. Then tell it aloud.", "20 min"],
    ["p2", "x-mic", "#0A84FF", "Interview a shopkeeper", "Ask one question: “What problem do your customers have?” Write the answer down.", "15 min"],
    ["p3", "t-words", "#16A34A", "Make a word wall", "Write today's words on cards and stick them where the family can see.", "10 min"],
    ["p4", "t-seq", "#F26B1D", "Sort the story cards", "Shuffle the sequencing cards and put the story back in order.", "10 min"],
  ];

  // quiz runs in a native <dialog>: focus is trapped, Esc closes it
  function openQuiz(id) {
    const q = QUIZZES.find((x) => x.id === id); if (!q) return;
    let dlg = $("#quiz");
    if (!dlg) {
      dlg = document.createElement("dialog"); dlg.id = "quiz"; dlg.className = "qz"; document.body.appendChild(dlg);
      dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    }
    let k = 0, score = 0;
    const shell = (inner) => `<div class="qz-in" style="--c:${q.c}"><div class="qz-h"><span class="qz-obj">${art(q.obj)}</span><span><small>${q.tag}</small><b>${q.title}</b></span><button class="qz-x" aria-label="Close quiz" data-qz="close">${ic("x")}</button></div>${inner}</div>`;
    const step = () => {
      const [text, opts, ans] = q.qs[k];
      dlg.innerHTML = shell(`<div class="qz-prog"><span>Question ${k + 1} of ${q.qs.length}</span><span class="bar3"><span style="--w:${Math.round(k / q.qs.length * 100)}%"></span></span></div>
        <div class="qz-body" key="${k}"><p class="qz-q">${text}</p><div class="qz-opts">${opts.map((o, j) => `<button type="button" class="qz-o" data-j="${j}"><span class="qz-l">${"ABC"[j]}</span><span>${o}</span></button>`).join("")}</div>
        <p class="qz-fb" role="status" aria-live="polite"></p></div>
        <div class="qz-f"><button class="btn btn-acc" data-qz="next" hidden>${k + 1 < q.qs.length ? "Next question" : "See my result"} ${ic("arrow")}</button></div>`);
      $$(".qz-o", dlg).forEach((b) => b.addEventListener("click", () => {
        const j = +b.dataset.j, ok = j === ans; if (ok) score++;
        $$(".qz-o", dlg).forEach((x) => { x.disabled = true; if (+x.dataset.j === ans) x.classList.add("ok"); });
        if (!ok) b.classList.add("no");
        $(".qz-fb", dlg).innerHTML = ok ? `${ic("check")}Great thinking!` : `Not quite. The answer is <b>${opts[ans]}</b>.`;
        $(".qz-fb", dlg).className = "qz-fb " + (ok ? "good" : "try");
        const nx = $('[data-qz="next"]', dlg); nx.hidden = false; nx.focus();
      }));
      bindCommon();
    };
    const result = () => {
      const st = starsFor(score, q.qs.length);
      quizBest[q.id] = Math.max(quizBest[q.id] || 0, score);
      const msg = st === 3 ? "Perfect! You really know this." : st === 2 ? "Well done! Nearly all correct." : "Good try! Read it once more and try again.";
      dlg.innerHTML = shell(`<div class="qz-res">${starRow(st, "big")}<b class="qz-score">${score} of ${q.qs.length}</b><p>${msg}</p></div>
        <div class="qz-f two"><button class="btn btn-ghost" data-qz="again">Try again</button><button class="btn btn-acc" data-qz="close">Done</button></div>`);
      bindCommon();
      const card = $(`#card-${q.id}`); if (card) { const tmp = document.createElement("div"); tmp.innerHTML = quizCard(q, 0); const nc = tmp.firstElementChild; nc.classList.add("in"); card.replaceWith(nc); $("[data-quiz]", nc).addEventListener("click", () => openQuiz(q.id)); }
    };
    const bindCommon = () => {
      $$('[data-qz="close"]', dlg).forEach((b) => b.addEventListener("click", () => dlg.close()));
      const nx = $('[data-qz="next"]', dlg); if (nx) nx.addEventListener("click", () => { k++; k < q.qs.length ? step() : result(); });
      const ag = $('[data-qz="again"]', dlg); if (ag) ag.addEventListener("click", () => { k = 0; score = 0; step(); });
    };
    step();
    if (!dlg.open) dlg.showModal();
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
    const registered = new Set();
  const PROGRAMS = [
    ["mask", "3L Facilitation", "Run story, drama and speaking sessions for LKG to Grade 2.", 3, 4, "#C026D3", "Certificate"],
    ["rocket", "LEAP Facilitation", "Coach venture teams through pitches and Sales Day.", 2, 5, "#F04E23", "Certificate"],
    ["chart", "Assessment & Skill Passport", "Use the five-level rubric and the evidence workflow.", 1, 3, "#16A34A", "Certificate"],
  ];
  const progCard = ([i, t, d, dn, n, c, tag], k) => `<a class="prc rv" href="#/ayati/modules" style="--c:${c};--i:${k}">${gi(i, c)}<span class="tag">${tag}</span><b>${t}</b><p>${d}</p>${bar(Math.round(dn / n * 100), c)}<small>${dn} of ${n} modules</small></a>`;
  const VIDART = { "The Skilido way": "x-qbook", "Running a 3L session": "x-masks", "Coaching a LEAP team": "x-fly", "Assessing with the rubric": "x-qshield" };
  const COURSEART = { "3L Facilitation": "course-2", "LEAP Facilitation": "course-1" };
  function ayatiRoleBlock() {
    const t = true;
    const vids = [["book", "#7C3AED", "The Skilido way", "Module 1", "18 min"], ["mask", "#C026D3", "Running a 3L session", "Module 2", "25 min"], ["rocket", "#F26B1D", "Coaching a LEAP team", "Module 3", "30 min"], ["chart", "#16A34A", "Assessing with the rubric", "Module 4", "25 min"]];
    const courses = PROGRAMS;
    const live = ["Thursday · 4:30 PM", "Running a 3L performance day", "Monthly refresher for Skill Champions"];
    const lid = "lv-t";
    return `
      <section class="sec-s">${head(`${gi("play", "#7C3AED", "gi-xs")}Learn and watch`, t ? "Core modules for Skill Champions." : "Short, practical videos for home.", `<a class="tlink" href="#/ayati/${t ? "modules" : "live"}">View all ${ic("chev")}</a>`)}
        <div class="vids">${vids.map(([i, c, title, meta, dur], n) => `<button class="vid rv" style="--c:${c};--i:${n}" data-toast="Videos play inside Ayati Academy when it launches."><span class="vid-art${VIDART[title] ? " vid-photo" : ""}">${VIDART[title] ? art(VIDART[title]) : gi(i, c, "gi-md")}<span class="vid-play">${ic("play")}</span><span class="dur">${dur}</span></span><b>${title}</b><small>${meta}</small><span class="go3 vid-arrow" aria-hidden="true">${ic("arrow")}</span></button>`).join("")}</div>
      </section>
      <section class="duo">
        <div class="panel panel3 has-art rv">${deco()}<span class="p3-art float" aria-hidden="true">${art("x-capbook")}</span><h2 class="panel-h">${gi("award", "#7C3AED", "gi-sm")}${t ? "Certification courses" : "Courses for you"}<i class="rays" aria-hidden="true"></i></h2><p class="muted">${t ? "Get certified. Build your expertise." : "Learn at your own pace."}</p>
          <div class="clist">${courses.map(([i, title, d, dn, n, c, tag]) => `<a class="crow" href="#/ayati/${tag === "Earned" ? "certificates" : "programs"}" style="--c:${c}">${COURSEART[title] ? `<span class="thumb-pic">${art(COURSEART[title])}</span>` : gi(i, c, "gi-thumb")}<span><b>${title}</b><small>${ic(tag === "Earned" ? "award" : "book")}${tag === "Earned" ? d : `${n} modules · ${tag}`}</small></span><span class="go">${ic("arrow")}</span></a>`).join("")}</div>
        </div>
        <div class="panel panel3 has-art rv">${deco()}<span class="p3-art float f2" aria-hidden="true">${art("x-folder")}</span><h2 class="panel-h">${gi("folder", "#7C3AED", "gi-sm")}Resources<i class="rays" aria-hidden="true"></i></h2><p class="muted">Ready-to-use materials for your classroom.</p>
          <div class="res-grid" id="res-grid">${resTiles()}</div>
        </div>
      </section>
      <section class="panel panel3 rv">${deco()}${head(`${gi("cal", "#7C3AED", "gi-sm")}Virtual expert sessions<i class="rays" aria-hidden="true"></i>`, "Live sessions with education experts and Skill Champions.", `<a class="tlink" href="#/ayati/live">All sessions ${ic("chev")}</a>`)}
        <div class="xsess"><span class="xs-art xs-photo">${art("expert", "Session expert")}</span>
          <span class="xs-t"><span class="badge-live"><i></i>Live</span><b>${live[1]}</b><small>${live[2]}</small><small>${ic("cal")}${live[0]}</small></span>
          <span class="xs-obj" aria-hidden="true">${art("x-micbooks")}</span><button class="btn btn-acc" data-register="${lid}" aria-pressed="${registered.has(lid)}">${registered.has(lid) ? `${ic("check")}Registered` : `Register now ${ic("arrow")}`}</button></div>
      </section>`;
  }
  function resTiles() {
    const r = [["file", "#0A84FF", "Lesson plans"], ["image", "#F26B1D", "Activity sheets"], ["checkbox", "#16A34A", "Worksheets"], ["box", "#7C3AED", "Project kits"]];
    return r.map(([i, c, t], n) => `<button class="rtile" style="--c:${c};--i:${n}" data-toast="The resource library opens when Ayati Academy launches.">${gi(i, c, "gi-sm")}<b>${t}</b></button>`).join("");
  }
  function ayatiPane(tab) {
    const live = (when, t, d, btn, id) => `<div class="card live rv"><span class="badge-live"><i></i>${when}</span><b>${t}</b><small>${d}</small><button class="btn btn-white btn-sm" data-register="${id}" aria-pressed="${registered.has(id)}">${registered.has(id) ? `${ic("check")}Registered` : btn}</button></div>`;
    if (tab === "overview") return hero(`<span class="brandblk"><span class="bb-l">${gi("cap", "#7C3AED", "gi-bb")}<span><span class="bb-n">Ayati Academy</span><span class="bb-t">Learn · Train · Empower</span></span></span><span class="bb-d" aria-hidden="true"></span><span class="bb-r">For ${swoosh("teachers")}</span></span>`, "Practical training, classroom resources and certification for teachers and Skill Champions.",
        `<span class="hero-pic hero-scene">${learningScene("teachers")}</span>`,
        `<a class="btn btn-sun" href="#/ayati/modules">Continue Module 4 ${ic("arrow")}</a><a class="btn btn-glass" href="#/ayati/programs">All courses ${ic("chev")}</a>`) + `
      <div id="role-block">${ayatiRoleBlock()}</div>
      <a class="card xlink rv" href="${PLATFORMS.club.url}" data-x="club" style="--x:#4F46E5">${gi("users", "#4F46E5")}<span><b>Ayati modules are live in Icons Family Club</b><small>Teachers take today's modules in the Club's teacher space.</small></span>${ic("ext")}</a>`;
    if (tab === "programs") return banner("award", "Courses", "Certification tracks for teachers and Skill Champions") + `<div class="prgrid">${PROGRAMS.map(progCard).join("")}</div>`;
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
      `<div class="duo duo-tight">${live("Today · 7:00 PM", "Coaching shy speakers in class", "Teacher workshop · 45 min · 86 teachers joined", "Remind me and join", "lv-p")}${live("Thursday · 4:30 PM", "Running a 3L performance day", "Skill Champion refresher · 45 min", "Remind me", "lv-t")}</div>` +
      head("Recordings") + rows([["done", "Coaching shy speakers", "Recorded · 40 min"], ["done", "Rubric scoring clinic", "Recorded · 35 min"], ["done", "Sales Day without stress", "Recorded · 38 min"]], "#7C3AED");
    return banner("idcard", "Certificates", "Earned and in progress") + `
      <div class="certificate rv">
        <div class="ce-in">
          <img src="assets/brand/skilido-dark.webp" alt="Skilido" width="96" height="29">
          <small>Ayati Academy · Certificate of completion · sample</small>
          <b class="ce-name">Ms. Priya</b><p>has completed the certification course</p><b class="ce-course">3L Facilitation</b>
          <div class="ce-foot"><span>October 2026</span><span class="ce-seal">${ic("award")}</span><span>No. AY-2026-0418</span></div>
        </div>
      </div>
      <div class="btn-row rv"><button class="btn btn-ghost" data-toast="Downloads a PDF when certificates launch.">${ic("download")}Download</button><button class="btn btn-acc" data-toast="Shares a verification link when certificates launch.">${ic("share")}Share</button></div>
      ${head("In progress")}
      <div class="card course rv">${gi("award", "#7C3AED", "gi-thumb")}<span class="row-t"><b>Skill Champion · 3L and LEAP</b><small>3 of 5 modules</small>${bar(60)}</span></div>
      <div class="card course rv">${gi("rocket", "#F04E23", "gi-thumb")}<span class="row-t"><b>LEAP Facilitation</b><small>2 of 5 modules</small>${bar(40, "#F04E23")}</span></div>`;
  }

  /* ================= LIFELAB ================= */
  // [id, title, where, image, photo?, colour, status, deadline, days left, stars, extra]
  const MY_CH = [
    ["w1", "Help our school save water", "Accord School · Grades 5–9 · team of 4", "rec-1", true, "#0EA5E9", "active", "Fri, 28 Nov", 7, 50, { step: 3, idea: "Drip-tray bottles under every tap to reuse water for the garden." }],
    ["w2", "Kindness at home week", "Family challenge · 7 days", "x-qhouse", false, "#E11D74", "active", "Tue, 2 Dec", 11, 30, { step: 2 }],
    ["w3", "Zero-waste lunchbox week", "Family challenge · verified by a Skill Champion", "vid-4", true, "#16A34A", "done", "Completed 14 Nov", 0, 30, {}],
  ];
  const OPEN_CH = [
    ["o1", "Safer school gate at pickup time", "Tirupati Ward 12 · Grades 6–9 · 2 weeks", "rec-3", true, "#F97316", "Community", "Fri, 5 Dec", 14, 60],
    ["o2", "Get more kids into the library", "Accord School · Grades 3–6 · 3 weeks", "rec-2", true, "#A855F7", "School", "Fri, 12 Dec", 21, 40],
    ["o3", "A plastic-free classroom week", "Family + school · Grades 3–8 · 1 week", "x-lifelab", false, "#22C55E", "Family", "Mon, 8 Dec", 17, 35],
    ["o4", "Mini market for a cause", "Accord School · Grades 5–8 · 3 weeks", "x-bazaar", false, "#F59E0B", "School", "Mon, 15 Dec", 24, 70],
    ["o5", "Speak up for your street", "Tirupati Ward 12 · Grades 4–9 · 2 weeks", "x-mic", false, "#7C3AED", "Community", "Wed, 10 Dec", 19, 45],
    ["o6", "Design a reading corner", "Accord School · Grades 3–5 · 2 weeks", "x-books", false, "#0A84FF", "School", "Thu, 18 Dec", 27, 40],
  ];
  const STAR_HISTORY = [["Zero-waste lunchbox week", 30, "14 Nov"], ["Neighbourhood clean-up", 50, "18 Oct"], ["Plant a tree drive", 40, "20 Sep"]];
  const submitted = new Set(), joinedCh = new Set();
  const starsEarned = () => STAR_HISTORY.reduce((a, x) => a + x[1], 0);
  const chPic = (img, photo, c) => `<span class="ch3-pic ${photo ? "is-photo" : "is-obj"}" style="--c:${c}">${art(img)}</span>`;
  const starChip = (n, earned) => `<span class="ch3-stars${earned ? " earned" : ""}">${ic("star")}${earned ? "+" : ""}${n}</span>`;
  const daysTag = (d) => `<span class="ch3-due${d <= 7 ? " soon" : ""}">${ic("clock")}${d} day${d === 1 ? "" : "s"} left</span>`;
  function myCard([id, t, where, img, photo, c, st, due, days, stars, x], i) {
    const sub = submitted.has(id);
    const action = st === "done" ? `<a class="btn btn-ghost btn-sm" href="#/passport/timeline">${ic("award")}View evidence</a>`
      : `<button class="btn btn-acc btn-sm" data-submit="${id}" data-stars="${stars}" aria-pressed="${sub}">${sub ? `${ic("check")}Submitted · in review` : `${ic("plus")}Submit work`}</button>`;
    return `<article class="ch3 rv" style="--c:${c};--i:${i}">${chPic(img, photo, c)}<span class="ch3-tag">${st === "done" ? "Completed" : "In progress"}</span>${starChip(stars, st === "done")}
      <div class="ch3-b"><b>${t}</b><small>${where}</small>
        ${st === "done" ? `<span class="ch3-dl ok">${ic("check")}${due} · ${stars} stars earned</span>` : `<span class="ch3-dl">${ic("cal")}Submit by ${due}${daysTag(days)}</span>`}
        ${x.step ? `<div class="seg4">${[1, 2, 3, 4].map((n) => `<i class="${n <= x.step ? "f" : ""}" style="--d:${n}"></i>`).join("")}</div><small class="ch3-steps">Understand · Ideate · Build · Present</small>` : ""}
        ${x.idea ? `<p class="idea">Aarav's idea: “${x.idea}”</p>` : ""}
        ${action}</div></article>`;
  }
  function openCard([id, t, where, img, photo, c, kind, due, days, stars], i) {
    const j = joinedCh.has(id);
    return `<article class="ch3 rv" style="--c:${c};--i:${i}">${chPic(img, photo, c)}<span class="ch3-tag">${kind}</span>${starChip(stars)}
      <div class="ch3-b"><b>${t}</b><small>${where}</small><span class="ch3-dl">${ic("cal")}Join by ${due}${daysTag(days)}</span>
        <button class="btn btn-acc btn-sm" data-joinch="${id}" data-stars="${stars}" data-due="${due}" aria-pressed="${j}">${j ? `${ic("check")}Joined` : `Join challenge ${ic("arrow")}`}</button></div></article>`;
  }
  function starsCard() {
    const n = starsEarned(), goal = 150, open = MY_CH.filter((c) => c[6] === "active").reduce((a, c) => a + c[9], 0);
    return `<section class="stars3 rv"><span class="stars3-obj float">${art("t-stickers")}</span>
      <div class="stars3-t"><small>${DEMO.child}'s LifeLab stars</small><b><span data-count="${n}">0</span> stars earned</b>
        <span class="prow-bar"><span class="bar3"><span style="--w:${Math.round(n / goal * 100)}%"></span></span><em>${n}/${goal}</em></span>
        <small>${goal - n} more for the <b>Bronze Changemaker</b> badge · ${open} stars waiting in active challenges</small></div>
      <ul class="stars3-h">${STAR_HISTORY.map(([t, s, d]) => `<li><span>${t}<small>${d}</small></span><em>+${s}</em></li>`).join("")}</ul></section>`;
  }
  function lifelabPane(tab) {
    if (tab === "challenges") return hero(`Real problems. ${swoosh("Real impact.")}`, `${DEMO.child}'s challenges from school, family and community.`,
        `<span class="art-main art-obj">${art("x-lifelab", "")}</span>`) + starsCard() + `
      <section class="sec3">${secHead("ac-h", "Active challenges", "Submit before the deadline to earn the stars.")}
        <div class="grid3 g-ch">${MY_CH.filter((c) => c[6] === "active").map(myCard).join("")}</div></section>
      <section class="sec3">${secHead("dn-h", "Completed", "Verified by a Skill Champion.")}
        <div class="grid3 g-ch">${MY_CH.filter((c) => c[6] === "done").map(myCard).join("")}</div></section>`;
    if (tab === "open") return banner("search", "Open challenges", "Matched to grade and interests. Earn stars for every finished challenge.") + `
      <div class="grid3 g-ch">${[...OPEN_CH].sort((a, b) => a[8] - b[8]).map(openCard).join("")}</div>`;
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
    // quizzes
    $$("[data-quiz]", scope).forEach((b) => b.addEventListener("click", () => openQuiz(b.dataset.quiz)));
    // self-check: one choice per skill
    $$("[data-sc]", scope).forEach((b) => b.addEventListener("click", () => {
      selfCheck[b.dataset.sc] = +b.dataset.v;
      $$(`[data-sc="${b.dataset.sc}"]`, scope).forEach((x) => x.setAttribute("aria-checked", x === b));
    }));
    const scs = $("#sc-save", scope);
    if (scs) scs.addEventListener("click", () => {
      const n = Object.keys(selfCheck).length;
      toast(n ? `Saved. ${n} of ${SKILLS.length} skills checked. Your teacher can see how you feel.` : "Pick how you feel about at least one skill first.");
    });
    // LifeLab: submit work, join a challenge
    $$("[data-submit]", scope).forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.submit;
      if (submitted.has(id)) { toast("Already submitted. A Skill Champion is reviewing it."); return; }
      submitted.add(id); b.setAttribute("aria-pressed", "true"); b.innerHTML = `${ic("check")}Submitted · in review`;
      toast(`Submitted! A Skill Champion reviews it within 3 days. +${b.dataset.stars} stars when it's approved.`);
    }));
    $$("[data-joinch]", scope).forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.joinch, on = !joinedCh.has(id);
      on ? joinedCh.add(id) : joinedCh.delete(id);
      b.setAttribute("aria-pressed", on); b.innerHTML = on ? `${ic("check")}Joined` : `Join challenge ${ic("arrow")}`;
      toast(on ? `${DEMO.child} joined. Join by ${b.dataset.due} and earn up to ${b.dataset.stars} stars.` : "Left the challenge.");
    }));
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
      $$(".rv:not(.in)", scope).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) { el.style.transition = "none"; el.classList.add("in"); requestAnimationFrame(() => requestAnimationFrame(() => (el.style.transition = ""))); }
        else io.observe(el);
      });
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
      const all = $$("[data-act]", scope), n = all.filter((x) => done.has(x.dataset.act)).length, wn = $("#wk-n", scope), wb = $("#wk-bar", scope);
      if (wn) wn.textContent = n; if (wb) wb.style.setProperty("--w", Math.round(n / all.length * 100) + "%");
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
