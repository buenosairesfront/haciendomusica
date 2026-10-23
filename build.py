"""Empaqueta Haciendo Música en un único HTML autocontenido (dist/haciendo-musica.html), con todos los idiomas.
Uso: python3 build.py   (opcional: --fragment para generar solo el cuerpo, sin <html>/<head>)"""
import pathlib, re, sys
root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")
css = (root / "css/app.css").read_text(encoding="utf-8")
html = html.replace('<link rel="stylesheet" href="css/app.css">', "<style>\n" + css + "\n</style>")
def inline(m):
    return "<script>\n" + (root / m.group(1)).read_text(encoding="utf-8") + "\n</script>"
# los paquetes de idioma van antes de i18n.js, así el archivo único funciona sin pedir nada al servidor
packs = "".join(f.read_text(encoding="utf-8") for f in sorted((root / "js/lang").glob("*.js")))
html = html.replace('<script src="js/i18n.js"></script>', "<script>\n" + packs + "\n</script>\n" + '<script src="js/i18n.js"></script>')
html = re.sub(r'<script src="(js/[^"]+)"></script>', inline, html)
out = root / "dist"; out.mkdir(exist_ok=True)
if "--fragment" in sys.argv:
    head = re.search(r"<head>(.*)</head>", html, re.S).group(1)
    body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
    head = re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*', "", head)
    head = head.replace("<title>Haciendo Música</title>", '<title>Haciendo Música</title>\n<meta name="claude:viewport-fit-sides" content="cover">')
    (out / "haciendo-musica-fragment.html").write_text(head + body, encoding="utf-8")
else:
    (out / "haciendo-musica.html").write_text(html, encoding="utf-8")
print("ok")
