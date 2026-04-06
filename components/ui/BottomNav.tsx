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
    <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[32px] bg-surface/60 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.4)] safe-area-pb">
      <div className="flex justify-around items-center w-full px-4 pb-8 pt-4">
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex flex-col items-center justify-center px-5 py-1.5
                transition-all duration-500
                ${active
                  ? 'bg-surface-container text-secondary rounded-full'
                  : 'text-on-surface-variant'
                }
              `}
            >
              <span className="material-symbols-outlined mb-1">{tab.icon}</span>
              <span className="text-[11px] font-medium tracking-wide font-label">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
