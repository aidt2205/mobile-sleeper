export function buildShortcutLink(minutes: number): string {
  return `shortcuts://run-shortcut?name=SleepTimer&input=${minutes}`
}
