# Publicación

## GitHub Pages

La app es estática y está lista para servirse desde la raíz del repo (`index.html` + `css/` + `js/`). El archivo `.nojekyll` evita que GitHub procese el sitio con Jekyll.

Activación (una sola vez):

1. En GitHub, abrí **Settings → Pages** del repo `buenosairesfront/haciendomusica`.
2. En **Build and deployment → Source** elegí **Deploy from a branch**.
3. Branch: **`main`**, carpeta: **`/ (root)`**. Guardar.
4. En uno o dos minutos la app queda en:

   **https://buenosairesfront.github.io/haciendomusica/**

Cada push a `main` vuelve a publicar automáticamente.

### Enlaces directos

Como el router usa el hash, cualquier sección se puede enlazar directamente:

- Lab de ritmos: `https://buenosairesfront.github.io/haciendomusica/#lab-beat`
- Sintetizador: `https://buenosairesfront.github.io/haciendomusica/#lab-synth`
- Primera lección: `https://buenosairesfront.github.io/haciendomusica/#leccion-oficio`
- Glosario: `https://buenosairesfront.github.io/haciendomusica/#glosario`

## Landing de Buenos Aires Front

La app figura en la sección **Apps web** de la landing de Buenos Aires Front, con dos botones:

| Botón | Destino |
|---|---|
| Probar ↗ | `https://buenosairesfront.github.io/haciendomusica/` |
| Código | `https://github.com/buenosairesfront/haciendomusica` |

En el código de la landing esos enlaces están en el objeto `LINKS` como `demos.musica` y `repos.musica`. Si cambia la URL de publicación, alcanza con actualizar esas dos claves.

## Archivo único

`dist/haciendo-musica.html` contiene toda la app en un solo archivo (CSS y JS inline). Sirve para mandarla por mail, subirla a otro hosting o usarla sin servidor. Se regenera con `python3 build.py`.
