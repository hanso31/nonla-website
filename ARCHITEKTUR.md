# Datenarchitektur & Abläufe – Nón Lá Website

Dieses Dokument erklärt, wie die Website technisch funktioniert: wo die Daten
liegen, wie eine Änderung über das CMS die Seite erreicht und warum das Ganze
keine laufenden Kosten verursacht.

---

## 1. Die große Übersicht

```
 BETREIBER                          BESUCHER DER WEBSITE
 (Restaurant-Personal)              (Kundin / Gast)
      │                                   │
      │ Browser                           │ Browser
      ▼                                   ▼
 ┌───────────┐  1. Login    ┌───────────────────────┐
 │  /admin   │ ───────────► │  Cloudflare Pages     │
 │ (Decap    │ ◄─────────── │  (CDN, weltweit ~300  │
 │   CMS)    │  2. Token    │   Standorte)          │
 └─────┬─────┘              └───────────┬───────────┘
       │ 3. Speichern = Git-Commit      │ 7. Statische Dateien
       ▼                                ▼
 ┌───────────────────────────────────────────┐
 │  GITHUB  (github.com/hanso31/nonla-       │
 │  website) – das „Herz": EINZIGE           │
 │  Datenquelle, versionsgesichert           │
 │                                           │
 │  • content/    (Texte, Speisekarten,      │
 │                  Öffnungszeiten als YAML) │
 │  • images/     (alle Bilder)              │
 │  • templates/  (HTML-Grundgerüst)         │
 │  • build.py    (Bausteuerung)             │
 └───────────────┬───────────────────────────┘
                 │ 4. Webhook: „es hat sich
                 ▼  etwas geändert"
        ┌────────────────┐
        │ Cloudflare     │ 5. Build-Umgebung:
        │ Build-Server   │    pip install + python build.py
        │ (startet       │    → erzeugt dist/ (fertige
        │  automatisch)  │    HTML/CSS/JS aus content/)
        └───────┬────────┘
                │ 6. dist/ wird verteilt
                ▼
        ┌────────────────┐
        │ Cloudflare CDN │  ← daraus bedient der Besucher
        └────────────────┘          die Seite
```

---

## 2. Wo liegen die Daten – und nur dort?

| Daten | Ort | Was ist das? |
|---|---|---|
| **Alle Inhalte** (Texte DE/EN, Speisekarten, Buffet, Öffnungszeiten) | **GitHub-Repository**, Dateien in `content/` | Klartext-Dateien (YAML), menschenlesbar |
| **Alle Bilder** | GitHub-Repository, Ordner `images/` | Normale JPG/PNG-Dateien |
| **Design & Code** | GitHub-Repository (`templates/`, `styles-v2.css`, `script-v2.js`) | HTML-Vorlagen mit Platzhaltern |
| **Fertige Website** (HTML, die der Browser zeigt) | **Cloudflare Pages** – wird bei jeder Änderung neu erzeugt und auf ~300 Servern weltweit verteilt | Reine statische Dateien, kein Server-Programm |
| **Datenbank** | **existiert nicht** | – |
| ** eigener Server beim Restaurant** | **existiert nicht** | – |

**Wichtig:** GitHub ist die einzige „Wahrheit". Die fertige Seite bei
Cloudflare ist nur ein aus den Quelldaten erzeugter Snapshot – jederzeit
komplett neu baubar (ein Befehl: `python build.py`).

---

## 3. Der Ablauf einer CMS-Änderung (Schritt für Schritt)

1. **Login:** Die Betreiberin öffnet `https://nonla-website.pages.dev/admin`
   und meldet sich mit ihrem GitHub-Konto an. Der Login läuft über eine
   kleine Serverfunktion direkt auf der Seite (`/api/auth`, Bestandteil des
   Projekts) – Dank OAuth muss kein Passwort in der Website gespeichert
   werden.
2. **Bearbeiten:** Decap CMS zeigt Formulare (Wochenbuffet, Speisekarten,
   Öffnungszeiten, Texte). Die Inhalte werden dabei direkt aus den
   `content/`-Dateien von GitHub geladen.
3. **Veröffentlichen:** Ein Klick auf „Publish" erzeugt automatisch einen
   **Commit** (eine gespeicherte Änderung mit Zeitstempel und Autor) im
   GitHub-Repository – inklusive hochgeladener Bilder.
4. **Webhook:** GitHub benachrichtigt Cloudflare Pages: „Es gibt etwas
   Neues."
5. **Build (ca. 30–60 Sek.):** Cloudflare startet eine frische
   Bau-Umgebung, installiert Python, und führt aus:
   `python3 -m pip install -r requirements.txt && python3 build.py`.
   Das Skript `build.py` füllt die Platzhalter in den HTML-Vorlagen mit den
   aktuellen Inhalten aus `content/` – das Ergebnis ist der Ordner `dist/`
   mit den 8 fertigen HTML-Seiten, dem JavaScript und allen Bildern.
6. **Verteilung:** Cloudflare kopiert das Ergebnis auf sein weltweites
   CDN-Netz (Content Delivery Network).
7. **Online:** Ab jetzt sehen alle Besucher die neue Version. Gesamtdauer
   ab „Publish": typisch **1–2 Minuten**.

## 4. Der Ablauf eines normalen Seitenaufrufs

```
Besucher ruft nonla-website.pages.dev auf
        │
        ▼
Cloudflare leitet den Request an den geografisch NÄCHSTEN
Edge-Server weiter (Zürich, Frankfurt, Amsterdam …)
        │
        ▼
Der Edge-Server liefert die fertige, statische HTML-Datei –
OHNE Datenbankabfrage, OHNE Serverprogramm, in Millisekunden
```

- Es gibt **keinen zentralen Server**, der „läuft" und gewartet werden
  müsste – nur verteilte Kopien statischer Dateien.
- Das Einzige, was je „rechnet", ist der Build (Schritt 5, einmal pro
  Änderung, dauert <1 Minute) und die Login-Funktion beim CMS.

---

## 5. Warum kostet das nichts?

| Komponente | Anbieter | Kosten | Warum free möglich ist |
|---|---|---|---|
| Code- & Datenspeicherung | GitHub (Free Plan) | CHF 0 | Private Repos, unbegrenzte Speicherdauer und mehrere Mitarbeitende sind im Gratistarif enthalten |
| Builds & Hosting & CDN | Cloudflare Pages (Free Plan) | CHF 0 | Kostenlos inkl. unlimitiertem Traffic; Fair-Use-Grenze liegt bei 500 Builds/Monat – weit über dem Bedarf (hier: wenige Builds pro Woche) |
| Redaktionssystem | Decap CMS | CHF 0 | Open Source (freie Software, kein Lizenzmodell) |
| Datenbank | – | CHF 0 | Existiert nicht – Dateien statt Datenbank |
| SSL-Verschlüsselung | Cloudflare | CHF 0 | Automatisch inklusive |

**Die ökonomische Logik dahinter:** GitHub und Cloudflare finanzieren sich
über zahlende Großkunden (Konzerne). Kleine statische Projekte wie diese
Website verursachen dort minimalen Aufwand – der Gratistarif ist für
solche Fälle gedacht und kommerziell ausdrücklich erlaubt. Es gibt
**kein Abo, keine Vertragslaufzeit, keine Kündigungsfalle**.

## 6. Sicherheit, Backups, Wiederherstellung

- **Versionsgeschichte = automatisches Backup:** Jede Änderung (auch jede
  Fehländerung) ist ein eigener Commit in GitHub mit Zeitstempel und
  Autor. „Früher war alles besser" = im GitHub-Verlauf die alte Datei
  anklicken und zurückholen. Gelöschte Inhalte sind praktisch nie endgültig
  verloren.
- **Keine klassischen Angriffsflächen:** Kein WordPress-Plugin, keine
  Datenbank, kein Server-Login, das jemand knacken könnte. Die öffentliche
  Seite besteht nur aus statischen Dateien.
- **Zugangskontrolle:** Ins CMS kommt nur, wer als „Collaborator" ins
  private GitHub-Repository eingeladen wurde. Beim Ausscheiden eines
  Mitarbeitenden dessen Zugriff im Repository entfernen – fertig.
- **Verschlüsselung:** HTTPS ist automatisch aktiv (von Cloudflare).

## 7. Wer ist wofür zuständig (Betrieb)

| Aufgabe | Wer | Wie oft |
|---|---|---|
| Inhalte pflegen (Buffet, Preise, Zeiten, Texte, Bilder) | Restaurant via `/admin` | nach Bedarf, jederzeit |
| Benutzer für CMS verwalten (einladen/entfernen) | GitHub-Repo-Admin (Erdem) | bei Personalwechsel |
| Domain anbinden (falls eigene Adresse wie nonla.ch) | Cloudflare-Dashboard | einmalig |
| Technische Wartung (Updates, Sicherheitsfixes) | **niemand nötig** – gibt es nicht | – |
| Kosten bezahlen | **niemand** | – |

## 8. Was passiert bei einem Totalausfall eines Anbieters?

- **GitHub fällt aus:** Die Website läuft ungestört weiter (Cloudflare hat
  eine Kopie). Änderungen sind erstmal blockiert, kein Datenverlust.
- **Cloudflare fällt aus:** Szenario praktisch irrelevant (weltweit
  verteiltes Netz), aber selbst dann: Repository inklusive Build-Skript
  ist vollständig – die Seite kann innerhalb von Stunden auf einem
  beliebigen anderen Static-Hosting (Netlify, Vercel, GitHub Pages)
  wiederhergestellt werden. **Vendor-Lock-in gibt es praktisch nicht.**
