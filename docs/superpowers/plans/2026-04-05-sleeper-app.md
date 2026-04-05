# Sleeper App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js PWA sleep timer with YouTube player mode and iOS Shortcuts universal mode.

**Architecture:** Next.js 14 App Router PWA. Four pages (Home, Player, Shortcuts Setup, Sleep Overlay). Core logic split into focused hooks (useTimer, useWakeLock, useLocalStorage) and utility libs (youtube.ts, shortcuts.ts, audio.ts). No backend, no auth, localStorage only.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, next-pwa, YouTube IFrame API, Wake Lock API, Web Audio API, Jest + React Testing Library

---

## File Map

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout: dark bg, PWA meta tags |
| `app/page.tsx` | Home Screen: mode toggle, timer picker, start |
| `app/player/page.tsx` | YouTube Player Screen: video + timer + wake check |
| `app/shortcuts/page.tsx` | Shortcuts Setup + trigger screen |
| `app/sleep/page.tsx` | Sleep Overlay: OLED black, tap to continue |
| `app/globals.css` | Global CSS reset, OLED black base |
| `components/ModeToggle.tsx` | YouTube / Universal segmented control |
| `components/TimerPicker.tsx` | Preset buttons + custom number input |
| `components/AutoLockBanner.tsx` | One-time dismissable Auto-Lock hint |
| `components/CountdownDisplay.tsx` | Formats seconds → MM:SS display |
| `components/YouTubePlayer.tsx` | YouTube IFrame API wrapper component |
| `components/WakeCheckOverlay.tsx` | "Noch wach?" overlay: 60s countdown, blink, beep |
| `hooks/useLocalStorage.ts` | Generic localStorage state hook |
| `hooks/useTimer.ts` | Countdown with Page Visibility sync |
| `hooks/useWakeLock.ts` | Wake Lock API with silent error handling |
| `lib/youtube.ts` | Extract video ID from YouTube URL |
| `lib/shortcuts.ts` | Build `shortcuts://` deep link with duration param |
| `lib/audio.ts` | Web Audio API 440Hz beep |
| `types/youtube.d.ts` | YT IFrame API global type declarations |
| `public/manifest.json` | PWA manifest (standalone, black theme) |
| `next.config.js` | next-pwa integration |
| `jest.config.js` | Jest config for Next.js |
| `jest.setup.ts` | @testing-library/jest-dom |

---

### Task 1: Project Bootstrap

**Files:**
- Create: `package.json`, `next.config.js`, `tailwind.config.js`, `tsconfig.json`, `jest.config.js`, `jest.setup.ts`

- [ ] **Step 1: Scaffold Next.js project**

Run in the `mobile-sleeper` directory (already exists with git repo):

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

Expected: project files created in current directory.

- [ ] **Step 2: Install extra dependencies**

```bash
npm install next-pwa
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest ts-jest
```

- [ ] **Step 3: Configure Jest**

Create `jest.config.js`:

```js
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

module.exports = createJestConfig({
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
})
```

Create `jest.setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Add to `package.json` scripts section:

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 4: Configure next-pwa**

Replace `next.config.js` with:

```js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withPWA(nextConfig)
```

- [ ] **Step 5: Run tests to verify setup**

```bash
npm test -- --passWithNoTests
```

Expected: "Test Suites: 0 passed" (no tests yet, setup valid)

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: bootstrap Next.js 14 PWA project with Jest"
```

---

### Task 2: PWA Manifest & Icons

**Files:**
- Create: `public/manifest.json`
- Create: `public/icon-192.png`, `public/icon-512.png`

- [ ] **Step 1: Create PWA manifest**

Create `public/manifest.json`:

```json
{
  "name": "Sleeper",
  "short_name": "Sleeper",
  "description": "Sleep timer für YouTube und alle anderen Apps",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 2: Generate placeholder icons**

Run this to create minimal black PNG placeholders:

```bash
node -e "
const fs = require('fs');
// Minimal valid black PNG (8x8, base64)
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAFElEQVQI12NgYGD4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync('public/icon-192.png', png);
fs.writeFileSync('public/icon-512.png', png);
console.log('Icons created');
"
```

> **Note:** Replace with real 192×192 and 512×512 moon/sleep icon PNGs before production.

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "feat: PWA manifest and placeholder icons"
```

---

### Task 3: Root Layout & Global Dark Theme

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update globals.css**

Replace `app/globals.css` with:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  background-color: #000000;
  color: #ffffff;
  min-height: 100dvh;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

:root {
  color-scheme: dark;
}
```

- [ ] **Step 2: Update app/layout.tsx**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

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
  themeColor: '#000000',
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
    <html lang="de">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-black text-white min-h-dvh">{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Verify black background**

```bash
npm run dev
```

Open http://localhost:3000 — should see black page. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: OLED dark theme and PWA meta tags in root layout"
```

---

### Task 4: lib/youtube.ts — Video ID Extractor (TDD)

**Files:**
- Create: `lib/youtube.ts`
- Create: `__tests__/lib/youtube.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/youtube.test.ts`:

```ts
import { extractVideoId } from '@/lib/youtube'

describe('extractVideoId', () => {
  it('extracts ID from standard watch URL', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts ID from short youtu.be URL', () => {
    expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts ID from URL with extra params', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s')).toBe('dQw4w9WgXcQ')
  })

  it('extracts ID from embed URL', () => {
    expect(extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('returns null for non-YouTube URL', () => {
    expect(extractVideoId('https://example.com')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(extractVideoId('')).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/lib/youtube.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/youtube'"

- [ ] **Step 3: Implement lib/youtube.ts**

Create `lib/youtube.ts`:

```ts
const PATTERNS = [
  /[?&]v=([^&#]+)/,
  /youtu\.be\/([^?&#]+)/,
  /\/embed\/([^?&#]+)/,
]

export function extractVideoId(url: string): string | null {
  for (const pattern of PATTERNS) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/lib/youtube.test.ts
```

Expected: PASS — 6 tests

- [ ] **Step 5: Commit**

```bash
git add lib/youtube.ts __tests__/lib/youtube.test.ts
git commit -m "feat: YouTube URL video ID extractor with tests"
```

---

### Task 5: lib/shortcuts.ts — Deep Link Builder (TDD)

**Files:**
- Create: `lib/shortcuts.ts`
- Create: `__tests__/lib/shortcuts.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/shortcuts.test.ts`:

```ts
import { buildShortcutLink } from '@/lib/shortcuts'

describe('buildShortcutLink', () => {
  it('builds link with correct shortcut name and minutes', () => {
    expect(buildShortcutLink(30)).toBe(
      'shortcuts://run-shortcut?name=SleepTimer&input=30'
    )
  })

  it('handles 15 minutes', () => {
    expect(buildShortcutLink(15)).toBe(
      'shortcuts://run-shortcut?name=SleepTimer&input=15'
    )
  })

  it('handles custom duration', () => {
    expect(buildShortcutLink(45)).toBe(
      'shortcuts://run-shortcut?name=SleepTimer&input=45'
    )
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/lib/shortcuts.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/shortcuts'"

- [ ] **Step 3: Implement lib/shortcuts.ts**

Create `lib/shortcuts.ts`:

```ts
export function buildShortcutLink(minutes: number): string {
  return `shortcuts://run-shortcut?name=SleepTimer&input=${minutes}`
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/lib/shortcuts.test.ts
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add lib/shortcuts.ts __tests__/lib/shortcuts.test.ts
git commit -m "feat: iOS Shortcuts deep link builder with tests"
```

---

### Task 6: lib/audio.ts — Beep Generator

**Files:**
- Create: `lib/audio.ts`

> Web Audio API is not testable in Jest/jsdom. Manual test only.

- [ ] **Step 1: Create lib/audio.ts**

```ts
export function playBeep(): void {
  try {
    const ctx = new AudioContext()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.value = 440
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)
    oscillator.onended = () => ctx.close()
  } catch {
    // AudioContext unavailable (test environment, restricted policy) — silent fail
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/audio.ts
git commit -m "feat: Web Audio API 440Hz beep generator"
```

---

### Task 7: hooks/useLocalStorage.ts (TDD)

**Files:**
- Create: `hooks/useLocalStorage.ts`
- Create: `__tests__/hooks/useLocalStorage.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/hooks/useLocalStorage.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('returns initial value when key is not set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    act(() => result.current[1]('new-value'))
    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe('"new-value"')
  })

  it('reads existing value from localStorage on mount', () => {
    localStorage.setItem('test-key', '"stored"')
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  it('works with boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('bool-key', false))
    act(() => result.current[1](true))
    expect(result.current[0]).toBe(true)
  })

  it('works with number values', () => {
    const { result } = renderHook(() => useLocalStorage('num-key', 30))
    act(() => result.current[1](45))
    expect(result.current[0]).toBe(45)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/hooks/useLocalStorage.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement hooks/useLocalStorage.ts**

Create `hooks/useLocalStorage.ts`:

```ts
import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    setStored(value)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }

  return [stored, setValue]
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/hooks/useLocalStorage.test.ts
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add hooks/useLocalStorage.ts __tests__/hooks/useLocalStorage.test.ts
git commit -m "feat: useLocalStorage hook with tests"
```

---

### Task 8: hooks/useWakeLock.ts (TDD)

**Files:**
- Create: `hooks/useWakeLock.ts`
- Create: `__tests__/hooks/useWakeLock.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/hooks/useWakeLock.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useWakeLock } from '@/hooks/useWakeLock'

const mockRelease = jest.fn().mockResolvedValue(undefined)
const mockRequest = jest.fn().mockResolvedValue({ release: mockRelease })

beforeEach(() => {
  jest.clearAllMocks()
  Object.defineProperty(navigator, 'wakeLock', {
    value: { request: mockRequest },
    configurable: true,
  })
})

describe('useWakeLock', () => {
  it('calls navigator.wakeLock.request on request()', async () => {
    const { result } = renderHook(() => useWakeLock())
    await act(async () => { await result.current.request() })
    expect(mockRequest).toHaveBeenCalledWith('screen')
  })

  it('calls release() on release()', async () => {
    const { result } = renderHook(() => useWakeLock())
    await act(async () => { await result.current.request() })
    await act(async () => { await result.current.release() })
    expect(mockRelease).toHaveBeenCalled()
  })

  it('does not throw when wakeLock is unavailable', async () => {
    Object.defineProperty(navigator, 'wakeLock', {
      value: undefined,
      configurable: true,
    })
    const { result } = renderHook(() => useWakeLock())
    await expect(act(async () => { await result.current.request() })).resolves.not.toThrow()
  })

  it('does not throw when request() rejects', async () => {
    mockRequest.mockRejectedValueOnce(new Error('NotAllowedError'))
    const { result } = renderHook(() => useWakeLock())
    await expect(act(async () => { await result.current.request() })).resolves.not.toThrow()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/hooks/useWakeLock.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement hooks/useWakeLock.ts**

Create `hooks/useWakeLock.ts`:

```ts
import { useRef } from 'react'

export function useWakeLock() {
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  const request = async () => {
    try {
      if (!('wakeLock' in navigator)) return
      sentinelRef.current = await navigator.wakeLock.request('screen')
    } catch {
      // Low battery or policy rejection — timer still works, screen may dim
    }
  }

  const release = async () => {
    try {
      if (sentinelRef.current) {
        await sentinelRef.current.release()
        sentinelRef.current = null
      }
    } catch {
      // Already released
    }
  }

  return { request, release }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/hooks/useWakeLock.test.ts
```

Expected: PASS — 4 tests

- [ ] **Step 5: Commit**

```bash
git add hooks/useWakeLock.ts __tests__/hooks/useWakeLock.test.ts
git commit -m "feat: useWakeLock with silent error handling and tests"
```

---

### Task 9: hooks/useTimer.ts (TDD)

**Files:**
- Create: `hooks/useTimer.ts`
- Create: `__tests__/hooks/useTimer.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/hooks/useTimer.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '@/hooks/useTimer'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

describe('useTimer', () => {
  it('starts in idle state with full time remaining', () => {
    const { result } = renderHook(() => useTimer(1))
    expect(result.current.state).toBe('idle')
    expect(result.current.remaining).toBe(60)
  })

  it('counts down after start()', () => {
    const { result } = renderHook(() => useTimer(1))
    act(() => { result.current.start() })
    act(() => { jest.advanceTimersByTime(10000) })
    expect(result.current.remaining).toBe(50)
    expect(result.current.state).toBe('running')
  })

  it('reaches expired state at 0', () => {
    const { result } = renderHook(() => useTimer(1))
    act(() => { result.current.start() })
    act(() => { jest.advanceTimersByTime(60000) })
    expect(result.current.remaining).toBe(0)
    expect(result.current.state).toBe('expired')
  })

  it('extend() restarts timer for original duration', () => {
    const { result } = renderHook(() => useTimer(1))
    act(() => { result.current.start() })
    act(() => { jest.advanceTimersByTime(50000) })
    expect(result.current.remaining).toBe(10)
    act(() => { result.current.extend() })
    expect(result.current.remaining).toBe(60)
    expect(result.current.state).toBe('running')
  })

  it('reset() returns to idle with full time', () => {
    const { result } = renderHook(() => useTimer(1))
    act(() => { result.current.start() })
    act(() => { jest.advanceTimersByTime(30000) })
    act(() => { result.current.reset() })
    expect(result.current.state).toBe('idle')
    expect(result.current.remaining).toBe(60)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/hooks/useTimer.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement hooks/useTimer.ts**

Create `hooks/useTimer.ts`:

```ts
import { useState, useRef, useCallback, useEffect } from 'react'

export type TimerState = 'idle' | 'running' | 'expired'

export function useTimer(minutes: number) {
  const totalSeconds = minutes * 60
  const [remaining, setRemaining] = useState(totalSeconds)
  const [state, setState] = useState<TimerState>('idle')
  const startEpoch = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tick = useCallback(() => {
    if (startEpoch.current === null) return
    const elapsed = Math.floor((Date.now() - startEpoch.current) / 1000)
    const newRemaining = Math.max(0, totalSeconds - elapsed)
    setRemaining(newRemaining)
    if (newRemaining === 0) {
      setState('expired')
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [totalSeconds])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state === 'running') tick()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [state, tick])

  const start = useCallback(() => {
    startEpoch.current = Date.now()
    setState('running')
    setRemaining(totalSeconds)
    intervalRef.current = setInterval(tick, 1000)
  }, [tick, totalSeconds])

  const extend = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    startEpoch.current = Date.now()
    setState('running')
    setRemaining(totalSeconds)
    intervalRef.current = setInterval(tick, 1000)
  }, [tick, totalSeconds])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    startEpoch.current = null
    setState('idle')
    setRemaining(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return { remaining, state, start, extend, reset }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/hooks/useTimer.test.ts
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add hooks/useTimer.ts __tests__/hooks/useTimer.test.ts
git commit -m "feat: useTimer with Page Visibility sync and tests"
```

---

### Task 10: components/ModeToggle.tsx (TDD)

**Files:**
- Create: `components/ModeToggle.tsx`
- Create: `__tests__/components/ModeToggle.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/components/ModeToggle.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ModeToggle } from '@/components/ModeToggle'

describe('ModeToggle', () => {
  it('renders both mode labels', () => {
    render(<ModeToggle value="youtube" onChange={jest.fn()} />)
    expect(screen.getByText('YouTube')).toBeInTheDocument()
    expect(screen.getByText('Universal')).toBeInTheDocument()
  })

  it('highlights the active mode', () => {
    render(<ModeToggle value="youtube" onChange={jest.fn()} />)
    const youtubeBtn = screen.getByText('YouTube').closest('button')
    expect(youtubeBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange when other mode is tapped', () => {
    const onChange = jest.fn()
    render(<ModeToggle value="youtube" onChange={onChange} />)
    fireEvent.click(screen.getByText('Universal'))
    expect(onChange).toHaveBeenCalledWith('universal')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/components/ModeToggle.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement components/ModeToggle.tsx**

Create `components/ModeToggle.tsx`:

```tsx
'use client'

export type Mode = 'youtube' | 'universal'

interface ModeToggleProps {
  value: Mode
  onChange: (mode: Mode) => void
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-full bg-zinc-900 p-1 w-full">
      {(['youtube', 'universal'] as Mode[]).map((mode) => (
        <button
          key={mode}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={`flex-1 py-3 rounded-full text-base font-medium transition-colors ${
            value === mode ? 'bg-white text-black' : 'text-zinc-400'
          }`}
        >
          {mode === 'youtube' ? 'YouTube' : 'Universal'}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/components/ModeToggle.test.tsx
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add components/ModeToggle.tsx __tests__/components/ModeToggle.test.tsx
git commit -m "feat: ModeToggle component with tests"
```

---

### Task 11: components/TimerPicker.tsx (TDD)

**Files:**
- Create: `components/TimerPicker.tsx`
- Create: `__tests__/components/TimerPicker.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/components/TimerPicker.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TimerPicker } from '@/components/TimerPicker'

describe('TimerPicker', () => {
  it('renders all four presets', () => {
    render(<TimerPicker value={30} onChange={jest.fn()} />)
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('marks active preset', () => {
    render(<TimerPicker value={30} onChange={jest.fn()} />)
    const btn = screen.getByText('30').closest('button')
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange with preset value', () => {
    const onChange = jest.fn()
    render(<TimerPicker value={30} onChange={onChange} />)
    fireEvent.click(screen.getByText('15'))
    expect(onChange).toHaveBeenCalledWith(15)
  })

  it('calls onChange when custom input changes', () => {
    const onChange = jest.fn()
    render(<TimerPicker value={30} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '90' } })
    expect(onChange).toHaveBeenCalledWith(90)
  })

  it('clamps custom input to 1-180 range', () => {
    const onChange = jest.fn()
    render(<TimerPicker value={30} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '200' } })
    expect(onChange).toHaveBeenCalledWith(180)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/components/TimerPicker.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement components/TimerPicker.tsx**

Create `components/TimerPicker.tsx`:

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
            className={`py-4 rounded-2xl text-xl font-semibold transition-colors ${
              value === preset ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-zinc-500 text-sm flex-1">Eigene Zeit (Min)</span>
        <input
          type="number"
          min={1}
          max={180}
          value={value}
          onChange={handleCustomChange}
          className="bg-zinc-900 text-white text-xl text-center w-20 py-3 rounded-2xl border border-zinc-800 focus:outline-none focus:border-zinc-600"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/components/TimerPicker.test.tsx
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add components/TimerPicker.tsx __tests__/components/TimerPicker.test.tsx
git commit -m "feat: TimerPicker with presets and custom input, tests"
```

---

### Task 12: components/AutoLockBanner.tsx (TDD)

**Files:**
- Create: `components/AutoLockBanner.tsx`
- Create: `__tests__/components/AutoLockBanner.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/components/AutoLockBanner.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { AutoLockBanner } from '@/components/AutoLockBanner'

describe('AutoLockBanner', () => {
  it('renders Auto-Lock hint text', () => {
    render(<AutoLockBanner onDismiss={jest.fn()} />)
    expect(screen.getByText(/Auto-Lock/i)).toBeInTheDocument()
  })

  it('calls onDismiss when close button is tapped', () => {
    const onDismiss = jest.fn()
    render(<AutoLockBanner onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onDismiss).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/components/AutoLockBanner.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement components/AutoLockBanner.tsx**

Create `components/AutoLockBanner.tsx`:

```tsx
'use client'

interface AutoLockBannerProps {
  onDismiss: () => void
}

export function AutoLockBanner({ onDismiss }: AutoLockBannerProps) {
  return (
    <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 w-full">
      <span className="text-yellow-400 text-lg">⚠️</span>
      <p className="text-zinc-300 text-sm flex-1">
        Für beste Ergebnisse: iOS <strong>Auto-Lock auf 1–2 Min</strong> stellen
        (Einstellungen → Anzeige & Helligkeit)
      </p>
      <button
        onClick={onDismiss}
        aria-label="Banner schließen"
        className="text-zinc-500 text-xl px-1"
      >
        ×
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/components/AutoLockBanner.test.tsx
```

Expected: PASS — 2 tests

- [ ] **Step 5: Commit**

```bash
git add components/AutoLockBanner.tsx __tests__/components/AutoLockBanner.test.tsx
git commit -m "feat: AutoLockBanner dismissable hint, tests"
```

---

### Task 13: app/page.tsx — Home Screen

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

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
    if (mode === 'youtube') {
      router.push(`/player?minutes=${minutes}`)
    } else {
      router.push(`/shortcuts?minutes=${minutes}`)
    }
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-dvh px-6 py-12 gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl">🌙</h1>
        <h2 className="text-2xl font-semibold text-white">Sleeper</h2>
        <p className="text-zinc-500 text-sm">Sleep Timer</p>
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
        className="w-full max-w-sm py-5 rounded-full bg-white text-black text-xl font-semibold active:scale-95 transition-transform"
      >
        Timer starten
      </button>
    </main>
  )
}
```

- [ ] **Step 2: Verify visually**

```bash
npm run dev
```

Open http://localhost:3000. Verify: moon emoji + title, mode toggle, 4 preset buttons, custom input, start button. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: Home Screen - mode toggle, timer picker, start button"
```

---

### Task 14: components/CountdownDisplay.tsx (TDD)

**Files:**
- Create: `components/CountdownDisplay.tsx`
- Create: `__tests__/components/CountdownDisplay.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/components/CountdownDisplay.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { CountdownDisplay } from '@/components/CountdownDisplay'

describe('CountdownDisplay', () => {
  it('formats seconds into MM:SS', () => {
    render(<CountdownDisplay seconds={1800} />)
    expect(screen.getByText('30:00')).toBeInTheDocument()
  })

  it('formats single-digit seconds with leading zero', () => {
    render(<CountdownDisplay seconds={65} />)
    expect(screen.getByText('01:05')).toBeInTheDocument()
  })

  it('shows 00:00 at zero', () => {
    render(<CountdownDisplay seconds={0} />)
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('formats 90 minutes correctly', () => {
    render(<CountdownDisplay seconds={5400} />)
    expect(screen.getByText('90:00')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/components/CountdownDisplay.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement components/CountdownDisplay.tsx**

Create `components/CountdownDisplay.tsx`:

```tsx
interface CountdownDisplayProps {
  seconds: number
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function CountdownDisplay({ seconds }: CountdownDisplayProps) {
  return (
    <span className="text-white font-mono text-sm tabular-nums">
      {formatTime(seconds)}
    </span>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/components/CountdownDisplay.test.tsx
```

Expected: PASS — 4 tests

- [ ] **Step 5: Commit**

```bash
git add components/CountdownDisplay.tsx __tests__/components/CountdownDisplay.test.tsx
git commit -m "feat: CountdownDisplay MM:SS formatter with tests"
```

---

### Task 15: components/YouTubePlayer.tsx

**Files:**
- Create: `types/youtube.d.ts`
- Create: `components/YouTubePlayer.tsx`

> YouTube IFrame API is a side-effecting external script. Unit tests are not practical here — manual test only.

- [ ] **Step 1: Create types/youtube.d.ts**

```ts
interface YTPlayerEvent {
  target: YTPlayer
}

interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  destroy(): void
}

interface YTPlayerOptions {
  videoId: string
  playerVars?: {
    autoplay?: 0 | 1
    controls?: 0 | 1
    rel?: 0 | 1
    modestbranding?: 0 | 1
    playsinline?: 0 | 1
  }
  events?: {
    onReady?: (event: YTPlayerEvent) => void
  }
}

declare namespace YT {
  class Player {
    constructor(elementId: string, options: YTPlayerOptions)
    playVideo(): void
    pauseVideo(): void
    stopVideo(): void
    destroy(): void
  }
}

interface Window {
  YT: typeof YT
  onYouTubeIframeAPIReady: () => void
}
```

- [ ] **Step 2: Create components/YouTubePlayer.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'

interface YouTubePlayerProps {
  videoId: string
  playerRef: React.MutableRefObject<YTPlayer | null>
  onReady?: () => void
}

export function YouTubePlayer({ videoId, playerRef, onReady }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!videoId || !containerRef.current) return

    const initPlayer = () => {
      if (!containerRef.current) return
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
      const div = document.createElement('div')
      div.id = `yt-player-${videoId}`
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(div)

      playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
        videoId,
        playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: { onReady: () => onReady?.() },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(script)
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [videoId]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} className="w-full aspect-video bg-black" />
}
```

- [ ] **Step 3: Commit**

```bash
git add types/youtube.d.ts components/YouTubePlayer.tsx
git commit -m "feat: YouTubePlayer IFrame API wrapper"
```

---

### Task 16: components/WakeCheckOverlay.tsx (TDD)

**Files:**
- Create: `components/WakeCheckOverlay.tsx`
- Create: `__tests__/components/WakeCheckOverlay.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/components/WakeCheckOverlay.test.tsx`:

```tsx
import { render, screen, act, fireEvent } from '@testing-library/react'
import { WakeCheckOverlay } from '@/components/WakeCheckOverlay'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

jest.mock('@/lib/audio', () => ({ playBeep: jest.fn() }))

describe('WakeCheckOverlay', () => {
  it('shows "Noch wach?" text', () => {
    render(<WakeCheckOverlay onContinue={jest.fn()} onSleep={jest.fn()} />)
    expect(screen.getByText(/Noch wach/i)).toBeInTheDocument()
  })

  it('shows 60 second countdown initially', () => {
    render(<WakeCheckOverlay onContinue={jest.fn()} onSleep={jest.fn()} />)
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('counts down over time', () => {
    render(<WakeCheckOverlay onContinue={jest.fn()} onSleep={jest.fn()} />)
    act(() => { jest.advanceTimersByTime(5000) })
    expect(screen.getByText('55')).toBeInTheDocument()
  })

  it('calls onSleep after 60 seconds', () => {
    const onSleep = jest.fn()
    render(<WakeCheckOverlay onContinue={jest.fn()} onSleep={onSleep} />)
    act(() => { jest.advanceTimersByTime(60000) })
    expect(onSleep).toHaveBeenCalled()
  })

  it('calls onContinue when tapped', () => {
    const onContinue = jest.fn()
    render(<WakeCheckOverlay onContinue={onContinue} onSleep={jest.fn()} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onContinue).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/components/WakeCheckOverlay.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement components/WakeCheckOverlay.tsx**

Create `components/WakeCheckOverlay.tsx`:

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

  return (
    <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center gap-6 animate-pulse z-50">
      <p className="text-white text-3xl font-semibold">Noch wach? 🌙</p>
      <p className="text-zinc-400 text-6xl font-mono font-bold">{countdown}</p>
      <button
        onClick={onContinue}
        className="mt-4 px-10 py-4 rounded-full bg-white text-black text-lg font-semibold"
      >
        Ja, weiterschauen
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/components/WakeCheckOverlay.test.tsx
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add components/WakeCheckOverlay.tsx __tests__/components/WakeCheckOverlay.test.tsx
git commit -m "feat: WakeCheckOverlay 60s countdown with blink and beep, tests"
```

---

### Task 17: app/player/page.tsx — YouTube Player Screen

**Files:**
- Create: `app/player/page.tsx`

- [ ] **Step 1: Create app/player/page.tsx**

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
    <main className="flex flex-col min-h-dvh bg-black relative">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => { releaseWakeLock(); reset(); router.push('/') }}
          className="text-zinc-400 text-sm px-2 py-1"
        >
          ← Zurück
        </button>
        <CountdownDisplay seconds={remaining} />
        <div className="w-16" />
      </div>

      {!videoId && (
        <div className="flex flex-col items-center justify-center flex-1 px-6 gap-4">
          <p className="text-zinc-400 text-sm text-center">YouTube-Link einfügen</p>
          <form onSubmit={handleUrlSubmit} className="flex flex-col gap-3 w-full max-w-sm">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="bg-zinc-900 text-white px-4 py-4 rounded-2xl text-base border border-zinc-800 focus:outline-none focus:border-zinc-600 w-full"
              autoFocus
            />
            {urlError && <p className="text-red-400 text-sm">{urlError}</p>}
            <button
              type="submit"
              className="py-4 rounded-full bg-white text-black font-semibold text-lg"
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

- [ ] **Step 2: Manually test YouTube flow**

```bash
npm run dev
```

1. Home → YouTube mode → 30 Min → "Timer starten"
2. Paste `https://www.youtube.com/watch?v=dQw4w9WgXcQ` → "Video laden"
3. Player appears, video plays, countdown visible in header
4. Test invalid URL → error message shown
5. "← Zurück" → returns to Home

Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/player/page.tsx
git commit -m "feat: YouTube Player Screen with timer, wake check, wake lock"
```

---

### Task 18: app/sleep/page.tsx — Sleep Overlay Screen

**Files:**
- Create: `app/sleep/page.tsx`

- [ ] **Step 1: Create app/sleep/page.tsx**

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function SleepPage() {
  const router = useRouter()

  return (
    <main
      className="bg-black min-h-dvh flex flex-col items-center justify-end pb-12 cursor-pointer"
      onClick={() => router.push('/')}
    >
      <p className="text-zinc-800 text-sm select-none">Tippen zum Fortfahren</p>
    </main>
  )
}
```

- [ ] **Step 2: Verify manually**

```bash
npm run dev
```

Navigate to http://localhost:3000/sleep — pure black page. Tap → returns to Home. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/sleep/page.tsx
git commit -m "feat: Sleep Overlay Screen - OLED black, tap to continue"
```

---

### Task 19: app/shortcuts/page.tsx — Shortcuts Setup & Trigger Screen

**Files:**
- Create: `app/shortcuts/page.tsx`

- [ ] **Step 1: Create app/shortcuts/page.tsx**

```tsx
'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { buildShortcutLink } from '@/lib/shortcuts'

// Replace with real iCloud link after creating the Shortcut on your iPhone
const ICLOUD_SHORTCUT_URL = 'https://www.icloud.com/shortcuts/REPLACE_ME'

const STEPS = [
  'Tippe auf "Shortcut installieren" unten',
  'Öffne die Kurzbefehle-App und tippe auf "Hinzufügen"',
  'Fertig — der Shortcut "SleepTimer" ist bereit',
]

function ShortcutsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const minutes = parseInt(searchParams.get('minutes') ?? '30', 10)
  const [setupDone, setSetupDone] = useLocalStorage<boolean>('sleeper-shortcut-setup', false)

  const handleTrigger = () => {
    window.location.href = buildShortcutLink(minutes)
  }

  if (setupDone) {
    return (
      <main className="flex flex-col items-center justify-center min-h-dvh px-6 gap-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-5xl">⏱️</p>
          <h2 className="text-2xl font-semibold">Sleep Timer</h2>
          <p className="text-zinc-400 text-sm">{minutes} Min · Helligkeit 0% · Do Not Disturb</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={handleTrigger}
            className="py-5 rounded-full bg-white text-black text-xl font-semibold"
          >
            Shortcut starten
          </button>
          <p className="text-zinc-600 text-xs text-center">
            Wechsle danach zu Netflix, YouTube oder einer anderen App
          </p>
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 text-sm">
          ← Zurück
        </button>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-dvh px-6 py-12 gap-8">
      <button onClick={() => router.push('/')} className="text-zinc-400 text-sm self-start">
        ← Zurück
      </button>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Einmalige Einrichtung</h2>
        <p className="text-zinc-400 text-sm">
          Installiere den iOS Shortcut, der Helligkeit auf 0% setzt und Do Not Disturb aktiviert.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-start gap-4">
            <span className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {i + 1}
            </span>
            <p className="text-zinc-300 text-base pt-1">{step}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 mt-auto">
        <a
          href={ICLOUD_SHORTCUT_URL}
          className="block py-5 rounded-full bg-white text-black text-xl font-semibold text-center"
        >
          Shortcut installieren
        </a>
        <button
          onClick={() => setSetupDone(true)}
          className="py-4 text-zinc-500 text-sm"
        >
          Bereits installiert → Weiter
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

- [ ] **Step 2: Create the iOS Shortcut (manual — do this on your iPhone)**

In the iOS Shortcuts app, create a new shortcut named exactly **`SleepTimer`**:

1. Add action: **"Warte"** (Wait) — tap the seconds value → switch to "Variable" → select `Shortcut Input`
2. Add action: **"Helligkeit einstellen"** — set value to `0`
3. Add action: **"Fokus einstellen"** — select "Nicht stören", turn On
4. Tap the share icon → "iCloud-Link kopieren"
5. Replace `REPLACE_ME` in `app/shortcuts/page.tsx` with the copied URL

- [ ] **Step 3: Verify manually**

```bash
npm run dev
```

1. Home → Universal mode → "Timer starten"
2. Setup screen appears with 3 steps
3. "Bereits installiert → Weiter" → trigger screen with minutes
4. On iPhone: "Shortcut starten" → Shortcuts app opens and runs

Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/shortcuts/page.tsx
git commit -m "feat: Shortcuts Setup and trigger screen"
```

---

### Task 20: Full Test Run & Manual Test Checklist

**Files:** None (validation only)

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass. Approximate count:
- `lib/youtube.test.ts`: 6 tests
- `lib/shortcuts.test.ts`: 3 tests
- `hooks/useLocalStorage.test.ts`: 5 tests
- `hooks/useWakeLock.test.ts`: 4 tests
- `hooks/useTimer.test.ts`: 5 tests
- `components/ModeToggle.test.tsx`: 3 tests
- `components/TimerPicker.test.tsx`: 5 tests
- `components/AutoLockBanner.test.tsx`: 2 tests
- `components/CountdownDisplay.test.tsx`: 4 tests
- `components/WakeCheckOverlay.test.tsx`: 5 tests

**Total: ~42 tests, all PASS**

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 3: Deploy to Vercel**

```bash
npx vercel --prod
```

Expected: App deployed, URL returned.

- [ ] **Step 4: Manual iOS test checklist**

On iPhone Safari, open the Vercel URL:

**Installation:**
- [ ] Page loads with black background
- [ ] Via Share sheet → "Zum Home-Bildschirm" adds app icon
- [ ] Installed app opens fullscreen without Safari UI

**YouTube Flow:**
- [ ] Home Screen: title, toggle, presets, banner visible
- [ ] Auto-Lock banner dismisses and does not reappear
- [ ] Timer presets update custom input field
- [ ] Custom input accepts values 1–180
- [ ] "Timer starten" navigates to `/player`
- [ ] Invalid URL shows error message
- [ ] Valid YouTube URL loads player
- [ ] Video plays automatically
- [ ] Countdown visible in header
- [ ] After timer: "Noch wach?" overlay appears with countdown
- [ ] Tapping "Ja, weiterschauen" continues with reset timer
- [ ] 60s no response → navigates to `/sleep`
- [ ] `/sleep` is pure black with barely-visible hint
- [ ] Tapping `/sleep` → returns to Home

**Universal Flow:**
- [ ] Universal mode → Setup screen on first visit
- [ ] "Shortcut installieren" opens iCloud link on iPhone
- [ ] "Bereits installiert" → trigger screen
- [ ] "Shortcut starten" → opens Shortcuts app
- [ ] Shortcut dims screen and enables DND after chosen time

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: all 42 tests passing, production build verified"
```
