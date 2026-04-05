# Design: SleepTimerOff — Aufwachen-Button

**Datum:** 2026-04-05  
**Status:** Approved

## Problem

Nach einer Schlaf-Session mit dem Universal-Modus ist das iPhone in einem "Sleep State": Helligkeit 0%, Lautstärke 0%, Nicht stören aktiv, Flugmodus aktiv. Es gibt keinen Weg, diesen Zustand über die App zurückzusetzen.

## Lösung

Auf dem Shortcuts Trigger-Screen (wenn `setupDone = true`) wird ein zweiter Button "Aufwachen" hinzugefügt, der den `SleepTimerOff` Shortcut auslöst.

## Shortcut

**Name:** `SleepTimerOff`  
**iCloud-Link:** `https://www.icloud.com/shortcuts/62c4a7bda90f46008e21a316c55f23a6`  
**Aktionen:**

1. Flugmodus → ausschalten
2. Nicht stören → ausschalten
3. Helligkeit → 50%
4. Lautstärke → 50%

## App-Änderung

### `app/shortcuts/page.tsx` — Trigger-Screen (setupDone = true)

**Neue Konstante** am Anfang der Datei (bereits hinzugefügt):

```ts
const ICLOUD_SHORTCUT_OFF_URL = 'https://www.icloud.com/shortcuts/62c4a7bda90f46008e21a316c55f23a6'
```

**Neue `handleWakeUp` Funktion:**

```ts
const handleWakeUp = () => {
  window.location.href = 'shortcuts://run-shortcut?name=SleepTimerOff'
}
```

**Neuer Button** unterhalb von "Shortcut starten", visuell getrennt durch einen Divider:

```tsx
<div className="w-full h-px bg-zinc-800" />
<button
  onClick={handleWakeUp}
  className="py-4 rounded-full bg-zinc-800 text-white text-lg font-medium w-full max-w-sm"
>
  🌅 Aufwachen
</button>
```

## Was NICHT geändert wird

- Setup-Screen (setupDone = false) — kein Aufwachen-Button dort
- YouTube-Modus — nicht betroffen
- `/sleep` Screen — nicht betroffen

## Ablauf (User-Sicht)

1. Morgens aufwachen → Sleeper App öffnen
2. Automatisch auf dem Shortcuts Trigger-Screen (Universal-Modus war zuletzt aktiv, setupDone = true)
3. "Aufwachen" tippen → Shortcuts-App öffnet SleepTimerOff
4. Flugmodus aus, DND aus, Helligkeit 50%, Lautstärke 50%
