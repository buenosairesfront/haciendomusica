/* Haciendo Música — idiomas.
   El español es el idioma fuente: cada paquete (js/lang/<código>.js) es un diccionario
   que traduce el texto en español tal como aparece en el código y el contenido.
   S.T(texto, vars) devuelve la traducción (o el mismo texto si falta) y reemplaza {variables}. */
window.S = window.S || {};
(function (S) {
  const LANGS = [["es", "Español"], ["en", "English"], ["de", "Deutsch"], ["zh", "中文"], ["ja", "日本語"], ["hi", "हिन्दी"]];
  const FONTS = { zh: "Noto+Sans+SC", ja: "Noto+Sans+JP", hi: "Noto+Sans+Devanagari" };
  const known = (c) => LANGS.some((l) => l[0] === c);
  const KEY = "senal:lang";

  let lang = "es";
  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (known(q)) { lang = q; localStorage.setItem(KEY, JSON.stringify(q)); }
    else { const v = JSON.parse(localStorage.getItem(KEY)); if (known(v)) lang = v; }
  } catch (e) {}

  const packs = (S.i18nPacks = S.i18nPacks || {});
  const I = (S.i18n = { LANGS, lang, latin: !FONTS[lang] });
  document.documentElement.lang = lang;

  // Paquete de idioma y tipografía: se cargan antes que el resto de los scripts.
  // (En el HTML de un solo archivo los paquetes ya vienen incluidos.)
  if (lang !== "es" && !packs[lang]) document.write('<script src="js/lang/' + lang + '.js"><\/script>');
  if (FONTS[lang]) document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=' + FONTS[lang] + ':wght@400;600;700;900&display=swap">');

  const has = Object.prototype.hasOwnProperty;
  S.T = function (s, vars) {
    let r = s;
    if (lang !== "es" && typeof s === "string") { const d = packs[lang]; if (d && has.call(d, s)) r = d[s]; }
    if (vars) r = r.replace(/\{(\w+)\}/g, (m, k) => (has.call(vars, k) ? vars[k] : m));
    return r;
  };

  // Traduce en el lugar todos los textos de una estructura de datos (lecciones, glosario, citas...).
  I.deep = function (o) {
    if (lang === "es" || !o || typeof o !== "object") return o;
    for (const k in o) { const v = o[k]; if (typeof v === "string") o[k] = S.T(v); else if (v && typeof v === "object") I.deep(v); }
    return o;
  };

  // Cambiar de idioma recarga la página con ?lang= (funciona aunque el navegador no guarde datos).
  I.set = function (c) {
    if (!known(c)) return;
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    const u = new URL(location.href);
    u.searchParams.set("lang", c);
    location.href = u.toString();
  };
})(window.S);
