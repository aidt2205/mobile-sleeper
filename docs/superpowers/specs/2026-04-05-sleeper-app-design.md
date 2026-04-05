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
- Timer-Auswahl: Presets (15 / 30 / 45 / 60 Min) + Custom-Input (Zahlenfeld, 1–180 Min)
- Start-Button startet den gewählten Modus
- Hinweis-Banner beim ersten Start: "Für beste Ergebnisse iOS Auto-Lock auf 1-2 Min stellen" (einmalig, dismissbar, in `localStorage` gespeichert)

### 2. YouTube Player Screen
- Vollbild YouTube IFrame Player
- Kleiner Countdown-Timer oben eingeblendet
- Video-Eingabe: URL-Eingabefeld (YouTube-Links direkt — keine Suchfunktion)
- Bei Timer-Ablauf: "Noch wach?" Overlay mit 60-Sek Countdown + Blink-Effekt + Beep-Ton (Web Audio API)
- Keine Reaktion → Video stoppt + schwarzes Overlay (Sleep Overlay Screen)
- User tippt auf Overlay → Timer wird um die zuletzt gewählte Dauer verlängert, Video läuft weiter

### 3. Shortcuts Setup Screen
- Einmalige Einrichtung (erscheint nur beim ersten Start im Universal-Modus)
- Schritt-für-Schritt Anleitung mit Screenshots
- iCloud-Link zum direkten Installieren des vorkonfigurierten Shortcuts
- Der Shortcut nimmt die Dauer als Input-Parameter entgegen (kein fixer Wert)
- Nach Setup: "Shortcut starten"-Button triggert Deep Link mit gewählter Dauer als Parameter

### 4. Sleep Overlay Screen
- OLED-schwarzer Vollbild-Screen
- Kleines "Tippen zum Fortfahren" am unteren Rand
- iOS Auto-Lock (vom User auf 1-2 Min eingestellt) sperrt das Gerät danach automatisch

---

## UX-Flows

### YouTube-Flow (Hauptfall)
1. App öffnen → Preset oder Custom-Timer wählen
2. YouTube-URL einfügen → Video starten
3. Wake Lock aktiviert (verhindert automatisches Dimmen während Timer läuft)
4. Timer läuft als Countdown sichtbar
5. Ablauf → "Noch wach?" + 60-Sek Countdown + Blink-Effekt + Beep-Ton
6a. Keine Reaktion → Wake Lock freigeben → Video stoppt + schwarzes Overlay
6b. User tippt → Timer verlängert sich um ursprüngliche Dauer, Video läuft weiter
7. iOS Auto-Lock → Gerät gesperrt ✅

### Universal-Flow (Netflix, TikTok etc.)
1. App öffnen → Universal-Modus → Timer-Dauer wählen → "Shortcut starten"
2. Deep Link: `shortcuts://run-shortcut?name=SleepTimer&input=30` (Dauer als Parameter)
3. iOS Shortcut startet, User wechselt zu gewünschter App (Netflix etc.)
4. Nach X Minuten: iOS setzt Helligkeit auf 0% + aktiviert Do Not Disturb
5. iOS Auto-Lock → Gerät gesperrt ✅

### Shortcut-Einrichtung (einmalig)
1. Erster Start im Universal-Modus → Setup-Screen
2. iCloud-Link → Shortcut wird installiert
3. Shortcut-Inhalt: Input-Parameter als Wartezeit (Minuten) → Helligkeit 0% → Do Not Disturb an
4. Einmalig, danach transparent im Hintergrund

---

## Technischer Stack

| Bereich | Entscheidung |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| PWA | next-pwa (Service Worker, installierbar) |
| Video | YouTube IFrame API (URL-only, keine Suche) |
| Screen aktiv halten | Wake Lock API (`navigator.wakeLock.request('screen')`, iOS ab 16.4) |
| "Noch wach?"-Signal | Web Audio API (kurzer Beep) + CSS Blink-Overlay |
| State | React useState/useContext |
| Persistenz | localStorage (Timer-Präferenzen, Onboarding-Flags) |
| Backend | Keins |
| Auth | Keine Accounts |

---

## Design-Prinzipien

- **OLED-schwarz** (`#000000`) als Hintergrund — kein Licht im Dunkeln
- **Große Tap-Targets** — präzises Tippen wenn halb eingeschlafen nicht möglich
- **Minimale Interaktion** — max. 2 Taps vom Start bis zum laufenden Timer
- **Kein Onboarding** — außer einmaliger Shortcut-Setup und Auto-Lock-Hinweis beim ersten Start

---

## Technische Details

**Timer-Logik:**
- `setTimeout` + `setInterval` für Countdown
- Page Visibility API: verfolgt verstrichene Zeit bei kurzem Hintergrund-Wechsel und synchronisiert den Countdown beim Zurückkehren (Timer läuft durch, pausiert nicht)
- Wake Lock API: aktiv während Timer läuft, wird bei Sleep-Overlay freigegeben
- "Noch wach?"-Signal: Web Audio API (440Hz Beep, 0.5 Sek) + stark blinkendes weißes Overlay

**Shortcuts-Integration:**
- Deep Link mit Parameter: `shortcuts://run-shortcut?name=SleepTimer&input=<minuten>`
- Vorkonfigurierter Shortcut wird als iCloud-Link bereitgestellt
- Shortcut-Aktionen: Warte (Input-Minuten) → Set Brightness (0%) → Set Focus (Do Not Disturb)

**YouTube-Integration:**
- YouTube IFrame API für Player-Kontrolle (play, pause, stop)
- Nur URL-Eingabe — keine Suche (kein API-Key, kein Backend nötig)
- Video-ID wird aus eingegebener YouTube-URL extrahiert (Regex)

**PWA-Installation:**
- Manifest mit `display: standalone` für Fullscreen ohne Safari-UI
- Einmaliger Hinweis "Zum Home-Bildschirm hinzufügen" beim ersten Öffnen

---

## Out of Scope

- Native iOS App / Xcode
- YouTube-Suche (erfordert API-Key + Backend)
- Video-Inhalte außer YouTube direkt in der App streamen
- User Accounts / Cloud-Sync
- Android-spezifische Features
- Kontrolle fremder Apps (iOS-Sandbox-Limitierung)
- `navigator.vibrate()` (nicht unterstützt auf iOS)
