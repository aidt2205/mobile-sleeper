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
