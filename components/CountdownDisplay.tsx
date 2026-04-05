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
