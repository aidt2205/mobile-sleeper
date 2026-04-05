# Sleeper App — Design Spec
**Datum:** 2026-04-05  
**Status:** Approved

---

## Problem

Nutzer schaut abends Videos auf dem iPhone (YouTube, Netflix, etc.), schläft dabei ein. Das Handy bleibt die ganze Nacht eingeschaltet und liegt direkt am Kopf. Es fehlt ein Sleep-Timer — ähnlich wie der TV-Sleep-Timer — der nach einer definierten Zeit ohne Reaktion das Gerät effektiv "abschaltet".

---

## Lösung: Hybrid PWA

Eine installierbare PWA (Next.js) mit zwei Modi:

1. **YouTube-Modus** — App ist der Video-Player. Vollständige Sleep-Timer-Kontrolle.
2. **Universal-Modus** — iOS Shortcut wird getriggert. Funktioniert systemweit mit jeder App (Netflix, TikTok etc.).

---

## Screens

### 1. Home Screen
- Modus-Toggle: YouTube / Universal
- Timer-Auswahl: Presets (15 / 30 / 45 / 60 Min) + Custom-Input
- Start-Button startet den gewählten Modus

### 2. YouTube Player Screen
- Vollbild YouTube IFrame Player
- Kleiner Countdown-Timer oben eingeblendet
- Bei Timer-Ablauf: "Noch wach?" Overlay mit 60-Sek Countdown + Vibration
- Keine Reaktion → Video stoppt, schwarzes Overlay

### 3. Shortcuts Setup Screen
- Einmalige Einrichtung (erscheint nur beim ersten Start im Universal-Modus)
- Schritt-für-Schritt Anleitung
- iCloud-Link zum direkten Installieren des vorkonfigurierten Shortcuts
- Nach Setup: "Shortcut starten"-Button triggert Deep Link

### 4. Sleep Overlay Screen
- OLED-schwarzer Vollbild-Screen
- Kleines "Tippen zum Fortfahren" am unteren Rand
- iOS Auto-Lock (empfohlen: 1-2 Min) sperrt das Gerät danach automatisch

---

## UX-Flows

### YouTube-Flow (Hauptfall)
1. App öffnen → Preset oder Custom-Timer wählen
2. YouTube-URL eingeben oder Suchbegriff → Video starten
3. Timer läuft als Countdown sichtbar
4. Ablauf → "Noch wach?" + 60-Sek Countdown + Vibration
5. Keine Reaktion → Video stoppt + schwarzes Overlay
6. iOS Auto-Lock → Gerät gesperrt ✅

### Universal-Flow (Netflix, TikTok etc.)
1. App öffnen → Universal-Modus → Timer setzen → "Shortcut starten"
2. Deep Link triggert iOS Shortcut
3. User wechselt zu gewünschter App (Netflix etc.)
4. Nach X Minuten: iOS setzt Helligkeit auf 0% + aktiviert Do Not Disturb
5. iOS Auto-Lock → Gerät gesperrt ✅

### Shortcut-Einrichtung (einmalig)
1. Erster Start im Universal-Modus → Setup-Screen
2. iCloud-Link → Shortcut wird installiert
3. Shortcut-Inhalt: Warte X Min → Helligkeit 0% → Do Not Disturb an
4. Einmalig, danach transparent im Hintergrund

---

## Technischer Stack

| Bereich | Entscheidung |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| PWA | next-pwa (Service Worker, installierbar) |
| Video | YouTube IFrame API |
| State | React useState/useContext |
| Persistenz | localStorage (Timer-Präferenzen) |
| Backend | Keins |
| Auth | Keine Accounts |

---

## Design-Prinzipien

- **OLED-schwarz** (`#000000`) als Hintergrund — kein Licht im Dunkeln
- **Große Tap-Targets** — präzises Tippen wenn halb eingeschlafen nicht möglich
- **Minimale Interaktion** — max. 2 Taps vom Start bis zum laufenden Timer
- **Kein Onboarding** — außer einmaliger Shortcut-Setup beim ersten Universal-Modus-Start

---

## Technische Details

**Timer-Logik:**
- `setTimeout` + `setInterval` für Countdown
- Page Visibility API: Timer pausiert wenn App in den Hintergrund geht (YouTube-Modus)
- `navigator.vibrate()` für "Noch wach?" Signal

**Shortcuts-Integration:**
- Deep Link: `shortcuts://run-shortcut?name=SleepTimer`
- Vorkonfigurierter Shortcut wird als iCloud-Link bereitgestellt
- Shortcut-Aktionen: Set Brightness (0%) + Set Focus (Do Not Disturb)

**PWA-Installation:**
- Manifest mit `display: standalone` für Fullscreen ohne Safari-UI
- iOS: "Zum Home-Bildschirm hinzufügen" Anleitung beim ersten Öffnen

---

## Out of Scope

- Native iOS App / Xcode
- Video-Inhalte außer YouTube direkt in der App streamen
- User Accounts / Cloud-Sync
- Android-spezifische Features
- Kontrolle fremder Apps (iOS-Sandbox-Limitierung)
