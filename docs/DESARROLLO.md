# Guía de desarrollo

HTML, CSS y JavaScript sin frameworks ni dependencias. No hay `npm install` ni paso de build obligatorio: lo que está en el repo es lo que se sirve.

## Correr en local

```sh
python3 -m http.server 8000
# abrir http://localhost:8000
```

Cualquier servidor estático sirve. Abrir `index.html` con doble clic también funciona en la mayoría de los navegadores, pero un servidor evita problemas con `file://`.

## Arquitectura

Todos los scripts cuelgan de un único objeto global `window.S` y se cargan en este orden desde `index.html` (el orden importa):

| Archivo | Expone | Responsabilidad |
|---|---|---|
| `js/audio.js` | `S.audio` | Motor Web Audio: contexto, master + analizador, buffers de ruido, reverb, voces de batería (`kick`, `snare`, `clap`, `hat`…), `Groove` (secuenciador) y sintetizador. Todo se sintetiza en vivo, no hay samples. |
| `js/viz.js` | `S.viz`, `S.ui` | Canvas, espectro, bandas de frecuencia, helpers de DOM (`el`), íconos, `toast` y `store` (envoltorio de `localStorage` con prefijo `senal:`). |
| `js/content.js` | `S.content` | Libros (`BOOKS`), citas (`QUOTES`), lecciones (`LESSONS`) y hábitos (`HABITS`). |
| `js/glossary.js` | `S.content.GLOSS_CATS`, `S.content.GLOSSARY` | Glosario por categorías. |
| `js/labs1.js` | `S.labs.beat`, `.mix`, `.arrange` | Labs de ritmo, mezcla y arreglo, más la exportación a SuperCollider. |
| `js/labs2.js` | `S.labs.eq`, `.comp`, `.master`, `.ear`, `.synth` | Labs de EQ, compresor, mastering, oído y síntesis. |
| `js/widgets.js` | `S.widgets` | Figuras interactivas que se insertan dentro de las lecciones. |
| `js/app.js` | — | Arma la interfaz, el router por hash y todas las páginas. |

### Router

`app.js` escucha `hashchange`. Rutas:

```
#                 inicio
#lecciones        lista de lecciones
#leccion-<id>     una lección (id de C.LESSONS)
#lab              grilla de labs
#lab-<id>         un lab (id de la tabla LABS en app.js)
#bibliografia     libros y citas  (alias: #biblioteca)
#glosario         glosario
```

Al cambiar de ruta se ejecutan los callbacks registrados con `S.onLeave(fn)` y se detienen todas las animaciones y voces (`V.stopAll()`, `A.stopAll()`). Cualquier página o widget que arranque audio, timers o listeners globales tiene que registrar su limpieza con `S.onLeave`.

## Cómo agregar contenido

### Una cita

En `js/content.js`, dentro de `C.QUOTES`:

```js
x_clave: { b: "rogers", where: "Cap. 3", en: "Texto original.", es: "Traducción." },
```

`b` es la clave del libro en `C.BOOKS`. Después se usa en una lección con `q("x_clave")`.

### Un bloque de lección

Cada lección de `C.LESSONS` tiene una lista `blocks` armada con estos helpers:

| Helper | Genera |
|---|---|
| `h("Título")` | Subtítulo de sección (entra en el índice lateral) |
| `p("html")` | Párrafo (acepta HTML inline) |
| `q("id")` | Cita |
| `w("nombre", opts)` | Figura interactiva de `S.widgets` |
| `cs("Título", "html")` | Caso práctico |
| `tip("Título", "html")` | Recuadro "Para llevarte" |
| `deep("Título", "html")` | Recuadro desplegable "Profundizar" |
| `lab("id", "texto")` | Enlace a un laboratorio |
| `{ t: "list", items: [...] }` | Lista |

Una lección también define `quiz` (preguntas con `q`, opciones `o`, índice correcto `a` y explicación `why`) y `labs` (ids de los labs relacionados).

### Un término del glosario

En `js/glossary.js`, dentro de `C.GLOSSARY`:

```js
["Término", "categoria", "Definición.", "labOpcional"],
```

La categoría tiene que existir en `C.GLOSS_CATS`. El cuarto elemento es opcional y enlaza a un lab.

### Un laboratorio

1. Definí el objeto en `labs1.js` o `labs2.js`:

   ```js
   L.miLab = {
     title: "Mi lab", tag: "Tema", color: "--b-mid",
     desc: "Una línea para la tarjeta.",
     render(root) { /* armar la UI dentro de root; registrar limpieza con S.onLeave */ },
   };
   ```

2. Registralo en la tabla `LABS` de `app.js` como `["ruta", "miLab", "leccionRelacionada"]`. Opcionalmente agregale una cita en `LAB_QUOTE`.

### Una figura interactiva

Agregá `W.nombre = function (opts) { ... return nodo; }` en `widgets.js` y usala en una lección con `w("nombre")`.

## Estilos

`css/app.css` define todos los colores y medidas como variables en `:root` (paleta amarilla, azul, verde y roja con bordes negros gruesos y sombras duras). Los colores de las bandas de frecuencia son `--b-sub`, `--b-low`, `--b-lowmid`, `--b-mid`, `--b-himid`, `--b-pres` y `--b-air`; las lecciones, labs y categorías del glosario los referencian por nombre.

## Build de un solo archivo

```sh
python3 build.py              # dist/haciendo-musica.html (autocontenido, se abre con doble clic)
python3 build.py --fragment   # dist/haciendo-musica-fragment.html (solo head+body, para publicar como artefacto de Claude)
```

`build.py` reemplaza el `<link>` de `css/app.css` y cada `<script src="js/...">` por su contenido inline. Después de cambiar código, regenerá `dist/haciendo-musica.html` y commitealo para que el archivo descargable quede al día. El fragmento está en `.gitignore`.

## Checklist antes de publicar

- [ ] La consola del navegador no muestra errores en inicio, en una lección y en cada lab.
- [ ] El audio arranca tras el primer clic y se detiene al cambiar de página.
- [ ] Se ve bien a 360 px de ancho (celular) sin scroll horizontal.
- [ ] `python3 build.py` corre y `dist/haciendo-musica.html` abre igual que la versión en carpetas.
