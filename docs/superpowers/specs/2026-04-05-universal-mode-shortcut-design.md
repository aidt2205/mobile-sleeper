# Design: Universal Mode — Shortcut Onboarding Vereinfachung

**Datum:** 2026-04-05  
**Status:** Approved

## Problem

Der Universal-Modus setzt voraus, dass der User einen iOS Shortcut manuell erstellt. Das ist zu komplex — die Setup-Screen erklärt Schritte, die die meisten User nicht ausführen können. Der iCloud-Link ist ein Platzhalter (`REPLACE_ME`), der Shortcut existiert nicht wirklich.

## Lösung (Option B)

Dennis erstellt den Shortcut einmal auf seinem iPhone und teilt ihn als iCloud-Link. Dieser Link wird fest in die App eingebaut. User installieren den Shortcut mit 2 Taps — ohne jegliche manuelle Konfiguration.

## Der Shortcut

**Name:** `SleepTimer`  
**Aktionen (in dieser Reihenfolge):**
1. Helligkeit einstellen → 0%
2. Lautstärke einstellen → 0%
3. Fokus einschalten → "Nicht stören"

**Trigger:** Die App ruft `shortcuts://run-shortcut?name=SleepTimer&input={minutes}` auf, wenn der Timer endet.

## App-Änderungen

### `app/shortcuts/page.tsx`

**Vorher:** 3 Schritte textuell erklärt, User muss Shortcut selbst bauen.

**Nachher:**
- Kurze Einleitung: "Einmal installieren — danach setzt der Timer automatisch Helligkeit auf 0%, Ton aus und Nicht stören."
- Ein großer Button: **"Shortcut installieren"** → öffnet echten iCloud-Link
- Kleiner Link: "Bereits installiert →"

### `lib/shortcuts.ts` / `app/shortcuts/page.tsx`

`REPLACE_ME` wird durch den echten iCloud-Link ersetzt, den Dennis nach Shortcut-Erstellung teilt.

## Was NICHT geändert wird

- Die Trigger-Logik (`shortcuts://run-shortcut?name=SleepTimer`) bleibt unverändert
- Der "Bereits installiert"-Flow bleibt
- Der schwarze Sleep-Screen (`/sleep`) bleibt

## Ablauf nach Implementierung (User-Sicht)

1. User wählt Universal-Modus → tippt auf "Einrichten"
2. Setup-Screen: Kurzer Text + ein Button "Shortcut installieren"
3. Shortcut-App öffnet sich → "Hinzufügen" tippen → fertig
4. Zurück in der App: "Bereits installiert →" tippen
5. Timer läuft → am Ende: Helligkeit 0%, Ton aus, DND an

## Offene Voraussetzung

Dennis muss den Shortcut auf seinem iPhone erstellen und als iCloud-Link teilen, bevor die Implementierung abgeschlossen werden kann. Der Link wird dann in `app/shortcuts/page.tsx` Zeile 9 eingetragen.
