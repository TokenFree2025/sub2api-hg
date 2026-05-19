import { afterEach, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/i18n'
import { resolveDocumentTitle } from '@/router/title'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('resolveDocumentTitle', () => {
  it('路由存在标题时，使用“路由标题 - 站点名”格式', () => {
    expect(resolveDocumentTitle('Usage Records', 'My Site')).toBe('Usage Records - My Site')
  })

  it('路由无标题时，回退到站点名', () => {
    expect(resolveDocumentTitle(undefined, 'My Site')).toBe('My Site')
  })

  it('站点名为空时，回退默认站点名', () => {
    expect(resolveDocumentTitle('Dashboard', '')).toBe('Dashboard - tokendeal')
    expect(resolveDocumentTitle(undefined, '   ')).toBe('tokendeal')
  })

  it('站点名变更时仅影响后续路由标题计算', () => {
    const before = resolveDocumentTitle('Admin Dashboard', 'Alpha')
    const after = resolveDocumentTitle('Admin Dashboard', 'Beta')

    expect(before).toBe('Admin Dashboard - Alpha')
    expect(after).toBe('Admin Dashboard - Beta')
  })

  it('存在 titleKey 且韩语词条可用时，优先使用韩语标题', () => {
    vi.spyOn(i18n.global, 't').mockImplementation(((key: string) => {
      if (key === 'auth.signIn') return '로그인'
      if (key === 'setup.title') return 'tokendeal 설정'
      return key
    }) as typeof i18n.global.t)

    expect(resolveDocumentTitle('Dashboard', '내 사이트', 'auth.signIn')).toBe('로그인 - 내 사이트')
    expect(resolveDocumentTitle('Setup', '내 사이트', 'setup.title')).toBe('tokendeal 설정 - 내 사이트')
  })
})
