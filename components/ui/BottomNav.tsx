'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', icon: 'timer', label: 'Timer' },
  { href: '/shortcuts', icon: 'bolt', label: 'Shortcuts' },
] as const

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/player'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 safe-area-pb">
      <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-surface-container/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)]">
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${active
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant/40 hover:text-on-surface-variant/70'
                }
              `}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              {active && (
                <span className="text-xs font-label font-semibold tracking-wide">
                  {tab.label}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
