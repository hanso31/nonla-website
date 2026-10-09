# -*- coding: utf-8 -*-
"""
Build-Script für die Nón Lá-Website.

Liest die Inhalte aus content/*.yml und die Vorlagen aus templates/
und erzeugt daraus die fertige Website im Ordner dist/.

Aufruf:
    python build.py            # Website nach dist/ bauen
    python build.py --verify   # bauen UND mit den Originaldateien in
                               # original/ vergleichen (Qualitätssicherung)

Marken in den Vorlagen (templates/):
    @@i18n:SCHLUESSEL@@   wird durch den deutschen Text dieses Schlüssels ersetzt
    @@block:NAME@@        wird durch einen generierten HTML-Block ersetzt
    @@en_entries@@        (nur script-v2.js) englisches Übersetzungs-Verzeichnis
    @@hours@@             (nur script-v2.js) Öffnungszeiten für die Statusanzeige
"""

import re
import shutil
import sys
from pathlib import Path

import yaml

if sys.stdout.encoding and sys.stdout.encoding.lower() not in ("utf-8", "utf8"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent
TEMPLATES = ROOT / "templates"
CONTENT = ROOT / "content"
DIST = ROOT / "dist"
ORIGINAL = ROOT / "original"

HTML_PAGES = [
    "index.html",
    "bestellen.html",
    "reservieren.html",
    "catering.html",
    "speisekarte-markthalle.html",
    "speisekarte-spalenbrunnen-mittag.html",
    "speisekarte-spalenbrunnen-abend.html",
    "speisekarte-klara.html",
]

# Wochentage: Reihenfolge wie im JavaScript-Objekt HOURS (0 = Sonntag)
WEEKDAYS_JS = ["so", "mo", "di", "mi", "do", "fr", "sa"]
WEEKDAY_COMMENT = {"so": " // Sunday"}

# Aufbau des englischen Übersetzungs-Verzeichnisses in script-v2.js:
# zuerst die allgemeinen Texte aus texte.yml (in Dateireihenfolge),
# dazwischen – nach bestimmten Schlüsseln – die Blöcke der Speisekarten.
EN_SPLIT_AFTER = {
    "ft.menus": "kk",      # Klara
    "loc.feedback": "mk",  # Alte Markthalle
    "rz.title": "sa",      # Spalenbrunnen abends
}
EN_LAST_BLOCK = "sm"       # Spalenbrunnen mittags + Buffet (am Ende)


class BuildError(Exception):
    pass


def load_yaml(name):
    path = CONTENT / name
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def js_escape(value):
    """Zeichenketten für JavaScript-Doppelanführungszeichen vorbereiten."""
    return value.replace("\\", "\\\\").replace('"', '\\"')


# --------------------------------------------------------------------------
# Inhalte laden und zum globalen Text-Verzeichnis zusammenführen
# --------------------------------------------------------------------------

def load_all_content():
    data = {
        "texte": load_yaml("texte.yml"),
        "zeiten": load_yaml("oeffnungszeiten.yml"),
        "buffet": load_yaml("buffet.yml"),
        "menus": {
            "markthalle": load_yaml("speisekarte-markthalle.yml"),
            "klara": load_yaml("speisekarte-klara.yml"),
            "mittag": load_yaml("speisekarte-spalenbrunnen-mittag.yml"),
            "abend": load_yaml("speisekarte-spalenbrunnen-abend.yml"),
        },
    }

    # Globales Verzeichnis: Schluessel -> {"de": ..., "en": ...}
    texts = {}

    def put(key, de=None, en=None, quelle="", de_varianten=None):
        if key in texts:
            raise BuildError(f"Schlüssel doppelt vergeben: {key} ({quelle})")
        texts[key] = {"de": de, "en": en,
                      "de_varianten": de_varianten or {}}

    # 1) Allgemeine Texte (texte.yml, Liste von Einträgen)
    for eintrag in data["texte"]["eintraege"]:
        put(eintrag["schluessel"], eintrag.get("de"), eintrag.get("en"),
            "texte.yml", eintrag.get("de_varianten"))

    # 1b) Technische Text-Varianten (nicht ueber das CMS bearbeitbar)
    varianten_file = CONTENT / "_varianten.yml"
    if varianten_file.exists():
        with open(varianten_file, encoding="utf-8") as f:
            for key, seiten in (yaml.safe_load(f) or {}).items():
                if key in texts:
                    texts[key]["de_varianten"].update(seiten or {})

    # 2) Speisekarten: Seitentexte, Kategorien, Gerichte
    for menu_key, menu in data["menus"].items():
        prefix = menu["prefix"]
        for key, werte in (menu.get("texte") or {}).items():
            put(f"{prefix}.{key}", werte.get("de"), werte.get("en"),
                f"speisekarte-{menu_key}.yml")
        for kat in menu.get("kategorien") or []:
            if kat.get("i18n"):
                put(f"{prefix}.{kat['i18n']}", kat.get("name_de"),
                    kat.get("name_en"), f"speisekarte-{menu_key}.yml")
            for dish in kat.get("gerichte") or []:
                register_dish(texts, put, prefix, dish, menu_key)

    # 3) Buffet (Wochenkarte mittags): Tagesnamen + Gerichte
    sm = data["menus"]["mittag"]  # sm-Texte sind bereits oben registriert
    for tag in data["buffet"]["tage"]:
        put(f"sm.{tag['id']}.day", tag["tag_de"], tag["tag_en"], "buffet.yml")
        for nr, gericht in enumerate(tag["gerichte"], start=1):
            put(f"sm.{tag['id']}.i{nr}", gericht["de"], gericht["en"],
                "buffet.yml")
            put(f"sm.{tag['id']}.i{nr}s", gericht["sub_de"], gericht["sub_en"],
                "buffet.yml")

    data["texts"] = texts
    return data


def register_dish(texts, put, prefix, dish, menu_key):
    quelle = f"speisekarte-{menu_key}.yml"
    did = dish["id"]
    put(f"{prefix}.{did}", dish.get("text_de"), dish.get("text_en"), quelle)
    if dish.get("tags_de") is not None or dish.get("tags_en") is not None:
        put(f"{prefix}.{did}.tags", dish.get("tags_de"), dish.get("tags_en"),
            quelle)
    for extra in dish.get("tags_extra") or []:
        put(f"{prefix}.{extra['id']}", extra.get("de"), extra.get("en"),
            quelle)
        tags_de = dish.get("tags_de") or ""
        needle = f'data-i18n="{prefix}.{extra["id"]}"'
        if needle not in tags_de:
            raise BuildError(
                f"{quelle}: Gericht {prefix}.{did}: tags_extra "
                f"'{extra['id']}' fehlt in tags_de")
    for nr, variante in enumerate(dish.get("varianten") or [], start=1):
        put(f"{prefix}.{did}.v{nr}", variante.get("de"), variante.get("en"),
            quelle)


# --------------------------------------------------------------------------
# Generatoren für HTML-Blöcke
# --------------------------------------------------------------------------

def gen_price_line(dish):
    if dish.get("preis_leerzeile"):
        return "<span></span>"
    preis = dish.get("preis")
    if not preis:
        return None
    zusatz = dish.get("preis_zusatz")
    if zusatz:
        return (f'<span class="dish-row__price">{preis}'
                f"<small>{zusatz}</small></span>")
    return f'<span class="dish-row__price">{preis}</span>'


def gen_dish(prefix, dish, texts, with_code):
    did = dish["id"]
    lines = []
    if dish.get("layout") == "bild":
        lines.append(
            f'<div class="dish-row dish-row--img">'
            f'<img alt="{dish["alt"]}" class="dish-row__img" loading="lazy" '
            f'src="{dish["bild"]}"/>'
            f'<div class="dish-card__body">')
        if with_code and dish.get("code"):
            lines.append(f'<span class="dish-row__code">{dish["code"]}</span>')
    else:
        lines.append('<div class="dish-row">')
    lines.append(f'<p class="dish-row__name">{dish["name"]}')
    lines.append(f'    <small data-i18n="{prefix}.{did}">'
                 f'{dish["text_de"]}</small>')
    lines.append('</p>')
    price = gen_price_line(dish)
    if price is not None:
        lines.append(price)
    if dish.get("tags_de") is not None:
        lines.append(
            '<p class="dish-row__name" style="grid-column:1/-1;font-size:.85rem;'
            f'color:var(--muted)"><span data-i18n="{prefix}.{did}.tags">'
            f'{dish["tags_de"]}</span></p>')
    varianten = dish.get("varianten") or []
    if varianten:
        lines.append('<div class="dish-variants">')
        for nr, v in enumerate(varianten, start=1):
            lines.append(f'<span data-i18n="{prefix}.{did}.v{nr}">{v["de"]}'
                         f'</span> <b>{v["preis"]}</b>')
        lines.append('</div>')
    if dish.get("layout") == "bild":
        lines.append('</div></div>')
    else:
        lines.append('</div>')
    return "\n".join(lines)


def gen_dish_list(prefix, gerichte, texts, with_code):
    """Gerichte einer Kategorie; aufeinanderfolgende Bild-Gerichte werden
    in ein <div class="dish-grid"> zusammengefasst (wie im Original)."""
    parts = []
    grid_open = False
    for dish in gerichte:
        is_bild = dish.get("layout") == "bild"
        if is_bild and not grid_open:
            parts.append('<div class="dish-grid">')
            grid_open = True
        elif not is_bild and grid_open:
            parts.append('</div>')
            grid_open = False
        parts.append(gen_dish(prefix, dish, texts, with_code))
    if grid_open:
        parts.append('</div>')
    # dish-grid schliesst direkt, einfache Zeilen stehen einzeln;
    # Trennung exakt wie im Original: grid-Blöcke und rows ohne
    # zusaetzlichen Zeilenumbruch aneinandergereiht.
    out = []
    for part in parts:
        out.append(part)
    return "".join(out)


def gen_buffet(data):
    texts = data["texts"]
    sub_de = texts["sm.buffet-sub"]["de"]
    served_de = texts["sm.served"]["de"]
    articles = []
    for tag in data["buffet"]["tage"]:
        tid = tag["id"]
        lines = [
            '<article class="buffet-day reveal">',
            f'<h3 class="buffet-day__title" data-i18n="sm.{tid}.day">'
            f'{tag["tag_de"]}</h3>',
            f'<p class="buffet-day__sub" data-i18n="sm.buffet-sub">'
            f'{sub_de}</p>',
            '<ul>',
        ]
        for nr, gericht in enumerate(tag["gerichte"], start=1):
            lines.append(
                f'<li data-i18n="sm.{tid}.i{nr}">{gericht["de"]}'
                f'<small data-i18n="sm.{tid}.i{nr}s">'
                f'{gericht["sub_de"]}</small></li>')
        lines += [
            '</ul>',
            f'<p class="buffet-day__served" data-i18n="sm.served">'
            f'{served_de}</p>',
            f'<p class="buffet-day__price">{tag["preis"]}</p>',
            '</article>',
        ]
        articles.append("\n".join(lines))
    return " ".join(articles)


def gen_hours_list(data, standort):
    texts = data["texts"]
    zeilen = data["zeiten"]["standorte"][standort]["zeilen"]
    out = []
    for z in zeilen:
        tage_key = z["tage"]
        tage_de = texts[tage_key]["de"]
        if tage_de is None:
            raise BuildError(f"Öffnungszeiten: kein deutscher Text für "
                             f"'{tage_key}' (texte.yml)")
        if z.get("geschlossen"):
            zeit = (f'<b data-i18n="loc.closed">'
                    f'{texts["loc.closed"]["de"]}</b>')
        else:
            zeit = f'<b>{z["zeit"]}</b>'
        out.append(f'                <li><span data-i18n="{tage_key}">'
                   f'{tage_de}</span>{zeit}</li>')
    return "\n".join(out)


def gen_bestellzeiten(data):
    texts = data["texts"]
    out = []
    for z in data["zeiten"]["bestellzeiten"]:
        tage_key = z["tage"]
        tage_de = texts[tage_key]["de"]
        if tage_de is None:
            raise BuildError(f"Bestellzeiten: kein deutscher Text für "
                             f"'{tage_key}' (texte.yml)")
        out.append(f'              <tr><td data-i18n="{tage_key}">'
                   f'{tage_de}</td><td>{z["zeit"]}</td></tr>')
    return "\n".join(out)


def build_blocks(data):
    texts = data["texts"]
    menus = data["menus"]
    blocks = {}
    for menu_key, menu in menus.items():
        prefix = menu["prefix"]
        with_code = bool(menu.get("codes"))
        for kat in menu.get("kategorien") or []:
            block_name = f"{prefix}-{kat['id']}"
            blocks[block_name] = gen_dish_list(
                prefix, kat.get("gerichte") or [], texts, with_code)
    blocks["buffet"] = gen_buffet(data)
    for standort in ("spalenbrunnen", "markthalle", "klara"):
        blocks[f"hours-{standort}"] = gen_hours_list(data, standort)
    blocks["bestellzeiten"] = gen_bestellzeiten(data)
    return blocks


# --------------------------------------------------------------------------
# script-v2.js: englisches Verzeichnis + Status-Öffnungszeiten
# --------------------------------------------------------------------------

def collect_menu_en(data, prefix):
    """Alle en-Einträge eines Schluessel-Präfixes, alphabetisch sortiert."""
    entries = {
        k: v["en"] for k, v in data["texts"].items()
        if k.startswith(prefix + ".") and v["en"] is not None
    }
    return sorted(entries.items())


def gen_en_entries(data):
    lines = []
    emitted_menus = set()

    def emit_menu(prefix):
        for key, value in collect_menu_en(data, prefix):
            lines.append(f'      "{key}": "{js_escape(value)}",')
        emitted_menus.add(prefix)

    for eintrag in data["texte"]["eintraege"]:
        key = eintrag["schluessel"]
        en = eintrag.get("en")
        if en is not None:
            lines.append(f'      "{key}": "{js_escape(en)}",')
        if key in EN_SPLIT_AFTER:
            emit_menu(EN_SPLIT_AFTER[key])
    emit_menu(EN_LAST_BLOCK)
    return "\n".join(lines)


def parse_time(value):
    stunden, minuten = value.strip().split(":")
    return int(stunden) * 60 + int(minuten)


def gen_hours_js(data):
    status = data["zeiten"]["status"]
    lines = []
    for index, tag in enumerate(WEEKDAYS_JS):
        roh = (status.get(tag) or "").strip()
        if not roh:
            eintrag = "null"
        else:
            spans = []
            for teil in roh.split(","):
                von, bis = teil.strip().split("-")
                spans.append(f"[{parse_time(von)}, {parse_time(bis)}]")
            eintrag = "[" + ", ".join(spans) + "]"
        kommentar = WEEKDAY_COMMENT.get(tag, "")
        lines.append(f"    {index}: {eintrag},{kommentar}")
    return "\n".join(lines)


# --------------------------------------------------------------------------
# Vorlagen verarbeiten
# --------------------------------------------------------------------------

def render_template(text, data, blocks, name):
    texts = data["texts"]

    def ersetze_text(match):
        key = match.group(1)
        eintrag = texts.get(key)
        if eintrag is None or eintrag["de"] is None:
            raise BuildError(
                f"{name}: @@i18n:{key}@@ – kein deutscher Text vorhanden "
                f"(texte.yml bzw. Speisekarten-Datei fehlt)")
        # Manche Original-Seiten haben denselben Text minimal anders
        # formatiert (z. B. Attributreihenfolge) – dafuer gibt es Varianten.
        return eintrag["de_varianten"].get(name, eintrag["de"])

    out = re.sub(r"@@i18n:([A-Za-z0-9._-]+)@@", ersetze_text, text)

    def ersetze_block(match):
        block_name = match.group(1)
        if block_name not in blocks:
            raise BuildError(f"{name}: unbekannter Block '@@block:"
                             f"{block_name}@@'")
        return blocks[block_name]

    out = re.sub(r"@@block:([A-Za-z0-9._-]+)@@", ersetze_block, out)

    if "@@en_entries@@" in out:
        out = out.replace("@@en_entries@@", gen_en_entries(data))
    if "@@hours@@" in out:
        out = out.replace("@@hours@@", gen_hours_js(data))

    rest = re.search(r"@@[A-Za-z0-9._:-]+@@", out)
    if rest:
        raise BuildError(f"{name}: nicht ersetzte Marke: {rest.group(0)}")
    return out


def build(verify=False):
    data = load_all_content()
    blocks = build_blocks(data)

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()

    for name in HTML_PAGES + ["script-v2.js"]:
        template_text = (TEMPLATES / name).read_text(encoding="utf-8")
        rendered = render_template(template_text, data, blocks, name)
        # immer LF schreiben (unabhaengig vom Betriebssystem)
        with open(DIST / name, "w", encoding="utf-8", newline="\n") as f:
            f.write(rendered)

    shutil.copy2(ROOT / "styles-v2.css", DIST / "styles-v2.css")
    shutil.copytree(ROOT / "images", DIST / "images")
    shutil.copytree(ROOT / "admin", DIST / "admin")

    print(f"Gebaut: {len(HTML_PAGES)} Seiten + script-v2.js -> dist/")

    if verify:
        verify_against_original()


# --------------------------------------------------------------------------
# Qualitätssicherung: Vergleich mit den Originaldateien
# --------------------------------------------------------------------------

JS_ENTRY_RE = re.compile(r'^      "((?:[^"\\]|\\.)+)": '
                         r'"((?:[^"\\]|\\.)*)",$')


def js_unescape(value):
    return value.replace('\\"', '"').replace("\\\\", "\\")


def parse_en_entries(text):
    entries = {}
    for line in text.split("\n"):
        m = JS_ENTRY_RE.match(line)
        if m:
            entries[js_unescape(m.group(1))] = js_unescape(m.group(2))
    return entries


def strip_en_entries(text):
    return "\n".join(
        line for line in text.split("\n") if not JS_ENTRY_RE.match(line))


def verify_against_original():
    fehler = 0
    for name in HTML_PAGES:
        neu = (DIST / name).read_text(encoding="utf-8")
        alt = (ORIGINAL / name).read_text(encoding="utf-8")
        if neu == alt:
            print(f"  OK      {name}")
        else:
            fehler += 1
            print(f"  FEHLER  {name} weicht vom Original ab")
            _zeige_unterschied(alt, neu)

    neu_js = (DIST / "script-v2.js").read_text(encoding="utf-8")
    alt_js = (ORIGINAL / "script-v2.js").read_text(encoding="utf-8")
    if neu_js == alt_js:
        print("  OK      script-v2.js")
    else:
        # Reihenfolge der Übersetzungen darf abweichen – Inhalt muss stimmen
        if parse_en_entries(alt_js) != parse_en_entries(neu_js):
            fehler += 1
            print("  FEHLER  script-v2.js: Übersetzungen abweichend")
            _vergleiche_en(alt_js, neu_js)
        elif strip_en_entries(alt_js) != strip_en_entries(neu_js):
            fehler += 1
            print("  FEHLER  script-v2.js: Code/HOURS abweichend")
            _zeige_unterschied(strip_en_entries(alt_js),
                               strip_en_entries(neu_js))
        else:
            print("  OK      script-v2.js (nur Reihenfolge der "
                  "Übersetzungen anders)")

    for name in ["styles-v2.css"]:
        if (DIST / name).read_bytes() != (ROOT / name).read_bytes():
            fehler += 1
            print(f"  FEHLER  {name} abweichend")
    original_images = sorted(p.name for p in (ROOT / "images").iterdir())
    dist_images = sorted(p.name for p in (DIST / "images").iterdir())
    if original_images != dist_images:
        fehler += 1
        print("  FEHLER  images/ abweichend")

    if fehler:
        print(f"VERIFY: {fehler} Datei(en) weichen ab!")
        sys.exit(1)
    print("VERIFY: Alle Dateien stimmen mit dem Original überein.")


def _zeige_unterschied(alt, neu):
    alt_lines = alt.split("\n")
    neu_lines = neu.split("\n")
    import difflib
    diff = list(difflib.unified_diff(alt_lines, neu_lines, lineterm="",
                                     n=1))
    for line in diff[:40]:
        print("    " + line[:300])
    if len(diff) > 40:
        print(f"    ... ({len(diff) - 40} weitere Diff-Zeilen)")


def _vergleiche_en(alt_js, neu_js):
    alt = parse_en_entries(alt_js)
    neu = parse_en_entries(neu_js)
    for key in sorted(set(alt) | set(neu)):
        if key not in alt:
            print(f"    nur neu: {key}")
        elif key not in neu:
            print(f"    nur alt: {key}")
        elif alt[key] != neu[key]:
            print(f"    anders: {key}\n      alt: {alt[key][:120]}\n"
                  f"      neu: {neu[key][:120]}")


if __name__ == "__main__":
    build(verify="--verify" in sys.argv)
