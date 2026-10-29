# Masterarbeit Website

Eine minimalistische, statische Website für deine Masterarbeit mit integriertem Reflexions-Tagebuch.

## Features

- ✅ **Keine Dependencies** – Pure HTML/CSS/JavaScript
- ✅ **Markdown-basiert** – Schreib deine Inhalte in `.md` Dateien
- ✅ **Einfach zu erweitern** – Neue Seiten = neue Dateien
- ✅ **Dark Mode** – Automatisch basierend auf System-Einstellung
- ✅ **Responsive** – Funktioniert auf Mobile und Desktop
- ✅ **GitHub Pages ready** – Deploy mit einem Push

## Struktur

```
masterthesis-website/
├── index.html              # Hauptseite
├── style.css               # Styling
├── app.js                  # JavaScript (Rendering, Parsing)
├── content/
│   ├── thesis/             # Deine Thesis-Themen (als .md)
│   │   ├── 01-intro.md
│   │   ├── 02-problem.md
│   │   ├── 03-method.md
│   │   ├── 04-results.md
│   │   └── 05-conclusion.md
│   └── reflexion/          # Deine Reflexions-Posts (als .md)
│       ├── 2024-10-29-first-thoughts.md
│       └── 2024-11-15-update.md
└── README.md               # Diese Datei
```

## Erste Schritte

### 1. Repository clonen oder manuell aufsetzen

```bash
git clone <dein-repo-url>
cd masterthesis-website
```

Oder manuell:
- Kopiere die Dateien in einen neuen Ordner
- Erstelle die Ordnerstruktur wie oben

### 2. Lokalen Server starten (zum Testen)

```bash
# Mit Python 3:
python -m http.server 8000

# Mit Python 2:
python -m SimpleHTTPServer 8000

# Mit Node.js (wenn installiert):
npx http-server
```

Dann öffne: `http://localhost:8000`

### 3. Inhalte hinzufügen

#### Thesis-Thema hinzufügen

1. Neue Datei in `/content/thesis/` erstellen, z.B. `06-discussion.md`
2. In `app.js` die Seite zur `pages` Liste hinzufügen:

```javascript
const pages = [
  { id: '01-intro', file: 'content/thesis/01-intro.md', title: 'Einführung' },
  // ... weitere
  { id: '06-discuss', file: 'content/thesis/06-discussion.md', title: 'Diskussion' },
];
```

#### Reflexions-Post hinzufügen

1. Neue Datei in `/content/reflexion/` erstellen mit Datumsmuster: `YYYY-MM-DD-*.md`
2. Format beachten (siehe unten)

### 4. GitHub Pages deployen

1. Repository auf GitHub erstellen
2. In Settings > Pages aktivieren (deploy from main branch)
3. Code pushen: `git push origin main`
4. Website läuft auf `https://<dein-username>.github.io/<repo-name>`

## Markdown Format

### Thesis-Datei

```markdown
title: Mein Thema
date: 2024-10-29

## Meine Überschrift

Das ist ein Absatz. Du kannst **fett** und *kursiv* schreiben.

### Unterüberschrift

- Listen
- funktionieren
- auch

> Blockquotes für wichtige Zitate

[Links funktionieren](https://example.com)
```

### Reflexions-Post

```markdown
title: Der Titel meines Posts
date: 2024-11-15
tags: tag1, tag2, tag3

## Mein Reflexions-Post

Inhalt wie oben...

Die **Tags** werden automatisch als Filter-Links angezeigt.
```

## Anpassungen

### Kontakt-Email ändern

In `app.js`, in der `renderHomePage()` Funktion:

```javascript
<p>Interessiert an einer Zusammenarbeit? <a href="mailto:deine-email@example.com">Schreib mir</a>.</p>
```

### Farben/Design anpassen

In `style.css` die CSS-Variablen ändern:

```css
:root {
  --text: #1a1a1a;
  --bg: #ffffff;
  --accent: #0066cc;
  /* ... */
}
```

### Header-Text anpassen

In `index.html`:

```html
<h1><a href="/">Dein Titel</a></h1>
```

## Tipps

- **Kapitel-Reihenfolge:** Einfach die Dateinamen nummerieren (01-, 02-, etc.)
- **Tags nutzen:** Nutze konsistente Tag-Namen in deinen Posts (z.B. `process`, `insights`, `blockades`)
- **Drafts:** Erstelle Posts in `_draft-*` Dateien um sie zu verstecken (oder einfach noch nicht in `app.js` eintragen)
- **Bilder:** Speichere Bilder in `/images/` und linke sie ein: `![Alt text](/images/my-image.png)`

## Browser-Unterstützung

Funktioniert in allen modernen Browsern (Chrome, Firefox, Safari, Edge).

## Lokale Änderungen testen

Nach Änderungen:
1. Speichern
2. Browser-Seite neuladen (Ctrl+R / Cmd+R)
3. Cache ggf. clearen (Shift+Ctrl+R / Shift+Cmd+R)

## Support / Probleme

Wenn etwas nicht funktioniert:
- Browser-Console öffnen (F12) und nach Errors schauen
- Dateinamen und Pfade checken (case-sensitive!)
- Sicherstellen, dass die Markdown-Dateien in den richtigen Ordnern sind

---

**Viel Spaß beim Dokumentieren deiner Masterarbeit!** 🚀
