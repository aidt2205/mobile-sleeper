# Design: Universal Mode — Shortcut Onboarding Vereinfachung

**Datum:** 2026-04-05  
**Status:** Approved

## Problem

Der Universal-Modus setzt voraus, dass der User einen iOS Shortcut manuell erstellt. Das ist zu komplex — die Setup-Screen erklärt Schritte, die die meisten User nicht ausführen können. Der iCloud-Link ist ein Platzhalter (`REPLACE_ME`), der Shortcut existiert nicht.

## Lösung (Option B)

Dennis erstellt den Shortcut einmal auf seinem iPhone und teilt ihn als iCloud-Link. Dieser Link wird in die Konstante `ICLOUD_SHORTCUT_URL` in `app/shortcuts/page.tsx` eingetragen. User installieren den Shortcut mit 2 Taps — ohne jegliche manuelle Konfiguration.

## Der Shortcut

**Name:** `SleepTimer`  
**Aktionen (in dieser Reihenfolge):**

1. Warte → Input (Minuten, übergeben per URL-Parameter)
2. Helligkeit einstellen → 0%
3. Lautstärke einstellen → 0%
4. Fokus einschalten → "Nicht stören"

**Trigger-Zeitpunkt:** User tappt "Shortcut starten" am Anfang der Sleep-Session. Der Shortcut läuft dann im Hintergrund, wartet die eingestellten Minuten, und führt danach die Aktionen aus. Die App ruft dazu `shortcuts://run-shortcut?name=SleepTimer&input={minutes}` auf.

## App-Änderungen

### `app/shortcuts/page.tsx` — Einzige Code-Änderung

Die aktuelle Implementierung zeigt ein `STEPS`-Array mit 3 nummerierten Schritten (textuell erklärt, wie man den Shortcut manuell baut). Diese 3 Schritte werden durch eine kürzere Einleitung ersetzt:

**Vorher:** 3 Schritte textuell erklärt, impliziert manuelles Bauen des Shortcuts.

**Nachher:**
- Kurze Einleitung: "Einmal installieren — danach setzt der Timer automatisch Helligkeit auf 0%, Ton aus und Nicht stören."
- Ein großer Button: **"Shortcut installieren"** → öffnet `ICLOUD_SHORTCUT_URL`
- Kleiner Link: "Bereits installiert →" (bleibt unverändert)

Außerdem: `ICLOUD_SHORTCUT_URL` (Konstante am Anfang der Datei) wird von `REPLACE_ME` auf den echten iCloud-Link gesetzt.

### Was NICHT geändert wird

- Trigger-Logik (`shortcuts://run-shortcut?name=SleepTimer`)
- "Bereits installiert"-Flow
- Schwarzer Sleep-Screen (`/sleep`)
- Alle anderen Dateien

## Ablauf nach Implementierung (User-Sicht)

1. User wählt Universal-Modus → tippt auf "Einrichten"
2. Setup-Screen: Kurzer Text + Button "Shortcut installieren"
3. Shortcuts-App öffnet sich → "Hinzufügen" tippen → fertig
4. Zurück in der App: "Bereits installiert →" tippen
5. Timer starten → Shortcut läuft im Hintergrund → nach X Minuten: Helligkeit 0%, Ton aus, DND an

## Offene Voraussetzung

Dennis muss den Shortcut auf seinem iPhone erstellen und als iCloud-Link teilen. Bis dahin bleibt `ICLOUD_SHORTCUT_URL` auf `REPLACE_ME` — der Button ist sichtbar, führt aber ins Leere. Sobald der Link vorliegt, wird er in die Konstante eingetragen und neu deployed.

## Nicht-iOS-Geräte

Der `shortcuts://`-Deep-Link funktioniert nur auf iOS. Kein Handling nötig für dieses Release — die App richtet sich explizit an iPhone-User.
