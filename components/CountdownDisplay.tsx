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
