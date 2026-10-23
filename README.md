# Haciendo Música

**Hacé tu sonido.** Un acercamiento a la producción musical con un enfoque visual y sonoro, basado en lecciones cortas e ideas de los libros que forman productores, con un laboratorio a disposición para probar sonidos y hacer tus propias recetas.

**7 lecciones**, **8 laboratorios interactivos**, **86 citas** de cinco libros y un **glosario de 284 términos** en 10 categorías. Todo el audio se sintetiza en vivo con Web Audio: no hay samples, no hay backend, no hay build obligatorio.

**Idiomas:** español (predeterminado), English, Deutsch, 中文, 日本語 y हिन्दी. Se eligen desde la pestaña **Lang** de la barra superior o con `?lang=` en la dirección (por ejemplo `?lang=en`).

> Contenido elaborado con inteligencia artificial (Claude, de Anthropic) a partir de los libros citados, con fines exclusivamente educativos. Puede contener errores o simplificaciones y no reemplaza la lectura de los originales.

## Abrir

**▶ https://buenosairesfront.github.io/haciendomusica/**

También aparece en la landing de **Buenos Aires Front**, sección *Apps web*.

- **Local:** `python3 -m http.server` en la carpeta del repo y abrí `http://localhost:8000`.
- **Un solo archivo:** [`dist/haciendo-musica.html`](dist/haciendo-musica.html) tiene toda la app inline: se puede mandar por mail o abrir con doble clic. Se regenera con `python3 build.py`.

## Documentación

| Documento | Para quién |
|---|---|
| [docs/USO.md](docs/USO.md) | Quien usa la app: secciones, lecciones, labs, enlaces directos y progreso |
| [docs/DESARROLLO.md](docs/DESARROLLO.md) | Quien la modifica: arquitectura, router, idiomas, cómo agregar citas, lecciones, términos y labs |
| [docs/PUBLICAR.md](docs/PUBLICAR.md) | Publicación en GitHub Pages, enlaces desde la landing y build de archivo único |

## Qué hay adentro

| Lecciones | Labs |
|---|---|
| 1. El oficio de producir | Caja de ritmos: 16 pasos, BPM por género, swing, sidechain, exporta a **SuperCollider** (Pdef/Pbind) |
| 2. Escuchar: sala, monitores y oído | Mezcla en 3D: escenario arrastrable (paneo × profundidad), canales, chequeo mono, gain staging |
| 3. Ritmo: bombo, batería y groove | Arreglo: mapa de secciones, curva de energía, risers y build-ups automáticos |
| 4. Arreglo: del loop a la canción | Ecualizador: 5 bandas arrastrables sobre el espectro, presets sacados de los libros |
| 5. Mezcla: balance, frecuencia y espacio | Compresor: curva de transferencia, reducción de ganancia, método del % de Rogers |
| 6. Mastering: la última milla | Mastering: cadena completa, medidores, la guerra del volumen en pantalla |
| 7. La mente del productor | Entrenamiento auditivo: adiviná la frecuencia realzada |
| | Diseño de sonido: sintetizador sustractivo, presets y **SynthDef de SuperCollider** |

Cada lección trae figuras que suenan, citas en el idioma original con traducción, casos prácticos, recuadros "Profundizar" y un cuestionario. El progreso queda guardado en el navegador.

## Fuentes

- Richard James Burgess, *The Art of Music Production: The Theory and Practice*
- Tommy Swindali, *Music Production, 2020 Edition*
- Tommy Swindali, *Electronic Dance Music Production: The Advanced Guide*
- John Rogers, *Audio Mastering Secrets*
- Jason Timothy, *Music Habits: The Mental Game of Electronic Music Production*

Las citas son breves y se usan con fines educativos; los derechos pertenecen a sus autores. Donde un libro tiene errores técnicos (por ejemplo "bit rate" por *bit depth*), la app lo aclara.

## Estructura

```
./
  index.html
  css/app.css
  js/i18n.js      idiomas: elección, carga del paquete y función T()
  js/lang/*.js    paquetes de idioma (en, de, zh, ja, hi): español → traducción
  js/audio.js     motor de audio: voces de batería, groove, sintetizador
  js/viz.js       canvas, espectro, controles
  js/content.js   libros, citas y lecciones
  js/glossary.js  glosario por categorías
  js/widgets.js   figuras interactivas de las lecciones
  js/labs1.js     labs: beat, mezcla, arreglo
  js/labs2.js     labs: EQ, compresor, mastering, oído, síntesis
  js/app.js       router y páginas
  build.py        empaqueta todo en un HTML (con todos los idiomas)
  tools/i18n.mjs  revisa que las traducciones estén completas
  dist/           versión de un solo archivo
  docs/           documentación
```
