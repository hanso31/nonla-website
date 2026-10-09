# Nón Lá – Website

Statische Website für das Restaurant Nón Lá in Basel (8 Seiten, zweisprachig
DE/EN). Die Inhalte (Speisekarten, Wochenbuffet, Öffnungszeiten, Texte) werden
über ein webbasiertes Redaktionssystem (Decap CMS) unter **/admin** gepflegt –
ganz ohne Programmierkenntnisse.

Die Seite wird bei **Cloudflare Pages** gehostet (kostenlos, auch für
kommerzielle Seiten). Jede Änderung im Redaktionssystem löst automatisch
einen Neuaufbau aus; nach ca. 1 Minute ist die aktualisierte Seite online.

---

## 1. Einmalige Einrichtung (ca. 20 Minuten)

### Schritt 1: Code zu GitHub hochladen

1. Auf <https://github.com> ein kostenloses Konto erstellen (falls nicht
   vorhanden).
2. Neues Repository anlegen: **New repository** → Name z. B. `nonla-website`
   → Sichtbarkeit *Private* → **Create repository**.
3. Die Dateien dieses Ordners hochladen – am einfachsten mit der
   Kommandozeile im Ordner `nonla-website`:

   ```
   git init
   git add .
   git commit -m "Nón Lá Website"
   git branch -M main
   git remote add origin https://github.com/IHR-BENUTZERNAME/nonla-website.git
   git push -u origin main
   ```

   (Alternativ geht auch **GitHub Desktop** oder das Hochladen über die
   GitHub-Weboberfläche: „uploading an existing file“.)

### Schritt 2: Cloudflare Pages einrichten

1. Auf <https://dash.cloudflare.com> ein kostenloses Konto erstellen
   („Sign up“, E-Mail genügt).
2. **Workers & Pages → Create → Pages → Connect to Git** wählen und mit
   GitHub verbinden → das Repository `nonla-website` auswählen.
3. Build-Einstellungen:
   - **Build command:** `python3 -m pip install -r requirements.txt && python3 build.py`
   - **Build output directory:** `dist`
4. **Save and Deploy** klicken. Nach ca. 1 Minute ist die Seite unter einer
   Adresse wie `https://nonla-website.pages.dev` erreichbar.

### Schritt 3: Login für das Redaktionssystem (einmalig, ca. 15 Minuten)

Die Betreiber melden sich im CMS mit ihrem **GitHub-Konto** an. Dazu
braucht es eine GitHub-„OAuth-App" und einen kleinen kostenlosen
Helfer-Dienst (Cloudflare Worker), der den Login vermittelt:

1. **GitHub-OAuth-App anlegen:** GitHub → oben rechts Profilbild →
   **Settings → Developer settings → OAuth Apps → New OAuth App**
   - *Application name:* z. B. `nonla-cms`
   - *Homepage URL:* `https://IHRE-SEITE.pages.dev`
   - *Authorization callback URL:* `https://nonla-oauth.IHRE-CLOUDFLARE-NAME.workers.dev/callback`
   - **Register application** → danach **Generate a new client secret**
     (Client-ID und Secret kurz notieren – das Secret wird nur einmal
     angezeigt).
2. **Worker bereitstellen:** Den fertigen Helfer-Dienst von
   <https://github.com/i40west/decap-cms-github-oauth-cloudflare> nehmen:
   Repository herunterladen, im Ordner `npm install`, dann

   ```
   npx wrangler secret put CLIENT_ID
   npx wrangler secret put CLIENT_SECRET
   npx wrangler deploy
   ```

   (Wrangler fragt beim ersten Mal nach einem Cloudflare-Login; die
   Worker-URL sieht aus wie `https://nonla-oauth.IHRE-NAME.workers.dev` –
   sie muss zur Callback-URL in Schritt 1 passen. Ohne
   Kommandozeilen-Erfahrung kann jede Person mit IT-Kenntnissen das in
   10 Minuten übernehmen.)
3. **CMS konfigurieren:** In der Datei `admin/config.yml` (im GitHub-Repo
   anklickbar, Stift-Symbol oben rechts) die zwei `BITTE-EINTRAGEN`-Stellen
   ersetzen:
   - `repo: IHR-GITHUB-NAME/nonla-website`
   - `base_url: https://nonla-oauth.IHRE-NAME.workers.dev`
   - Änderung mit „Commit changes" speichern.
4. **Betreiber einladen:** GitHub → Repository → **Settings → Collaborators
   → Add people** → die GitHub-Konten der Betreiber einladen (Rolle
   „Write"). Die Betreiber brauchen dafür jeweils ein kostenloses
   GitHub-Konto.

Fertig. Das Redaktionssystem ist danach unter
`https://IHRE-SEITE.pages.dev/admin` erreichbar – einloggen mit dem
GitHub-Konto, das als Collaborator eingeladen wurde.

*(Eigene Domain wie www.nonla.ch: in Cloudflare unter dem Pages-Projekt
auf **Custom domains** klicken und die Domain hinzufügen. Die Domain muss
dazu bei Cloudflare als Zone eingerichtet sein bzw. deren DNS nutzen.)*

---

## 2. Inhalte bearbeiten (Alltag)

1. `https://IHRE-SEITE.pages.dev/admin` öffnen und mit dem GitHub-Konto
   einloggen („Login with GitHub").
2. Links den Bereich wählen:

   | Bereich | Was wird bearbeitet |
   |---|---|
   | **Wochenbuffet (Mo–Fr)** | Buffet-Gerichte pro Wochentag (Mittag Spalenbrunnen) |
   | **Speisekarte Alte Markthalle** | Gerichte, Preise, Texte dieser Karte |
   | **Speisekarte Spalenbrunnen mittags** | Kleine Karte mittags + Seitentexte |
   | **Speisekarte Spalenbrunnen abends** | Abendkarte inkl. Varianten und Notizen |
   | **Speisekarte Klara** | Gerichte, Preise, Texte dieser Karte |
   | **Texte übrige Seiten (DE/EN)** | Navigation, Startseite, Bestellen, Reservieren, Catering, Fusszeile |
   | **Öffnungszeiten** | Zeiten der 3 Standorte, Bestellzeiten, «Jetzt geöffnet»-Automatik |

3. Ändern und auf **Publish** (Veröffentlichen) klicken.
4. Nach ca. 1 Minute ist die Änderung online. (Status in Cloudflare unter
   dem Pages-Projekt auf **Deployments** sichtbar.)

### Wichtige Regeln

- **Schlüssel/`id`-Felder nie ändern.** Sie verbinden den Text mit der
  Website und den Übersetzungen.
- **Neues Gericht:** in der Liste auf „Add“ klicken und einen **neuen,
  eindeutigen Schlüssel** vergeben (nur Kleinbuchstaben/Zahlen, z. B. `a5`,
  `d8`, `s9` – keiner darf doppelt vorkommen).
- **Gericht löschen:** Eintrag in der Liste entfernen.
- **`<br/>`** = Zeilenumbruch, **`&amp;`** = &-Zeichen – bitte stehen lassen.
- **Bilder:** beim Gericht auf „Choose an image“ → vorhandenes Bild wählen
  oder hochladen (landet im Ordner `images/`).
- Felder mit dem Hinweis „bitte nicht ändern“ (grau/versteckt) sind
  technische Felder – einfach ignorieren.

---

## 3. Für Technik-Interessierte: Aufbau des Projekts

```
content/     ← alle redaktionellen Inhalte (YAML, mit deutscher Anleitung
               im Dateikopf) – das einzige, was das CMS verändert
templates/   ← HTML-/JS-Vorlagen mit @@-Marken (Design-Grundlage)
images/      ← Bilder (auch Upload-Ziel des CMS)
styles-v2.css← Design (unverändert aus dem Original)
admin/       ← Decap CMS (config.yml = Formular-Definition)
original/    ← Originaldateien als Referenz für den Abgleich
build.py     ← baut dist/ aus content/ + templates/
dist/        ← Build-Ergebnis (wird veröffentlicht, nicht einchecken)
```

Lokal bauen und gegen das Original prüfen:

```
pip install -r requirements.txt
python build.py            # baut nach dist/
python build.py --verify   # prüft: dist/ == original/ (byte-identisch)
```

Zum lokalen Anschauen z. B. `python -m http.server -d dist 8000` und
<http://localhost:8000> öffnen.

### Hinweis Netlify/Vercel

Das Projekt läuft grundsätzlich auch auf Netlify oder Vercel (Build-
Kommando wie oben, Output `dist`; bei Netlify wird `netlify.toml`
automatisch gelesen). Das Redaktionssystem braucht dort denselben
GitHub-OAuth-Weg wie bei Cloudflare. Die Datei `netlify.toml` ist nur
für Netlify gedacht – auf Cloudflare Pages wird sie ignoriert.
**Empfohlen: Cloudflare Pages** (kostenlos, kommerziell erlaubt).
