/* Haciendo Música — estructura, router y páginas */
window.S = window.S || {};
(function (S) {
  const { el } = S.ui, U = S.ui, A = S.audio, V = S.viz, C = S.content, L = S.labs, W = S.widgets, T = S.T, LANG = S.i18n.lang;

  // contenido en el idioma elegido (en inglés, las citas se muestran en su versión original)
  if (LANG === "en") Object.values(C.QUOTES).forEach((q) => (q.es = q.en));
  S.i18n.deep(C);

  // cleanup registry for route changes
  let leaves = [];
  S.onLeave = (fn) => leaves.push(fn);
  const leave = () => { leaves.forEach((f) => { try { f(); } catch (e) {} }); leaves = []; V.stopAll(); A.stopAll(); };

  const LABS = [
    ["beat", "beat", "ritmo"], ["mix", "mix", "mezcla"], ["arreglo", "arrange", "arreglo"], ["eq", "eq", "mezcla"],
    ["comp", "comp", "mezcla"], ["master", "master", "mastering"], ["oido", "ear", "escucha"], ["synth", "synth", "ritmo"],
  ];
  const labDef = (id) => { const r = LABS.find((x) => x[0] === id); return r && Object.assign({ id: r[0], lesson: r[2] }, L[r[1]]); };
  const LAB_QUOTE = { beat: "e_boring", mix: "b_recede", arreglo: "e_drop1st", eq: "r_cutfirst", comp: "m_dull", master: "r_100", oido: "m_listen", synth: "e_melody" };

  const progress = U.store.get("progress", {});
  const setDone = (id) => { progress[id] = true; U.store.set("progress", progress); paintProgress(); };
  const progPill = el("span", { class: "progress-pill" });
  const paintProgress = () => { const n = C.LESSONS.filter((l) => progress[l.id]).length; progPill.innerHTML = "<b>" + n + "/" + C.LESSONS.length + "</b><span> " + T("lecciones") + "</span>"; };

  // ------------------------------------------------------------------ icons
  const I = (d, extra) => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"' + (extra || "") + ">" + d + "</svg>";
  const IC = {
    home: I('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
    book: I('<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>'),
    lab: I('<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>'),
    shelf: I('<path d="M4 20V5M8 20V5M12 20l3-15 4 1-3 14"/><path d="M3 20h18"/>'),
    abc: I('<path d="M4 18l4-12 4 12M5.5 14h5"/><path d="M14 6h4a2.5 2.5 0 0 1 0 5h-4zM14 11h4.5a2.5 2.5 0 0 1 0 5H14z"/>'),
    search: I('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="#fff" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    eye: I('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', ' stroke="#fff"'),
    clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', ' stroke="#fff"'),
    quote: I('<path d="M7 7h4v4c0 3-2 5-4 6M15 7h4v4c0 3-2 5-4 6"/>', ' stroke="#fff"'),
    dollar: I('<path d="M4 6h16M4 12h10M4 18h13"/>', ' stroke="#fff"'),
    chev: I('<path d="M9 6l6 6-6 6"/>'),
    edit: I('<path d="M4 20h4L19 9l-4-4L4 16z"/>'),
    list: I('<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>'),
    dots: I('<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>'),
    grid: I('<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>'),
    sliders: I('<path d="M6 4v16M12 4v16M18 4v16"/><rect x="4" y="13" width="4" height="3" fill="currentColor"/><rect x="10" y="7" width="4" height="3" fill="currentColor"/><rect x="16" y="11" width="4" height="3" fill="currentColor"/>'),
    wave: I('<path d="M2 12c2.5-6 4.5-6 7 0s4.5 6 7 0 4-4 6-2"/>'),
    target: I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-2 8 10-13h-7z" fill="#121212"/></svg>',
    bell: I('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>', ' stroke="#fff"'),
    star: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2l9 30 30-14-14 30 30 9-30 9 14 30-30-14-9 30-9-30-30 14 14-30L2 50l30-9L18 11l30 14z" fill="#121212"/></svg>',
    spark: '<svg viewBox="0 0 60 60" aria-hidden="true"><g stroke="#2ebd59" stroke-width="3" stroke-linecap="round"><path d="M30 4v10M30 46v10M4 30h10M46 30h10M12 12l7 7M41 41l7 7M48 12l-7 7M19 41l-7 7"/></g></svg>',
    flask: I('<path d="M12 3v4M5 7l2 2M19 7l-2 2"/><path d="M8 21h8M9 21v-6a3 3 0 0 1 6 0v6"/>'),
  };

  const quoteEl = (id, compact) => {
    const qd = C.QUOTES[id]; if (!qd) return null;
    const b = C.BOOKS[qd.b];
    return el("figure", { class: "quote", style: { "--qc": b.color } },
      el("blockquote", null, T("«{q}»", { q: qd.es })),
      compact || LANG === "en" ? null : el("div", { class: "orig", lang: "en" }, "“" + qd.en + "”"),
      el("figcaption", null, el("b", null, b.author), " · ", el("i", null, b.title), " · " + qd.where));
  };

  // ------------------------------------------------------------------ shell
  const NAV = [["", "Inicio", IC.home], ["lecciones", "Lecciones", IC.book], ["lab", "Laboratorio", IC.lab], ["bibliografia", "Bibliografía", IC.shelf], ["glosario", "Glosario", IC.abc]];
  const navLinks = NAV.map(([h, t, ic]) => el("a", { href: "#" + h, html: ic + "<span>" + T(t) + "</span>" }));
  const brand = el("a", { class: "brand", href: "#", html: '<svg class="brand-mark" viewBox="0 0 40 30" aria-hidden="true"><rect x="1.5" y="1.5" width="37" height="27" rx="7" fill="#ee3a2c" stroke="#121212" stroke-width="2.5"/><path d="M6 15h5l2-6 3 12 3-15 3 13 2-4h10" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></svg><b>Haciendo Música</b>' });
  const searchIn = el("input", { type: "search", id: "topsearch", placeholder: "Buscar en el glosario: sidechain, LUFS, reverb…", "aria-label": "Buscar en el glosario" });
  searchIn.addEventListener("keydown", (e) => { if (e.key === "Enter") { S.glossQuery = searchIn.value; if (location.hash === "#glosario") route(); else location.hash = "glosario"; } });
  // pestaña de idioma: siempre visible en la barra superior
  const langMenu = el("details", { class: "lang" },
    el("summary", { "aria-label": "Lang", html: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg><span>Lang</span><b>' + LANG.toUpperCase() + "</b>" }),
    el("div", { class: "lang-menu" }, S.i18n.LANGS.map(([c, name]) => el("button", { type: "button", lang: c, "aria-current": c === LANG ? "true" : null, onclick: () => S.i18n.set(c) }, el("b", null, c.toUpperCase()), name))));
  document.addEventListener("click", (e) => { if (langMenu.open && !langMenu.contains(e.target)) langMenu.open = false; });
  const header = el("header", { class: "topbar" }, el("div", { class: "bar" }, brand, el("label", { class: "searchbox", html: IC.search }, searchIn), langMenu, progPill));
  const sideCard = el("a", { class: "side-card", href: "#lab-beat", html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2 6 6-2-4 5 5 4-6 1 1 6-4-4-4 4 1-6-6-1 5-4-4-5 6 2z" fill="#121212" stroke="#121212" stroke-width="1"/></svg><b>' + T("Armá tu primer beat") + '</b><span>→</span>' });
  const side = el("aside", { class: "side" }, el("nav", { class: "nav", "aria-label": "Secciones" }, navLinks), sideCard);
  const main = el("main", { id: "main" });
  const DISCLAIMER = "Contenido elaborado con inteligencia artificial (Claude, de Anthropic) a partir de esos libros, con fines exclusivamente educativos. Puede contener errores o simplificaciones: no reemplaza la lectura de los libros originales. Las citas son breves y sus derechos pertenecen a los autores y editoriales.";
  const footer = el("footer", { class: "footer" }, el("div", { class: "wrap" },
    el("span", null, "Haciendo Música · Hecho con IA a partir de cinco libros de producción, con fines educativos. Todo el audio se sintetiza en vivo en tu navegador."),
    el("span", null, el("a", { href: "#bibliografia" }, "Ver la bibliografía"))));
  document.body.append(header, el("div", { class: "shell" }, side, main), footer);
  paintProgress();

  // ------------------------------------------------------------------ home (dashboard)
  const P = {};
  const nextLesson = () => C.LESSONS.find((l) => !progress[l.id]) || C.LESSONS[0];

  P.home = (root) => {
    const dash = el("div", { class: "dash" });
    root.append(dash);

    // hero
    dash.append(el("section", { class: "d-hero" },
      el("div", { class: "copy" },
        el("div", { class: "logo-row" }, el("span", { class: "play-tile", html: IC.play }), el("h1", null, "Hacé tu sonido")),
        el("p", null, "Un acercamiento a la producción musical con un enfoque visual y sonoro, basado en lecciones cortas e ideas de los libros que forman productores, con un laboratorio a disposición para probar sonidos y hacer tus propias recetas."),
        el("div", { class: "btn-row" }, el("a", { class: "btn primary", href: "#leccion-" + nextLesson().id }, "Empezar a aprender"), el("a", { class: "btn", href: "#lab" }, "Abrir el laboratorio"))),
      el("div", { class: "art", "aria-hidden": "true" },
        el("span", { class: "spark", html: IC.spark }),
        el("div", { class: "tilt" }, el("i", { html: IC.play })),
        el("a", { class: "verbs", href: "#lab", tabindex: "-1" }, el("b", null, "Creá"), el("b", null, "Mezclá"), el("b", null, "Masterizá"), el("b", null, "Terminá"), el("span", null, "→")))));

    // stat tiles
    const totalMin = C.LESSONS.reduce((a, l) => a + l.mins, 0);
    const tile = (cls, ic, lab, val, sub, href) => el("a", { class: "stat-tile " + cls, href }, el("span", { class: "ic", html: ic }), el("span", { class: "lab" }, lab), el("span", { class: "val" }, val), el("span", { class: "sub" }, sub));
    dash.append(el("div", { class: "stats" },
      tile("y", IC.book, "Lecciones", String(C.LESSONS.length), T("{n} min de lectura", { n: totalMin }), "#lecciones"),
      tile("b", IC.lab, "Laboratorios", String(LABS.length), "todo suena en vivo", "#lab"),
      tile("g", IC.quote, "Citas", String(Object.keys(C.QUOTES).length), "de 5 libros", "#bibliografia"),
      tile("r", IC.abc, "Glosario", String(C.GLOSSARY.length), "términos explicados", "#glosario")));

    // featured lesson
    const nl = nextLesson(), thumb = el("canvas");
    requestAnimationFrame(() => {
      const { g, w, h } = V.fit(thumb, thumb.clientHeight || 150);
      g.fillStyle = V.css(nl.color); g.fillRect(0, 0, w, h);
      g.fillStyle = "#121212"; g.fillRect(0, h * 0.62, w, h);
      g.strokeStyle = "#121212"; g.lineWidth = 3; g.beginPath();
      for (let x = 0; x <= w; x++) { const y = h * 0.42 - Math.sin(x / w * Math.PI * 5) * h * 0.16 * Math.sin(x / w * Math.PI); x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
      g.fillStyle = "#fff"; g.font = "italic 800 " + Math.round(h * 0.2) + "px " + V.css("--f-display"); g.fillText(T("Lección {n}", { n: nl.n }), 12, h - 14);
    });
    const act = (ic, t, href) => el("a", { href, html: '<span class="ai">' + ic + "</span><span>" + T(t) + '</span><span class="chev">' + IC.chev + "</span>" });
    dash.append(el("section", { class: "card feat" },
      el("div", { class: "card-h" }, el("h3", null, progress[nl.id] ? "Para repasar" : "Tu próxima lección")),
      el("a", { class: "thumb", href: "#leccion-" + nl.id, "aria-label": T("Abrir {t}", { t: nl.title }) }, thumb, el("span", { class: "pl" }, el("i", { html: IC.play }))),
      el("h3", null, nl.title), el("div", { class: "meta" }, T("{m} min · {b} libros", { m: nl.mins, b: nl.sources.length }) + " · " + nl.kicker),
      el("div", { class: "act-list" },
        act(IC.book, "Leer la lección", "#leccion-" + nl.id),
        act(IC.lab, "Abrir su laboratorio", "#lab-" + (nl.labs[0] || "beat")),
        act(IC.edit, T("Cuestionario ({n} preguntas)", { n: nl.quiz.length }), "#leccion-" + nl.id),
        act(IC.dots, "Ver todas las lecciones", "#lecciones"))));

    // live spectrum chart + band energy
    const plot = el("canvas");
    let g = null, an = null, genre = L.GENRES[1];
    const sel = el("select", { id: "dash-genre", "aria-label": "Género del groove" }, L.GENRES.map((gn, i) => el("option", { value: String(i) }, gn.name + " · " + gn.bpm + " BPM")));
    sel.value = "1";
    const startG = () => { if (g) g.dispose(); g = A.track(new A.Groove({ bpm: genre.bpm, lead: true })); g.pattern = L.patternFrom(genre); g.mutes = {}; an = V.mkAnalyser(4096, 0.85); g.connect(an).connect(A.master); g.start(); };
    sel.addEventListener("change", () => { genre = L.GENRES[+sel.value]; if (g && g.playing) startG(); });
    const play = U.playBtn("Escuchar", (on) => { if (on) startG(); else g && g.stop(); });
    const IDLE = [12, 27, 14, 18, 12, 10, 7];
    const rows = V.BANDS.map((b, i) => { const bar = el("i", { style: { width: IDLE[i] * 2.5 + "%", background: V.css(b.v) } }), val = el("b", null, IDLE[i].toFixed(1) + "%"); return { bar, val, node: el("div", { class: "band-row" }, el("span", null, b.name + " · " + V.fmtHz(b.from) + "–" + V.fmtHz(b.to)), val, el("div", { class: "bar" }, bar)) }; });
    dash.append(el("section", { class: "card chart" },
      el("div", { class: "card-h" }, el("h2", null, "Señal en vivo"), el("div", { class: "btn-row" }, sel, play)),
      el("div", { class: "plot" }, plot),
      el("div", { class: "band-list" }, el("div", { class: "bt" }, "Energía por banda"), rows.map((r) => r.node))));
    let tt = 0, frame = 0;
    V.loop(() => {
      const { g: x, w, h } = V.fit(plot, 260);
      x.fillStyle = V.css("--panel"); x.fillRect(0, 0, w, h);
      const padB = 22, H = h - padB;
      x.strokeStyle = V.css("--line"); x.lineWidth = 1; x.font = "600 11px " + V.css("--f-ui"); x.fillStyle = V.css("--muted");
      for (let i = 1; i <= 4; i++) { const y = Math.round(H * i / 5) + 0.5; x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke(); }
      [50, 100, 200, 500, 1000, 2000, 5000, 10000].forEach((f) => { const xx = V.fx(f, w); x.fillText(V.fmtHz(f), xx - 8, h - 6); });
      const pts = [];
      const playing = an && g && g.playing;
      if (playing) {
        const n = an.frequencyBinCount; if (!an._buf || an._buf.length !== n) an._buf = new Float32Array(n);
        an.getFloatFrequencyData(an._buf); const sr = an.context.sampleRate;
        for (let px = 0; px <= w; px += 3) { const f = V.xf(px, w), bin = Math.min(n - 1, Math.round(f / (sr / 2) * n)); let s = -200; const sp = Math.max(1, Math.round(bin * 0.03)); for (let k = bin - sp; k <= bin + sp; k++) if (k >= 0 && k < n) s = Math.max(s, an._buf[k]); pts.push([px, H - (Math.max(-100, Math.min(-15, s)) + 100) / 85 * H * 0.95]); }
        if (++frame % 4 === 0) {
          const pw = V.BANDS.map((b) => { let s = 0, c = 0; for (let k = Math.floor(b.from / (sr / 2) * n); k <= Math.min(n - 1, Math.ceil(b.to / (sr / 2) * n)); k++) { s += Math.pow(10, an._buf[k] / 10); c++; } return c ? s / c * Math.sqrt(b.to / b.from) : 0; });
          const tot = pw.reduce((a, b) => a + b, 0) || 1;
          rows.forEach((r, i) => { const p = pw[i] / tot * 100; r.bar.style.width = Math.min(100, p * 2.5) + "%"; r.val.textContent = p.toFixed(1) + "%"; });
        }
      } else {
        tt += 0.012;
        for (let px = 0; px <= w; px += 3) { const f = px / w; const v = 0.55 - f * 0.32 + 0.07 * Math.sin(f * 14 + tt * 2) + 0.04 * Math.sin(f * 37 - tt * 3) + 0.14 * Math.exp(-Math.pow((f - 0.2) * 9, 2)) * (0.6 + 0.4 * Math.sin(tt * 5)); pts.push([px, H - v * H]); }
      }
      x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
      x.lineTo(w, H); x.lineTo(0, H); x.closePath();
      const gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, V.css("--b-sub")); gr.addColorStop(1, V.css("--panel"));
      x.globalAlpha = 0.55; x.fillStyle = gr; x.fill(); x.globalAlpha = 1;
      x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.strokeStyle = V.css("--ink"); x.lineWidth = 2.5; x.stroke();
      // peak marker like a tooltip
      let pk = null; pts.forEach((p) => { if (p[0] > w * 0.06 && p[0] < w * 0.94 && (!pk || p[1] < pk[1])) pk = p; });
      const label = V.fmtHz(V.xf(pk[0], w)) + " Hz";
      x.font = "700 12px " + V.css("--f-ui"); const tw = x.measureText(label).width + 14;
      const lx = Math.min(w - tw - 2, Math.max(2, pk[0] - tw / 2)), ly = Math.max(2, pk[1] - 34);
      x.fillStyle = V.css("--ink"); x.fillRect(lx, ly, tw, 22); x.fillStyle = "#fff"; x.fillText(label, lx + 7, ly + 15);
      x.beginPath(); x.arc(pk[0], pk[1], 5, 0, 7); x.fillStyle = V.css("--panel"); x.fill(); x.lineWidth = 2.5; x.strokeStyle = V.css("--ink"); x.stroke();
    });

    // tools
    const tl = (ic, t, href) => el("a", { href, html: '<span class="ti">' + ic + "</span><span>" + T(t) + "</span>" });
    dash.append(el("section", { class: "card tools" },
      el("div", { class: "card-h" }, el("h3", null, "Herramientas")),
      tl(IC.grid, "Caja de ritmos", "#lab-beat"), tl(IC.target, "Mezcla en 3D", "#lab-mix"), tl(IC.sliders, "Ecualizador", "#lab-eq"),
      tl(IC.wave, "Diseño de sonido", "#lab-synth"), tl(IC.eye.replace(' stroke="#fff"', ""), "Entrenamiento auditivo", "#lab-oido")));

    // lesson list
    const list = el("section", { class: "card lesson-list" }, el("div", { class: "card-h" }, el("h2", null, "Lecciones"), el("a", { href: "#lecciones" }, "Ver todas →")));
    C.LESSONS.forEach((l) => {
      const cv = el("canvas");
      requestAnimationFrame(() => { const { g: x, w, h } = V.fit(cv, 54); x.fillStyle = V.css("--screen"); x.fillRect(0, 0, w, h); x.strokeStyle = V.css(l.color); x.lineWidth = 2.5; x.beginPath(); for (let i = 0; i <= w; i++) { const p = (i / w) * Math.PI * 4; const y = h * 0.7 - (l.wave === 2 ? (Math.sin(p) > 0 ? 0.6 : -0.6) : l.wave === 1 ? ((p / Math.PI) % 2) - 1 : Math.sin(p * (1 + l.n * 0.3))) * h * 0.18; i ? x.lineTo(i, y) : x.moveTo(i, y); } x.stroke(); });
      list.append(el("a", { class: "ll-row", href: "#leccion-" + l.id },
        el("span", { class: "n" }, String(l.n)),
        el("span", { class: "th" }, cv, el("b", null, l.kicker)),
        el("span", null, el("h4", null, l.title), el("span", { class: "m" }, T("{m} min · {b} libros", { m: l.mins, b: l.sources.length }))),
        el("span", { class: "st", style: { color: progress[l.id] ? V.css("--ok") : V.css("--ink") } }, progress[l.id] ? "Leída ✓" : "Nueva", el("small", null, T("{n} preguntas", { n: l.quiz.length })))));
    });
    dash.append(list);

    // quote feed
    const AUTH = { burgess: "RB", swmp: "TS", swedm: "TS", rogers: "JR", habits: "JT" };
    const feed = el("section", { class: "card quote-feed" }, el("div", { class: "card-h" }, el("h2", null, "Citas de los libros"), el("a", { href: "#bibliografia" }, "Ver todas →")));
    ["h_wins", "b_museum", "e_drop1st", "r_loudplay", "m_dull"].forEach((id) => {
      const q = C.QUOTES[id], b = C.BOOKS[q.b];
      feed.append(el("div", { class: "qf-row" }, el("span", { class: "av", style: { background: b.color } }, AUTH[q.b]),
        el("div", null, el("div", { class: "who" }, b.author, el("span", null, b.title)), el("p", null, T("«{q}»", { q: q.es })),
          el("div", { class: "ft" }, el("span", null, q.where), el("a", { href: "#bibliografia" }, "Ver el libro")))));
    });
    dash.append(feed);

    // promo
    dash.append(el("section", { class: "card promo" }, el("span", { html: IC.bolt.replace("#121212", "#ffd21f") }),
      el("h3", null, "Mejor sonido, más temas terminados."),
      el("p", null, "Quince minutos por día alcanzan. Probá el desafío de 30 días de Music Habits."),
      el("a", { class: "btn dark", href: "#leccion-mente" }, "Empezar →")));

    // about + banner
    const ab = aboutBlock(); ab.classList.add("d-about"); dash.append(ab);
    dash.append(el("section", { class: "banner" },
      el("span", { class: "star", html: IC.star }),
      el("span", { class: "big" }, "Producí"),
      el("p", null, "Siete lecciones, ocho laboratorios y un glosario para pasar del loop al tema terminado."),
      el("div", { class: "act" }, el("span", { class: "bell", html: IC.bell }), el("a", { class: "btn", href: "#leccion-oficio" }, "Empezar ahora"))));
  };

  const aboutBlock = () => el("section", { class: "about", "aria-labelledby": "about-h" },
    el("div", { class: "about-text" },
      el("div", { class: "eyebrow" }, "Sobre este proyecto"),
      el("h2", { id: "about-h" }, "Lecciones armadas con cinco libros de producción"),
      el("p", null, "Cada lección de Haciendo Música se escribió leyendo estos libros: sus ideas, sus cifras y sus casos prácticos están reorganizados en un recorrido corto y visual. Cuando un dato sale de un libro, se nombra al autor; cuando es una cita, aparece en el idioma original con su traducción. Los laboratorios sirven para escuchar y ver lo que los libros explican con palabras."),
      el("p", { class: "disclaimer" }, DISCLAIMER)),
    el("ul", { class: "about-books" }, Object.values(C.BOOKS).map((b) => el("li", { style: { "--bk": b.color } }, el("a", { href: "#bibliografia" }, el("b", null, b.title), el("span", null, b.author))))));

  const moduleGrid = () => el("div", { class: "modules" }, C.LESSONS.map((l) => {
    const cv = el("canvas", { class: "wave" });
    requestAnimationFrame(() => V.waveIcon(cv, l.wave, V.css("--ink")));
    return el("a", { class: "module-card" + (progress[l.id] ? " done" : ""), href: "#leccion-" + l.id, style: { "--mc": V.css(l.color) } },
      cv, el("span", { class: "num" }, String(l.n).padStart(2, "0")), el("h3", null, l.title), el("p", null, l.lede),
      el("div", { class: "meta" }, el("span", null, T("{m} min · {b} libros", { m: l.mins, b: l.sources.length })), progress[l.id] ? el("span", { class: "done-chip", html: U.icon.check + " " + T("leída") }) : el("span", null, l.kicker)));
  }));

  const labGrid = () => el("div", { class: "labs" }, LABS.map(([id]) => {
    const d = labDef(id), cv = el("canvas");
    requestAnimationFrame(() => {
      const { g, w, h } = V.fit(cv, 90); const col = V.css(d.color);
      g.clearRect(0, 0, w, h); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2.5;
      if (id === "beat") for (let i = 0; i < 16; i++) { g.globalAlpha = [0, 4, 8, 12, 6, 14].includes(i) ? 1 : 0.2; g.fillRect(i * (w / 16) + 2, h / 2 - 10, w / 16 - 4, 20); }
      else if (id === "eq" || id === "oido") { g.beginPath(); for (let x = 0; x <= w; x++) { const y = h / 2 - 26 * Math.exp(-Math.pow((x / w - (id === "eq" ? 0.35 : 0.62)) * 7, 2)) + (id === "eq" ? 14 * Math.exp(-Math.pow((x / w - 0.8) * 6, 2)) : 0); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      else if (id === "comp") { g.beginPath(); g.moveTo(0, h - 6); g.lineTo(w * 0.55, h * 0.35); g.lineTo(w, h * 0.2); g.stroke(); }
      else if (id === "master") for (let x = 0; x < w; x += 2) { const a = Math.min(0.42, 0.5 * Math.abs(Math.sin(x * 0.7)) * (0.6 + 0.4 * Math.sin(x * 0.05))); g.fillRect(x, h / 2 - a * h, 1, a * h * 2); }
      else if (id === "mix") [[0.5, 0.7, 12], [0.3, 0.45, 8], [0.72, 0.4, 9], [0.5, 0.3, 7], [0.18, 0.62, 6]].forEach(([a, b, r]) => { g.beginPath(); g.arc(a * w, b * h, r, 0, 7); g.fill(); });
      else if (id === "arreglo") { g.beginPath(); [[0, 0.8], [0.2, 0.6], [0.3, 0.75], [0.42, 0.35], [0.45, 0.15], [0.65, 0.15], [0.67, 0.7], [0.8, 0.3], [0.82, 0.15], [1, 0.6]].forEach(([a, b], i) => (i ? g.lineTo(a * w, b * h) : g.moveTo(a * w, b * h))); g.stroke(); }
      else { g.beginPath(); for (let x = 0; x <= w; x++) { const y = h / 2 - Math.sin(x * 0.12) * 20 * Math.exp(-x / w * 1.5); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    });
    return el("a", { class: "lab-card", href: "#lab-" + id, style: { "--lc": V.css(d.color) } }, el("span", { class: "tag" }, d.tag), cv, el("h3", null, d.title), el("p", null, d.desc));
  }));

  P.lessons = (root) => {
    root.append(el("div", { class: "eyebrow" }, "El programa"), el("h1", { class: "page-title" }, "Siete lecciones"),
      el("p", { class: "page-lede" }, "De quién hace qué en un estudio hasta cómo terminar un tema. Cada lección mezcla texto corto, citas de los libros, figuras que suenan, casos reales y un mini cuestionario. Los recuadros \"Profundizar\" son para cuando quieras ir más a fondo."),
      moduleGrid());
  };

  P.lesson = (root, id) => {
    const l = C.LESSONS.find((x) => x.id === id);
    if (!l) return P.notFound(root);
    root.style.setProperty("--mc", V.css(l.color));
    const toc = el("nav", { class: "toc", "aria-label": "En esta lección" }, el("div", { class: "eyebrow" }, "En esta lección"));
    const body = el("article", { class: "prose" });
    let sn = 0;
    l.blocks.forEach((b) => {
      if (b.t === "p") body.append(el("p", { html: b.html }));
      else if (b.t === "h") { sn++; const hid = "s" + sn; body.append(el("h2", { id: hid }, el("span", { class: "sn" }, String(sn).padStart(2, "0")), b.text)); toc.append(el("a", { href: "#leccion-" + l.id, onclick: (e) => { e.preventDefault(); document.getElementById(hid).scrollIntoView({ behavior: "smooth" }); } }, b.text)); }
      else if (b.t === "quote") body.append(quoteEl(b.id));
      else if (b.t === "list") body.append(el("ul", null, b.items.map((i) => el("li", null, i))));
      else if (b.t === "widget") { try { body.append(W[b.w](b.opts)); } catch (e) { console.error(b.w, e); } }
      else if (b.t === "case") body.append(el("section", { class: "callout case" }, el("header", null, el("span", { class: "dot" }), T("Caso práctico") + " · " + b.title), el("div", { html: b.html })));
      else if (b.t === "tip") body.append(el("section", { class: "callout tip" }, el("header", null, el("span", { class: "dot" }), b.title), el("div", { html: b.html })));
      else if (b.t === "deep") body.append(el("details", { class: "deep" }, el("summary", null, b.title), el("div", { html: b.html })));
      else if (b.t === "lab") { const d = labDef(b.id); body.append(el("a", { class: "lab-card", href: "#lab-" + b.id, style: { "--lc": V.css(d.color), margin: "28px 0", fontFamily: "var(--f-ui)" } }, el("span", { class: "tag" }, T("Ir al laboratorio") + " · " + T(d.tag)), el("h3", null, T(d.title) + " →"), el("p", null, b.text))); }
    });
    const quiz = el("section", { class: "quiz" }, el("h2", null, "Comprobá lo que aprendiste"));
    toc.append(el("a", { href: "#leccion-" + l.id, onclick: (e) => { e.preventDefault(); quiz.scrollIntoView({ behavior: "smooth" }); } }, "Cuestionario"));
    const answered = new Set();
    const result = el("p", { class: "eyebrow", style: { margin: "12px 0 0" } });
    let score = 0;
    l.quiz.forEach((qq, qi) => {
      const why = el("p", { class: "why", hidden: true });
      const opts = qq.o.map((o, oi) => {
        const b = el("button", { type: "button", class: "opt" }, o);
        b.addEventListener("click", () => {
          if (answered.has(qi)) return; answered.add(qi);
          if (oi === qq.a) score++;
          opts.forEach((x, k) => { if (k === qq.a) x.classList.add("right"); else if (k === oi) x.classList.add("wrong"); x.disabled = true; });
          why.hidden = false; why.textContent = T(oi === qq.a ? "Correcto." : "No exactamente.") + " " + qq.why;
          if (answered.size === l.quiz.length) { result.textContent = T("{s} de {n} correctas · lección marcada como leída", { s: score, n: l.quiz.length }); setDone(l.id); }
        });
        return b;
      });
      quiz.append(el("div", { class: "q" }, el("p", { class: "qt" }, (qi + 1) + ". " + qq.q), el("div", { class: "opts" }, opts), why));
    });
    quiz.append(result);
    body.append(quiz);
    const i = C.LESSONS.indexOf(l), prev = C.LESSONS[i - 1], next = C.LESSONS[i + 1];
    body.append(el("div", { class: "lesson-nav" },
      prev ? el("a", { class: "btn", href: "#leccion-" + prev.id, html: U.icon.back + "<span>" + prev.title + "</span>" }) : el("span"),
      next ? el("a", { class: "btn primary", href: "#leccion-" + next.id, html: "<span>" + next.title + "</span>" + U.icon.arrow }) : el("a", { class: "btn primary", href: "#lab" }, "Ir al laboratorio")));
    root.append(
      el("header", { class: "lesson-head" },
        el("div", { class: "num" }, String(l.n).padStart(2, "0")),
        el("div", { class: "eyebrow" }, T("Lección {n}", { n: l.n }) + " · " + l.kicker + " · " + l.mins + " min"),
        el("h1", null, l.title), el("p", { class: "lede" }, l.lede),
        el("div", { class: "sources" }, l.sources.map((s) => el("span", { class: "src-chip" }, C.BOOKS[s].author + " · " + C.BOOKS[s].title)))),
      el("div", { class: "lesson-layout" }, toc, body));
  };

  P.labs = (root) => {
    root.append(el("div", { class: "eyebrow" }, "Laboratorio"), el("h1", { class: "page-title" }, "Probá sonidos, armá tus recetas"),
      el("p", { class: "page-lede" }, "Ocho herramientas para escuchar lo que leés. Todo el sonido se genera en vivo en tu navegador: no hay samples ni descargas. Usá auriculares o monitores y empezá con el volumen bajo."),
      labGrid());
  };

  const labTabs = (cur) => el("nav", { class: "lab-tabs", "aria-label": "Laboratorios" }, LABS.map(([id]) => el("a", { href: "#lab-" + id, "aria-current": id === cur ? "page" : null }, labDef(id).title)));
  P.lab = (root, id) => {
    const d = labDef(id); if (!d) return P.notFound(root);
    const les = C.LESSONS.find((l) => l.id === d.lesson);
    const qd = C.QUOTES[LAB_QUOTE[id]], b = qd && C.BOOKS[qd.b];
    root.append(labTabs(id),
      el("div", { class: "lab-head" },
        el("div", null, el("div", { class: "eyebrow" }, "Lab · " + T(d.tag)), el("h1", null, d.title), el("p", null, d.desc)),
        les ? el("a", { class: "btn", href: "#leccion-" + les.id }, T("Lección {n}", { n: les.n }) + ": " + les.title) : null),
      qd ? el("p", { class: "lab-quote", style: { "--qc": b.color } }, T("«{q}»", { q: qd.es }) + " ", el("span", null, "— " + b.author)) : null);
    const host = el("div"); root.append(host);
    try { d.render(host); } catch (e) { console.error(e); host.append(el("p", null, T("No se pudo iniciar el audio en este navegador:") + " " + e.message)); }
  };

  P.bibliography = (root) => {
    let filter = null, term = "";
    root.append(el("div", { class: "eyebrow" }, "Bibliografía"), el("h1", { class: "page-title" }, "Los cinco libros"),
      el("p", { class: "page-lede" }, "Haciendo Música se apoya en cinco libros de producción. Tocá una tapa para ver sus citas y de qué trata. Las citas van en el idioma original con su traducción."));
    const covers = el("div", { class: "books" });
    const about = el("div");
    const grid = el("div", { class: "quote-grid" });
    const search = el("input", { type: "search", id: "qsearch", class: "search", placeholder: "Buscar en las citas: mezcla, bombo, terminar…" });
    search.addEventListener("input", () => { term = search.value.toLowerCase(); paint(); });
    const btns = Object.entries(C.BOOKS).map(([k, bk]) => {
      const n = Object.values(C.QUOTES).filter((q) => q.b === k).length;
      const b = el("button", { type: "button", class: "book", "aria-pressed": "false" },
        el("div", { class: "cover", style: { "--bk": bk.color }, html: '<span class="ct">' + bk.title + '</span><svg viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 30 ' + Array.from({ length: 20 }, (_, i) => "Q" + (i * 10 + 5) + " " + (30 + (i % 2 ? -1 : 1) * (8 + ((i * 7 + k.length * 3) % 18))) + " " + (i * 10 + 10) + " 30").join(" ") + '" fill="none" stroke="#fff" stroke-width="2"/></svg><span class="ca">' + bk.author + "</span>" }),
        el("span", { class: "bt" }, bk.sub + " · " + T("{n} citas", { n })));
      b.addEventListener("click", () => { filter = filter === k ? null : k; btns.forEach(([kk, bb]) => bb.setAttribute("aria-pressed", String(kk === filter))); paint(); });
      covers.append(b);
      return [k, b];
    });
    const paint = () => {
      about.replaceChildren();
      if (filter) { const bk = C.BOOKS[filter]; about.append(el("section", { class: "callout", style: { "--cc": bk.color, marginTop: "28px" } }, el("header", { style: { color: "#fff" } }, el("span", { class: "dot", style: { background: "#fff" } }), bk.author + " · " + bk.title), el("div", null, el("p", null, bk.about)))); }
      const list = Object.entries(C.QUOTES).filter(([, q]) => (!filter || q.b === filter) && (!term || (q.es + " " + q.en + " " + q.where).toLowerCase().includes(term)));
      grid.replaceChildren(...(list.length ? list.map(([id]) => quoteEl(id)) : [el("p", null, T("No hay citas con \"{t}\". Probá con otra palabra.", { t: term }))]));
    };
    paint();
    root.append(covers, about, el("div", { class: "filter-row" }, search), grid, el("p", { class: "disclaimer", style: { marginTop: "32px" } }, DISCLAIMER));
  };

  P.glossary = (root) => {
    const CATS = C.GLOSS_CATS, catOf = (id) => CATS.find((c) => c.id === id);
    let cat = null;
    const search = el("input", { type: "search", id: "gsearch", class: "search", placeholder: "Buscar un término o una idea…", value: S.glossQuery || "" });
    S.glossQuery = "";
    const count = el("span", { class: "count" });
    const chips = el("div", { class: "chips", role: "group", "aria-label": "Categorías" });
    const allChip = el("button", { type: "button", class: "chip", "aria-pressed": "true" }, "Todas", el("small", null, String(C.GLOSSARY.length)));
    allChip.addEventListener("click", () => { cat = null; paintChips(); paint(); });
    const catChips = CATS.map((c) => { const b = el("button", { type: "button", class: "chip", style: { "--cc": V.css(c.color) } }, c.name, el("small", null, String(C.GLOSSARY.filter((t) => t[1] === c.id).length))); b.addEventListener("click", () => { cat = cat === c.id ? null : c.id; paintChips(); paint(); }); return b; });
    chips.append(allChip, ...catChips);
    const paintChips = () => { allChip.setAttribute("aria-pressed", String(!cat)); catChips.forEach((b, i) => b.setAttribute("aria-pressed", String(CATS[i].id === cat))); };
    const az = el("nav", { class: "az", "aria-label": "Índice alfabético" });
    const out = el("div");
    const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const paint = () => {
      const t = norm(search.value.trim());
      const list = C.GLOSSARY.filter(([a, c, d]) => (!cat || c === cat) && (!t || norm(a + " " + d).includes(t))).sort((x, y) => norm(x[0]).localeCompare(norm(y[0]), LANG));
      count.textContent = T("{n} de {t} términos", { n: list.length, t: C.GLOSSARY.length });
      // alfabetos latinos: índice A–Z; chino, japonés e hindi: agrupado por categoría
      const groups = {};
      const keyOf = S.i18n.latin ? (it) => { const L0 = norm(it[0])[0].toUpperCase(); return /[A-Z]/.test(L0) ? L0 : "#"; } : (it) => it[1];
      list.forEach((it) => { const k = keyOf(it); (groups[k] = groups[k] || []).push(it); });
      const keys = S.i18n.latin ? "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") : CATS.map((c) => c.id);
      const label = (k) => (S.i18n.latin ? k : catOf(k).name);
      const jump = (k) => el("a", { href: "#glosario", onclick: (e) => { e.preventDefault(); const t2 = document.getElementById("g-" + k); t2 && t2.scrollIntoView({ behavior: "smooth" }); } }, label(k));
      az.hidden = !S.i18n.latin; // sin A–Z: los chips de categoría ya cumplen esa función
      az.replaceChildren(...keys.filter((k) => S.i18n.latin || groups[k]).map((k) => (groups[k] ? jump(k) : el("span", null, k))));
      out.replaceChildren(...(list.length ? keys.filter((k) => groups[k]).flatMap((ch) => [
        el("h2", { class: "g-letter", id: "g-" + ch }, label(ch)),
        el("div", { class: "gloss" }, groups[ch].map(([a, c, d, labId]) => {
          const cc = catOf(c);
          return el("article", { class: "term", style: { "--cc": V.css(cc.color) } }, el("span", { class: "tc" }, cc.name), el("h3", null, a), el("p", null, d),
            labId ? el("span", { class: "also" }, "Probalo en ", el("a", { href: "#lab-" + labId }, labDef(labId).title)) : null);
        })),
      ]) : [el("p", null, T("No hay términos con \"{t}\". Probá con otra palabra o elegí \"Todas\".", { t: search.value }))]));
    };
    search.addEventListener("input", paint);
    paint();
    root.append(el("div", { class: "eyebrow" }, "Glosario"), el("h1", { class: "page-title" }, "Palabras del estudio"),
      el("p", { class: "page-lede" }, "Todo el vocabulario de la producción musical, de la acústica al mastering y la industria, explicado en pocas líneas. Filtrá por tema, buscá una palabra o saltá a una letra."),
      el("div", { class: "g-tools" }, el("div", { class: "filter-row", style: { margin: 0 } }, search, count), chips, az), out);
  };

  P.notFound = (root) => root.append(el("h1", { class: "page-title" }, "No encontrado"), el("p", null, el("a", { href: "#" }, "Volver al inicio")));

  // ------------------------------------------------------------------ router
  const route = () => {
    leave();
    const h = (location.hash || "#").slice(1);
    main.replaceChildren();
    const root = el("div"); main.append(root);
    let nav = "";
    if (!h) P.home(root);
    else if (h === "lecciones") { P.lessons(root); nav = "lecciones"; }
    else if (h.startsWith("leccion-")) { P.lesson(root, h.slice(8)); nav = "lecciones"; }
    else if (h === "lab") { P.labs(root); nav = "lab"; }
    else if (h.startsWith("lab-")) { P.lab(root, h.slice(4)); nav = "lab"; }
    else if (h === "bibliografia" || h === "biblioteca") { P.bibliography(root); nav = "bibliografia"; }
    else if (h === "glosario") { P.glossary(root); nav = "glosario"; }
    else P.notFound(root);
    navLinks.forEach((a, i) => a.setAttribute("aria-current", NAV[i][0] === nav ? "page" : "false"));
    window.scrollTo(0, 0);
    document.title = "Haciendo Música";
  };
  window.addEventListener("hashchange", route);
  route();
})(window.S);
