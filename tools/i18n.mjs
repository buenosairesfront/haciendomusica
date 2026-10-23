// Haciendo Música — herramienta de traducciones.
//   node tools/i18n.mjs keys            lista todos los textos en español que hay que traducir
//   node tools/i18n.mjs check           muestra cuántas claves faltan o sobran en cada idioma
//   node tools/i18n.mjs missing <lang>  escribe tools/pendientes-<lang>.json con lo que falta traducir
// Requiere: cd tools && npm install
import * as acorn from "acorn";
import * as walk from "acorn-walk";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CODE = ["app.js", "viz.js", "labs1.js", "labs2.js", "widgets.js"];
const DATA = ["content.js", "glossary.js"];
const LANGS = ["en", "de", "zh", "ja", "hi"];

const parse = (f) => acorn.parse(fs.readFileSync(path.join(ROOT, "js", f), "utf8"), { ecmaVersion: 2022 });
const letters = (s) => /[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]{2,}/.test(s);
const ident = (s) => /^[a-z0-9_\-.#]+$/.test(s) || /^[a-z]+[A-Z]\w*$/.test(s);
// textos de código, CSS o SuperCollider que nunca se muestran como interfaz
const notUi = (s) => /^(--|#|\.|<svg|<path|<span class|<b style|rgba?\(|color-mix|repeat\(|calc\(|italic |\d+px|inset )|SynthDef|Pdef|Pbind|Pseq|EnvGen|\.ar\b|\.kr\b|TempoClock|doneAction|\\[a-z]+,/.test(s.trim());
// nombres de clases CSS ("btn sm", "card chart"...): no son texto visible
const CSS_CLASSES = new Set([...fs.readFileSync(path.join(ROOT, "css", "app.css"), "utf8").matchAll(/\.([a-z][\w-]*)/g)].map((m) => m[1]));
const cssClass = (s) => s.trim().split(/\s+/).every((w) => CSS_CLASSES.has(w));
const codeBit = (s) => /^\s|var\(|minmax|\d+px|\binf\)|Rest\(\)|=\s*$|\*\s*\(|\.play\(|gate\)|midiratio|stroke=|^<\/?(b|span)\b|^(Enter|ArrowLeft|ArrowRight|NFD)$|^\(lfo|^(px|span) $/.test(s);
const uiLike = (s) => !cssClass(s) && !codeBit(s) && letters(s) && !ident(s) && !notUi(s) && (/[ áéíóúñ¿¡]/.test(s) || /^[A-ZÁÉÍÓÚ¿¡«]/.test(s.trim()));

function keys() {
  const out = new Set();
  const lits = (node, test) => walk.full(node, (m) => { if (m.type === "Literal" && typeof m.value === "string" && test(m.value)) out.add(m.value); });
  // en los datos no se traducen: la cita original en inglés (en) ni el título, subtítulo y autor de los libros
  const dataText = (s) => letters(s) && !ident(s) && !notUi(s);
  const KEEP = new Set(["en", "author", "short", "sub"]);
  for (const f of DATA) walk.simple(parse(f), {
    ObjectExpression(o) {
      const isBook = o.properties.some((p) => p.key && p.key.name === "author");
      o.properties.forEach((p) => { const k = p.key && (p.key.name || p.key.value); if (p.value.type === "Literal" && !KEEP.has(k) && !(isBook && k === "title")) lits(p.value, dataText); });
    },
    ArrayExpression(a) { a.elements.forEach((e) => e && e.type === "Literal" && lits(e, dataText)); },
    CallExpression(c) { c.arguments.forEach((e) => e.type === "Literal" && lits(e, dataText)); },
  });
  for (const f of CODE) {
    const ast = parse(f);
    lits(ast, uiLike);
    walk.simple(ast, {
      CallExpression(n) {
        const c = n.callee, name = c.type === "Identifier" ? c.name : c.type === "MemberExpression" ? c.property.name : "";
        // argumentos de T()/tr() y datos envueltos en S.i18n.deep(): todo texto con letras
        if (name === "T" || name === "tr") lits(n.arguments[0], (s) => (letters(s) || /\{\w+\}/.test(s)) && !notUi(s) && !cssClass(s));
        if (name === "deep") lits(n.arguments[0], (s) => letters(s) && !ident(s) && !notUi(s));
      },
    });
  }
  return [...out];
}

const loadPack = (lang) => {
  const f = path.join(ROOT, "js", "lang", lang + ".js");
  if (!fs.existsSync(f)) return {};
  const src = fs.readFileSync(f, "utf8");
  return JSON.parse(src.slice(src.indexOf("= {") + 2, src.lastIndexOf("}") + 1));
};

const cmd = process.argv[2] || "check";
const K = keys();
if (cmd === "keys") console.log(JSON.stringify(K, null, 1));
else if (cmd === "check") {
  console.log(K.length + " textos en español");
  let bad = 0;
  for (const l of LANGS) {
    const p = loadPack(l), miss = K.filter((k) => !(k in p)), extra = Object.keys(p).filter((k) => !K.includes(k));
    const vars = K.filter((k) => k in p && (k.match(/\{\w+\}/g) || []).sort().join() !== (p[k].match(/\{\w+\}/g) || []).sort().join());
    console.log(`${l}: ${K.length - miss.length}/${K.length}` + (miss.length ? ` · faltan ${miss.length}` : "") + (extra.length ? ` · sobran ${extra.length}` : "") + (vars.length ? ` · variables distintas en ${vars.length}: ${vars.slice(0, 3).join(" | ")}` : ""));
    bad += miss.length + vars.length;
  }
  process.exitCode = bad ? 1 : 0;
} else if (cmd === "missing") {
  const l = process.argv[3], p = loadPack(l), miss = {};
  K.filter((k) => !(k in p)).forEach((k) => (miss[k] = ""));
  const f = path.join(ROOT, "tools", "pendientes-" + l + ".json");
  fs.writeFileSync(f, JSON.stringify(miss, null, 1));
  console.log(Object.keys(miss).length + " textos → " + f);
}
