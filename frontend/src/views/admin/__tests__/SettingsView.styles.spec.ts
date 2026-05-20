import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const componentPath = resolve(dirname(fileURLToPath(import.meta.url)), '../SettingsView.vue')
const componentSource = readFileSync(componentPath, 'utf8')

describe('SettingsView tab navigation styles', () => {
  it('uses the app dark surface color for the sticky settings tabs header', () => {
    const shellBlockMatch = componentSource.match(/\.settings-tabs-shell\s*\{[\s\S]*?\n\}/)
    const darkShellBlockMatch = componentSource.match(
      /:global\(\.dark\) \.settings-tabs-shell\s*\{[\s\S]*?\n\}/,
    )

    expect(shellBlockMatch).not.toBeNull()
    expect(shellBlockMatch?.[0]).toContain('dark:bg-dark-950/95')
    expect(darkShellBlockMatch?.[0]).not.toContain('15 23 42')
  })
})
