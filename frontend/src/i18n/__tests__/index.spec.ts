import { beforeEach, describe, expect, it, vi } from 'vitest'

const LOCALE_KEY = 'sub2api_locale'

function setNavigatorLanguage(language: string) {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value: language
  })
}

async function loadI18nModule() {
  vi.resetModules()
  return import('../index')
}

describe('i18n configuration', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
    setNavigatorLanguage('en-US')
  })

  it('defaults to Korean for first-time visitors', async () => {
    const { getLocale, initI18n } = await loadI18nModule()

    expect(getLocale()).toBe('ko')

    await initI18n()

    expect(document.documentElement.lang).toBe('ko')
  })

  it('keeps the saved locale preference when one exists', async () => {
    localStorage.setItem(LOCALE_KEY, 'en')

    const { getLocale, initI18n } = await loadI18nModule()

    expect(getLocale()).toBe('en')

    await initI18n()

    expect(document.documentElement.lang).toBe('en')
  })

  it('does not auto-select Chinese from browser language', async () => {
    setNavigatorLanguage('zh-CN')

    const { getLocale, initI18n } = await loadI18nModule()

    expect(getLocale()).toBe('ko')

    await initI18n()

    expect(document.documentElement.lang).toBe('ko')
  })

  it('falls back to Korean when a saved user-facing locale is not allowed', async () => {
    localStorage.setItem(LOCALE_KEY, 'zh')

    const { getLocale, initI18n } = await loadI18nModule()

    expect(getLocale()).toBe('ko')

    await initI18n()

    expect(document.documentElement.lang).toBe('ko')
    expect(localStorage.getItem(LOCALE_KEY)).toBe('ko')
  })

  it('keeps a saved Chinese locale on admin routes', async () => {
    window.history.pushState({}, '', '/admin/settings')
    localStorage.setItem(LOCALE_KEY, 'zh')

    const { getLocale, initI18n } = await loadI18nModule()

    expect(getLocale()).toBe('zh')

    await initI18n()

    expect(document.documentElement.lang).toBe('zh')
  })

  it('includes Korean in the locale switcher options', async () => {
    const { availableLocales } = await loadI18nModule()

    expect(availableLocales).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'ko',
          name: '한국어',
          flag: '🇰🇷'
        })
      ])
    )
  })

  it('filters user-facing locale switcher options to Korean and English', async () => {
    const { getAvailableLocalesForRoute } = await loadI18nModule()

    expect(getAvailableLocalesForRoute('/dashboard').map((locale) => locale.code)).toEqual(['ko', 'en'])
  })

  it('keeps Korean, English, and Chinese available for admin routes', async () => {
    const { getAvailableLocalesForRoute } = await loadI18nModule()

    expect(getAvailableLocalesForRoute('/admin/settings').map((locale) => locale.code)).toEqual(['ko', 'en', 'zh'])
  })
})
