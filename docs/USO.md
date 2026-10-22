# Guía de uso

Haciendo Música es una escuela visual de producción musical que corre entera en el navegador. No hace falta instalar nada ni crear una cuenta.

**Abrir:** https://buenosairesfront.github.io/haciendomusica/

> El audio se genera recién cuando tocás un botón de reproducción (los navegadores no dejan sonar nada antes de una interacción). Si no escuchás nada, revisá el volumen del sistema y que la pestaña no esté silenciada. En el celular, sacá el modo silencio.

## Secciones

La barra lateral (arriba en el celular) tiene cinco secciones. Cada una tiene su propia dirección, así que se pueden compartir o guardar como marcador.

| Sección | Dirección | Qué hay |
|---|---|---|
| Inicio | `#` | Tablero con el progreso, el analizador de espectro, la lista de lecciones, citas y accesos a los labs |
| Lecciones | `#lecciones` | Las 7 lecciones en orden |
| Laboratorio | `#lab` | Los 8 laboratorios de audio |
| Biblioteca | `#bibliografia` | Los cinco libros, con sus citas filtrables |
| Glosario | `#glosario` | 284 términos en 10 categorías, con buscador y índice A–Z |

El buscador de la barra superior (en pantallas anchas) busca en el glosario: escribí y apretá Enter.

## Lecciones

| # | Lección | Dirección |
|---|---|---|
| 1 | El oficio de producir | `#leccion-oficio` |
| 2 | Escuchar: sala, monitores y oído | `#leccion-escucha` |
| 3 | Ritmo: bombo, batería y groove | `#leccion-ritmo` |
| 4 | Arreglo: del loop a la canción | `#leccion-arreglo` |
| 5 | Mezcla: balance, frecuencia y espacio | `#leccion-mezcla` |
| 6 | Mastering: la última milla | `#leccion-mastering` |
| 7 | La mente del productor | `#leccion-mente` |

Cada lección combina:

- **Figuras que suenan:** gráficos interactivos que se escuchan (el dial del productor, las bandas del espectro, el bombo, la guerra del volumen, etc.).
- **Citas** en el idioma original con su traducción y la referencia al libro.
- **Casos prácticos** (recuadro amarillo) y **Para llevarte** (recuadro verde).
- **Profundizar:** recuadros desplegables con detalle técnico.
- **Cuestionario** al final. Al responder todas las preguntas, la lección queda marcada como leída y suma al contador de progreso.

## Laboratorios

| Lab | Dirección | Para qué sirve |
|---|---|---|
| Caja de ritmos | `#lab-beat` | Secuenciador de 16 pasos con los BPM de cada género, swing y sidechain. Exporta el patrón a SuperCollider (`Pdef`/`Pbind`). |
| Mezcla en 3D | `#lab-mix` | Escenario arrastrable: izquierda/derecha es el paneo, adelante/atrás la profundidad (volumen + reverb). Chequeo mono y gain staging. |
| Arreglo | `#lab-arreglo` | Mapa de secciones (intro, build, drop…), curva de energía, risers y build-ups automáticos. |
| Ecualizador | `#lab-eq` | 5 bandas que se arrastran sobre el espectro en vivo. Presets tomados de los libros. |
| Compresor | `#lab-comp` | Curva de transferencia, reducción de ganancia y el método del porcentaje de Rogers. |
| Mastering | `#lab-master` | Cadena completa con medidores; muestra qué pasa cuando se empuja el volumen. |
| Entrenamiento auditivo | `#lab-oido` | Suena una banda realzada y tenés que adivinar la frecuencia. |
| Diseño de sonido | `#lab-synth` | Sintetizador sustractivo con teclado en pantalla (también con el teclado de la compu) y exportación a `SynthDef` de SuperCollider. |

## Progreso guardado

Las lecciones leídas, el puntaje del entrenamiento auditivo y los días del temporizador de hábitos se guardan en el navegador (`localStorage`, con claves que empiezan con `senal:`). No se envía nada a ningún servidor. Si borrás los datos del sitio o usás una ventana privada, el progreso arranca de cero.

## Requisitos

- Un navegador actual: Chrome, Edge, Firefox o Safari (también en Android e iOS).
- JavaScript habilitado.
- Conexión a internet solo para las tipografías de Google Fonts; sin conexión la app funciona igual con fuentes del sistema (si la abrís desde el archivo de `dist/`).
