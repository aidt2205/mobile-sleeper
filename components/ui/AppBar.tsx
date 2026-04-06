interface AppBarProps {
  title?: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
}

export function AppBar({ title = 'Sleeper', leftAction, rightAction }: AppBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-6 bg-surface/80 backdrop-blur-xl safe-area-pt">
      <div className="flex items-center gap-2">
        {leftAction || (
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bedtime
          </span>
        )}
        <h1 className="font-headline text-xl font-bold tracking-tighter text-primary">
          {title}
        </h1>
      </div>
      {rightAction && (
        <div className="flex items-center gap-4">
          {rightAction}
        </div>
      )}
    </header>
  )
}
