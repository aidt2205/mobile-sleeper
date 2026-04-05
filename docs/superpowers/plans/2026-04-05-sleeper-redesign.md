# Sleeper App — Obsidian Sanctuary Redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das bestehende Sleeper-App-Design (aktuell: schwarz/weiß, Emoji-basiert, zinc-Palette) auf das "Obsidian Sanctuary" Design System umstellen — ohne die Logik, deutsche Texte oder Funktionalität zu verändern.

**Architecture:** Schrittweiser Ansatz: Erst das Design-System als Foundation einführen (Farben, Fonts, globale Styles). Dann jede Seite einzeln umstellen — dabei wird nur das CSS/Tailwind geändert, nie die Logik. Die Stitch-HTMLs in `stitch/` dienen als visuelle Referenz, werden aber NICHT kopiert — stattdessen werden die Tailwind-Klassen manuell auf die bestehenden Komponenten angewendet.

**Tech Stack:** Next.js 16, Tailwind CSS v4 (`@theme`-Syntax, kein `tailwind.config.ts`), TypeScript

**Kritische Regel:** Tailwind v4 nutzt `@theme { --color-*: ... }` statt `tailwind.config.theme.extend.colors`. Farben mit Bindestrichen wie `surface-container-lowest` werden zu Klassen wie `bg-surface-container-lowest`. Opacity-Modifier (`/40`) funktionieren mit `@theme`-Farben nur wenn sie als einfache Hex-Werte definiert sind (kein `rgb()`).

**Referenz-Dateien (nicht verändern, nur lesen):**
- `stitch/hypnos_dark/DESIGN.md` — Design-System-Regeln
- `stitch/home_mode_selector/screen.png` + `code.html` — Home-Screen Referenz
- `stitch/youtube_player_timer/screen.png` + `code.html` — Player-Screen Referenz
- `stitch/shortcuts_setup/screen.png` + `code.html` — Shortcuts-Screen Referenz
- `stitch/minimal_sleep_view/screen.png` + `code.html` — Sleep-Screen Referenz

---

### Task 1: Design-System Foundation — globals.css + layout.tsx

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

Dieses Task legt die Farbpalette, Fonts und globalen Styles an. Danach können alle Komponenten die Design-Tokens nutzen.

- [ ] **Step 1: `@theme`-Block in globals.css hinzufügen**

Öffne `app/globals.css` und ersetze den gesamten Inhalt durch:

```css
@import "tailwindcss";

@theme {
  /* Surface Hierarchy — DESIGN.md: "Ink and Glass" Layering */
  --color-surface: #121319;
  --color-surface-dim: #121319;
  --color-surface-container-lowest: #0d0e14;
  --color-surface-container-low: #1a1b21;
  --color-surface-container: #1e1f26;
  --color-surface-container-high: #292a30;
  --color-surface-container-highest: #34343b;
  --color-surface-bright: #383940;
  --color-surface-variant: #34343b;
  --color-surface-tint: #bac3ff;

  /* Primary */
  --color-primary: #bac3ff;
  --color-primary-container: #00115e;
  --color-on-primary: #15267b;
  --color-on-primary-container: #707fd5;

  /* Secondary */
  --color-secondary: #ffb954;
  --color-secondary-container: #c3841b;
  --color-on-secondary: #452b00;
  --color-on-secondary-container: #3c2500;

  /* Tertiary */
  --color-tertiary: #b1cad7;
  --color-tertiary-container: #051f29;
  --color-on-tertiary: #1c333e;

  /* On-Surface */
  --color-on-surface: #e3e1ea;
  --color-on-surface-variant: #c8c5cd;
  --color-on-background: #e3e1ea;
  --color-background: #121319;

  /* Outline */
  --color-outline: #919097;
  --color-outline-variant: #47464c;

  /* Error */
  --color-error: #ffb4ab;
  --color-error-container: #93000a;
  --color-on-error: #690005;

  /* Inverse */
  --color-inverse-surface: #e3e1ea;
  --color-inverse-on-surface: #2f3037;
  --color-inverse-primary: #4858ab;

  /* Font Families */
  --font-headline: "Plus Jakarta Sans", sans-serif;
  --font-body: "Manrope", sans-serif;
  --font-label: "Manrope", sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  min-height: 100dvh;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

:root {
  color-scheme: dark;
}

/* Material Symbols */
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
```

- [ ] **Step 2: Fonts in layout.tsx einrichten**

Ersetze `app/layout.tsx` vollständig:

```tsx
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-headline',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Sleeper',
  description: 'Sleep timer für YouTube und alle Apps',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sleeper',
  },
}

export const viewport: Viewport = {
  themeColor: '#121319',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${plusJakarta.variable} ${manrope.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-dvh font-body">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Build-Check**

Run: `npm run build`
Expected: Build succeeds. Alle Seiten rendern korrekt — optisch noch identisch da Komponenten noch nicht umgestellt sind (die alten `bg-zinc-*` / `bg-black` Klassen in den Komponenten überschreiben lokal die Body-Styles).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add Obsidian Sanctuary design tokens and fonts"
```

---

### Task 2: Home-Page (`app/page.tsx`) umstellen

**Files:**
- Modify: `app/page.tsx`

**Referenz:** `stitch/home_mode_selector/screen.png`
**Regel:** Logik bleibt 1:1. Nur Tailwind-Klassen ändern. Texte bleiben Deutsch.

- [ ] **Step 1: page.tsx umstellen**

Ersetze den Inhalt von `app/page.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { ModeToggle, Mode } from '@/components/ModeToggle'
import { TimerPicker } from '@/components/TimerPicker'
import { AutoLockBanner } from '@/components/AutoLockBanner'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function HomePage() {
  const router = useRouter()
  const [mode, setMode] = useLocalStorage<Mode>('sleeper-mode', 'youtube')
  const [minutes, setMinutes] = useLocalStorage<number>('sleeper-minutes', 30)
  const [bannerDismissed, setBannerDismissed] = useLocalStorage<boolean>('sleeper-banner-dismissed', false)

  const handleStart = () => {
    const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 30
    if (mode === 'youtube') {
      router.push(`/player?minutes=${safeMinutes}`)
    } else {
      router.push(`/shortcuts?minutes=${safeMinutes}`)
    }
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-dvh px-6 py-12 gap-8">
      <div className="flex flex-col items-center gap-2">
        <span
          className="material-symbols-outlined text-4xl text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          bedtime
        </span>
        <h2 className="text-2xl font-headline font-bold tracking-tight text-primary">
          Sleeper
        </h2>
        <p className="text-on-surface-variant text-sm font-label">Sleep Timer</p>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        {!bannerDismissed && (
          <AutoLockBanner onDismiss={() => setBannerDismissed(true)} />
        )}
        <ModeToggle value={mode} onChange={setMode} />
        <TimerPicker value={minutes} onChange={setMinutes} />
      </div>

      <button
        onClick={handleStart}
        className="w-full max-w-sm py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-xl font-headline font-bold active:scale-95 transition-transform duration-500"
      >
        Timer starten
      </button>
    </main>
  )
}
```

**Änderungen vs. Original:**
- Emoji `🌙` → Material Symbol `bedtime` mit `text-primary`
- `text-white` → `text-primary` / `text-on-surface`
- `text-zinc-500` → `text-on-surface-variant`
- `bg-white text-black rounded-full` → `bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl` (laut DESIGN.md)
- Font-Klassen hinzugefügt (`font-headline`, `font-label`)
- Alle Texte unverändert (Deutsch)

- [ ] **Step 2: Build-Check**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: apply Obsidian Sanctuary design to home page"
```

---

### Task 3: ModeToggle Komponente umstellen

**Files:**
- Modify: `components/ModeToggle.tsx`

**Referenz:** Stitch home_mode_selector — der "Select Mode" Bereich mit zwei nebeneinander liegenden Buttons in einem `bg-surface-container` Container.

- [ ] **Step 1: ModeToggle.tsx umstellen**

Ersetze den Inhalt von `components/ModeToggle.tsx`:

```tsx
'use client'

export type Mode = 'youtube' | 'universal'

interface ModeToggleProps {
  value: Mode
  onChange: (mode: Mode) => void
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-2 p-1.5 bg-surface-container rounded-2xl w-full">
      {(['youtube', 'universal'] as Mode[]).map((mode) => {
        const active = value === mode
        return (
          <button
            key={mode}
            aria-pressed={active}
            onClick={() => onChange(mode)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
              text-base font-body font-medium transition-all duration-500
              ${active
                ? 'bg-surface-container-highest text-on-surface'
                : 'text-on-surface-variant'
              }
            `}
          >
            <span
              className={`material-symbols-outlined text-lg ${active && mode === 'youtube' ? 'text-error' : ''}`}
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {mode === 'youtube' ? 'smart_display' : 'language'}
            </span>
            {mode === 'youtube' ? 'YouTube' : 'Universal'}
          </button>
        )
      })}
    </div>
  )
}
```

**Änderungen vs. Original:**
- `bg-zinc-900 rounded-full` → `bg-surface-container rounded-2xl`
- Active: `bg-white text-black` → `bg-surface-container-highest text-on-surface`
- Inactive: `text-zinc-400` → `text-on-surface-variant`
- Material Icons hinzugefügt (`smart_display`, `language`)
- Texte unverändert ("YouTube", "Universal")

- [ ] **Step 2: Build-Check**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/ModeToggle.tsx
git commit -m "feat: apply Obsidian Sanctuary design to ModeToggle"
```

---

### Task 4: TimerPicker Komponente umstellen

**Files:**
- Modify: `components/TimerPicker.tsx`

**Referenz:** Stitch home_mode_selector — Preset-Chips (`15`, `30`, `45`, `60`) + Custom-Input-Feld darunter.
**Regel:** Kein kreisförmiger Timer-Ring! Das war Stitch-Deko. Die Presets [15, 30, 45, 60] bleiben exakt wie sie sind.

- [ ] **Step 1: TimerPicker.tsx umstellen**

Ersetze den Inhalt von `components/TimerPicker.tsx`:

```tsx
'use client'

const PRESETS = [15, 30, 45, 60]

interface TimerPickerProps {
  value: number
  onChange: (minutes: number) => void
}

export function TimerPicker({ value, onChange }: TimerPickerProps) {
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10)
    if (isNaN(raw)) return
    onChange(Math.min(180, Math.max(1, raw)))
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            aria-pressed={value === preset}
            onClick={() => onChange(preset)}
            className={`
              py-4 rounded-full text-xl font-label font-semibold transition-all duration-500
              ${value === preset
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container-highest text-on-surface-variant'
              }
            `}
          >
            {preset}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-on-surface-variant text-sm font-label flex-1">
          Eigene Zeit (Min)
        </span>
        <input
          type="number"
          min={1}
          max={180}
          value={value}
          onChange={handleCustomChange}
          className="bg-surface-container-lowest text-on-surface text-xl text-center w-20 py-3 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  )
}
```

**Änderungen vs. Original:**
- Preset active: `bg-white text-black` → `bg-secondary-container text-on-secondary-container` (amber-Ton laut DESIGN.md)
- Preset inactive: `bg-zinc-900 text-zinc-400` → `bg-surface-container-highest text-on-surface-variant`
- `rounded-2xl` → `rounded-full` (Chips laut DESIGN.md)
- Input: `bg-zinc-900 border-zinc-800` → `bg-surface-container-lowest border-none focus:ring-primary/20`
- Text "Eigene Zeit (Min)" unverändert

- [ ] **Step 2: Build-Check**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/TimerPicker.tsx
git commit -m "feat: apply Obsidian Sanctuary design to TimerPicker"
```

---

### Task 5: AutoLockBanner Komponente umstellen

**Files:**
- Modify: `components/AutoLockBanner.tsx`

**Referenz:** Stitch home_mode_selector — der Warning-Banner oben. Aber: Text bleibt der originale deutsche Auto-Lock-Hinweis, NICHT der Stitch-Dummy-Text.

- [ ] **Step 1: AutoLockBanner.tsx umstellen**

Ersetze den Inhalt von `components/AutoLockBanner.tsx`:

```tsx
'use client'

interface AutoLockBannerProps {
  onDismiss: () => void
}

export function AutoLockBanner({ onDismiss }: AutoLockBannerProps) {
  return (
    <div className="bg-surface-container-low p-4 rounded-2xl flex gap-4 items-start relative w-full">
      <div className="bg-secondary/20 p-2 rounded-full">
        <span
          className="material-symbols-outlined text-secondary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
      </div>
      <p className="text-on-surface-variant text-sm flex-1 leading-relaxed">
        Für beste Ergebnisse: iOS <strong className="text-on-surface">Auto-Lock auf 1–2 Min</strong> stellen
        (Einstellungen → Anzeige & Helligkeit)
      </p>
      <button
        onClick={onDismiss}
        aria-label="Banner schließen"
        className="text-on-surface-variant hover:text-on-surface transition-colors duration-500"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  )
}
```

**Änderungen vs. Original:**
- `bg-zinc-900 border border-zinc-700` → `bg-surface-container-low` (keine Border — DESIGN.md "No-Line" Regel)
- Emoji `⚠️` → Material Symbol `warning` mit `text-secondary`
- `text-zinc-300` → `text-on-surface-variant`
- Close-Button: `×` Text → Material Symbol `close`
- Text bleibt 1:1 Deutsch!

- [ ] **Step 2: Build-Check**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/AutoLockBanner.tsx
git commit -m "feat: apply Obsidian Sanctuary design to AutoLockBanner"
```

---

### Task 6: Player-Seite (`app/player/page.tsx`) umstellen

**Files:**
- Modify: `app/player/page.tsx`
- Modify: `components/CountdownDisplay.tsx`

**Referenz:** Stitch youtube_player_timer — URL-Input, Video-Player, Timer-Anzeige, +5m/Reset Buttons.
**Regel:** Keine neuen Features (keine Sleep Presets Sidebar, kein Audio Fade Slider — das sind Player-Features die noch nicht existieren). Nur das bestehende UI restylen.

- [ ] **Step 1: CountdownDisplay.tsx umstellen**

Ersetze den Inhalt von `components/CountdownDisplay.tsx`:

```tsx
interface CountdownDisplayProps {
  seconds: number
}

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds)
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function CountdownDisplay({ seconds }: CountdownDisplayProps) {
  return (
    <span className="font-headline text-on-surface text-sm font-semibold tabular-nums">
      {formatTime(seconds)}
    </span>
  )
}
```

**Änderungen:** `text-white font-mono` → `font-headline text-on-surface font-semibold`

- [ ] **Step 2: player/page.tsx umstellen**

Ersetze den Inhalt von `app/player/page.tsx`:

```tsx
'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { YouTubePlayer } from '@/components/YouTubePlayer'
import { CountdownDisplay } from '@/components/CountdownDisplay'
import { WakeCheckOverlay } from '@/components/WakeCheckOverlay'
import { useTimer } from '@/hooks/useTimer'
import { useWakeLock } from '@/hooks/useWakeLock'
import { extractVideoId } from '@/lib/youtube'

function PlayerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const minutes = parseInt(searchParams.get('minutes') ?? '30', 10)

  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [urlError, setUrlError] = useState('')
  const [showWakeCheck, setShowWakeCheck] = useState(false)

  const playerRef = useRef<YTPlayer | null>(null)
  const { remaining, state, start, extend, reset } = useTimer(minutes)
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock()

  const handlePlayerReady = () => {
    start()
    requestWakeLock()
  }

  useEffect(() => {
    if (state === 'expired') setShowWakeCheck(true)
  }, [state])

  const handleWakeContinue = () => {
    setShowWakeCheck(false)
    extend()
    requestWakeLock()
  }

  const handleWakeSleep = () => {
    setShowWakeCheck(false)
    releaseWakeLock()
    playerRef.current?.stopVideo()
    router.push('/sleep')
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = extractVideoId(url)
    if (!id) {
      setUrlError('Kein gültiger YouTube-Link')
      return
    }
    setUrlError('')
    setVideoId(id)
  }

  return (
    <main className="flex flex-col min-h-dvh bg-surface relative">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => { releaseWakeLock(); reset(); router.push('/') }}
          className="text-on-surface-variant text-sm px-2 py-1 flex items-center gap-1 hover:text-on-surface transition-colors duration-500"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Zurück
        </button>
        <CountdownDisplay seconds={remaining} />
        <div className="w-16" />
      </div>

      {!videoId && (
        <div className="flex flex-col items-center justify-center flex-1 px-6 gap-4">
          <p className="text-on-surface-variant text-sm text-center font-label">
            YouTube-Link einfügen
          </p>
          <form onSubmit={handleUrlSubmit} className="flex flex-col gap-3 w-full max-w-sm">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="bg-surface-container-lowest text-on-surface px-4 py-4 rounded-2xl text-base border-none focus:outline-none focus:ring-2 focus:ring-primary/20 w-full font-body placeholder:text-on-surface-variant/40"
              autoFocus
            />
            {urlError && <p className="text-error text-sm">{urlError}</p>}
            <button
              type="submit"
              className="py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg transition-transform duration-500 active:scale-95"
            >
              Video laden
            </button>
          </form>
        </div>
      )}

      {videoId && (
        <div className="flex-1 flex flex-col">
          <YouTubePlayer videoId={videoId} playerRef={playerRef} onReady={handlePlayerReady} />
        </div>
      )}

      {showWakeCheck && (
        <WakeCheckOverlay onContinue={handleWakeContinue} onSleep={handleWakeSleep} />
      )}
    </main>
  )
}

export default function PlayerPage() {
  return (
    <Suspense>
      <PlayerContent />
    </Suspense>
  )
}
```

**Änderungen vs. Original:**
- `bg-black` → `bg-surface`
- `text-zinc-400` → `text-on-surface-variant`
- `bg-zinc-900 border border-zinc-800` → `bg-surface-container-lowest border-none focus:ring-primary/20`
- `bg-white text-black` → `bg-gradient-to-br from-primary to-primary-container text-on-primary`
- `text-red-400` → `text-error`
- `← Zurück` → Material Symbol `arrow_back` + "Zurück"
- Alle Texte bleiben Deutsch

- [ ] **Step 3: Build-Check**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/player/page.tsx components/CountdownDisplay.tsx
git commit -m "feat: apply Obsidian Sanctuary design to player page"
```

---

### Task 7: WakeCheckOverlay umstellen

**Files:**
- Modify: `components/WakeCheckOverlay.tsx`

**Referenz:** Stitch youtube_player_timer — der "Still drifting?" Overlay mit Progress-Ring.
**Regel:** Text bleibt Deutsch ("Noch wach?", "Ja, weiterschauen"). Countdown bleibt bei 60s (nicht 15s wie im Stitch-Dummy).

- [ ] **Step 1: WakeCheckOverlay.tsx umstellen**

Ersetze den Inhalt von `components/WakeCheckOverlay.tsx`:

```tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { playBeep } from '@/lib/audio'

interface WakeCheckOverlayProps {
  onContinue: () => void
  onSleep: () => void
}

export function WakeCheckOverlay({ onContinue, onSleep }: WakeCheckOverlayProps) {
  const [countdown, setCountdown] = useState(60)
  const onSleepRef = useRef(onSleep)
  onSleepRef.current = onSleep

  useEffect(() => {
    playBeep()
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onSleepRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const progress = ((60 - countdown) / 60) * 100

  return (
    <div className="absolute inset-0 bg-surface/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 z-50">
      <p className="font-headline text-2xl font-bold text-on-surface">
        Noch wach?
      </p>

      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="var(--color-surface-container-highest)"
            strokeWidth="4"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-headline text-2xl font-bold text-on-surface">
          {countdown}
        </span>
      </div>

      <button
        onClick={onContinue}
        className="px-10 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-headline font-bold transition-transform duration-500 active:scale-95"
      >
        Ja, weiterschauen
      </button>
    </div>
  )
}
```

**Änderungen vs. Original:**
- `bg-black/95 animate-pulse` → `bg-surface/95 backdrop-blur-xl` (kein Pulsieren — DESIGN.md: sanfte Transitions)
- `text-zinc-400 text-6xl font-mono` Countdown → SVG Progress-Ring (aus Stitch-Referenz)
- Emoji `🌙` entfernt
- Button: `bg-white text-black rounded-full` → `bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl`
- Text: "Noch wach?" und "Ja, weiterschauen" bleiben Deutsch
- Countdown bleibt bei 60 Sekunden

- [ ] **Step 2: Build-Check**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/WakeCheckOverlay.tsx
git commit -m "feat: apply Obsidian Sanctuary design to WakeCheckOverlay"
```

---

### Task 8: Shortcuts-Seite (`app/shortcuts/page.tsx`) umstellen

**Files:**
- Modify: `app/shortcuts/page.tsx`

**Referenz:** Stitch shortcuts_setup — Setup-Flow (zwei Install-Buttons) + Active-State (Start/Wake Buttons).
**Regel:** Texte bleiben Deutsch. Keine neuen Features (keine Bento-Tip-Cards, keine Config-Card). Nur das bestehende UI restylen.

- [ ] **Step 1: shortcuts/page.tsx umstellen**

Ersetze den Inhalt von `app/shortcuts/page.tsx`:

```tsx
'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { buildShortcutLink } from '@/lib/shortcuts'

const ICLOUD_SHORTCUT_URL = 'https://www.icloud.com/shortcuts/e0ab8a9e48014166bd0e8891df09bc29'
const ICLOUD_SHORTCUT_OFF_URL = 'https://www.icloud.com/shortcuts/62c4a7bda90f46008e21a316c55f23a6'

function ShortcutsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const minutes = parseInt(searchParams.get('minutes') ?? '30', 10)
  const [setupDone, setSetupDone] = useLocalStorage<boolean>('sleeper-shortcut-setup', false)

  const handleTrigger = () => {
    window.location.href = buildShortcutLink(minutes)
  }

  const handleWakeUp = () => {
    window.location.href = 'shortcuts://run-shortcut?name=SleepTimerOff'
  }

  if (setupDone) {
    return (
      <main className="flex flex-col items-center justify-center min-h-dvh px-6 gap-8">
        <div className="flex flex-col items-center gap-2">
          <span
            className="material-symbols-outlined text-5xl text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Sleep Timer</h2>
          <p className="text-on-surface-variant text-sm font-label">
            {minutes} Min · Helligkeit 0% · Do Not Disturb
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={handleTrigger}
            className="py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-xl font-headline font-bold transition-transform duration-500 active:scale-95"
          >
            Shortcut starten
          </button>
          <p className="text-on-surface-variant/60 text-xs text-center font-label">
            Wechsle danach zu Netflix, YouTube oder einer anderen App
          </p>
          <button
            onClick={handleWakeUp}
            className="py-4 rounded-xl bg-surface-container-high text-secondary text-lg font-headline font-semibold flex items-center justify-center gap-2 transition-transform duration-500 active:scale-95"
          >
            <span className="material-symbols-outlined">wb_sunny</span>
            Aufwachen
          </button>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-on-surface-variant text-sm font-label flex items-center gap-1 hover:text-on-surface transition-colors duration-500"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Zurück
        </button>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-dvh px-6 py-12 gap-8">
      <button
        onClick={() => router.push('/')}
        className="text-on-surface-variant text-sm self-start font-label flex items-center gap-1 hover:text-on-surface transition-colors duration-500"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Zurück
      </button>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-headline font-bold text-on-surface">
          Einmalige Einrichtung
        </h2>
        <p className="text-on-surface-variant text-sm font-body leading-relaxed">
          Installiere beide Shortcuts — Schlafen und Aufwachen. Danach läuft alles automatisch.
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-auto">
        <a
          href={ICLOUD_SHORTCUT_URL}
          className="flex items-center justify-center gap-3 py-5 rounded-xl bg-surface-container-low text-on-surface text-xl font-headline font-bold text-center hover:bg-surface-container-high transition-colors duration-500"
        >
          <span className="material-symbols-outlined text-primary">timer</span>
          SleepTimer installieren
        </a>
        <a
          href={ICLOUD_SHORTCUT_OFF_URL}
          className="flex items-center justify-center gap-3 py-4 rounded-xl bg-surface-container-low text-on-surface text-lg font-headline font-semibold text-center hover:bg-surface-container-high transition-colors duration-500"
        >
          <span className="material-symbols-outlined text-secondary">timer_off</span>
          SleepTimerOff installieren
        </a>
        <button
          onClick={() => setSetupDone(true)}
          className="py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold transition-transform duration-500 active:scale-95"
        >
          Beide installiert → Weiter
        </button>
      </div>
    </main>
  )
}

export default function ShortcutsPage() {
  return (
    <Suspense>
      <ShortcutsContent />
    </Suspense>
  )
}
```

**Änderungen vs. Original:**
- Emoji `⏱️` → Material Symbol `timer` mit `text-secondary`
- `bg-white text-black rounded-full` → `bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl`
- `bg-zinc-800` → `bg-surface-container-high text-secondary`
- `text-zinc-400/500/600` → `text-on-surface-variant`
- Divider `bg-zinc-800` → entfernt (DESIGN.md "No-Line" Regel)
- Emoji `🌙` `🌅` → Material Symbols
- `← Zurück` → Material Symbol + Text
- Alle Texte unverändert (Deutsch)

- [ ] **Step 2: Build-Check**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/shortcuts/page.tsx
git commit -m "feat: apply Obsidian Sanctuary design to shortcuts page"
```

---

### Task 9: Sleep-Seite (`app/sleep/page.tsx`) umstellen

**Files:**
- Modify: `app/sleep/page.tsx`

**Referenz:** Stitch minimal_sleep_view — fast schwarzer Screen mit kaum sichtbarem Text und Tap-to-exit.
**Regel:** Minimaler Screen, deutsche Texte.

- [ ] **Step 1: sleep/page.tsx umstellen**

Ersetze den Inhalt von `app/sleep/page.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function SleepPage() {
  const router = useRouter()

  return (
    <main className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden bg-surface-container-lowest">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[80px] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,19,25,0)_0%,rgba(13,14,20,1)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-6">
        <span
          className="material-symbols-outlined text-secondary/20 text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          bedtime
        </span>
        <span className="font-label text-sm tracking-widest text-on-surface/10 uppercase">
          Schlafmodus aktiv
        </span>
      </div>

      {/* Exit instruction */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center z-20">
        <p className="font-label text-xs tracking-widest text-on-surface/10 font-medium">
          Tippen zum Fortfahren
        </p>
      </div>

      {/* Full-screen tap target */}
      <button
        aria-label="Schlafmodus beenden"
        onClick={() => router.push('/')}
        className="absolute inset-0 w-full h-full cursor-none z-50 bg-transparent outline-none focus:outline-none"
      />
    </main>
  )
}
```

**Änderungen vs. Original:**
- `bg-black` → `bg-surface-container-lowest` + Ambient-Glow (aus Stitch-Referenz)
- `text-zinc-800` → `text-on-surface/10` (fast unsichtbar)
- Hinzugefügt: `bedtime` Icon und "Schlafmodus aktiv" (sehr dezent, `opacity: 10%`)
- "Tippen zum Fortfahren" bleibt Deutsch
- aria-label Deutsch

- [ ] **Step 2: Build-Check**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/sleep/page.tsx
git commit -m "feat: apply Obsidian Sanctuary design to sleep page"
```

---

### Task 10: Finaler Gesamttest

- [ ] **Step 1: Vollständiger Build**

Run: `npm run build`
Expected: Build erfolgreich, keine TypeScript-Fehler, keine Warnungen.

- [ ] **Step 2: Visueller Check im Browser**

Run: `npm run dev`

Prüfe manuell:
1. Home-Seite: Dunkler Hintergrund (#121319), Primary-farbener Titel, Mode-Toggle mit Icons, Preset-Chips mit Amber-Active-State, Gradient-Button
2. Player-Seite: URL-Input mit Surface-Lowest Background, Back-Button mit Arrow-Icon
3. Shortcuts-Seite: Setup-Flow mit Material Icons, Gradient-Buttons
4. Sleep-Seite: Fast schwarzer Screen mit minimalem Ambient-Glow

- [ ] **Step 3: Commit (falls noch nicht alles committed)**

```bash
git status
```

Alle Änderungen sollten bereits committed sein.
