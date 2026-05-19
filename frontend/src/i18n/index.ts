import { createI18n } from 'vue-i18n'

type LocaleCode = 'en' | 'zh' | 'ko'

type LocaleMessages = Record<string, any>

const LOCALE_KEY = 'sub2api_locale'
const DEFAULT_LOCALE: LocaleCode = 'ko'
const USER_FACING_LOCALES: LocaleCode[] = ['ko', 'en']
const ADMIN_LOCALES: LocaleCode[] = ['ko', 'en', 'zh']

const localeLoaders: Record<LocaleCode, () => Promise<{ default: LocaleMessages }>> = {
  en: () => import('./locales/en'),
  zh: () => import('./locales/zh'),
  ko: () => import('./locales/ko')
}

function isLocaleCode(value: string): value is LocaleCode {
  return value === 'en' || value === 'zh' || value === 'ko'
}

function getDefaultLocale(): LocaleCode {
  const saved = localStorage.getItem(LOCALE_KEY)
  if (saved && isLocaleCode(saved)) {
    const routeLocales = getAllowedLocaleCodesForPath(window.location.pathname)
    if (routeLocales.includes(saved)) {
      return saved
    }

    localStorage.setItem(LOCALE_KEY, DEFAULT_LOCALE)
  }


  return DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {},
  // 禁用 HTML 消息警告 - 引导步骤使用富文本内容（driver.js 支持 HTML）
  // 这些内容是内部定义的，不存在 XSS 风险
  warnHtmlMessage: false
})

const loadedLocales = new Set<LocaleCode>()

export async function loadLocaleMessages(locale: LocaleCode): Promise<void> {
  if (loadedLocales.has(locale)) {
    return
  }

  const loader = localeLoaders[locale]
  const module = await loader()
  i18n.global.setLocaleMessage(locale, module.default)
  loadedLocales.add(locale)
}

export async function initI18n(): Promise<void> {
  const current = getLocale()
  await loadLocaleMessages(current)
  document.documentElement.setAttribute('lang', current)
}

export async function setLocale(locale: string): Promise<void> {
  if (!isLocaleCode(locale)) {
    return
  }

  await loadLocaleMessages(locale)
  i18n.global.locale.value = locale
  localStorage.setItem(LOCALE_KEY, locale)
  document.documentElement.setAttribute('lang', locale)

  // 同步更新浏览器页签标题，使其跟随语言切换
  const { resolveDocumentTitle } = await import('@/router/title')
  const { default: router } = await import('@/router')
  const { useAppStore } = await import('@/stores/app')
  const route = router.currentRoute.value
  const appStore = useAppStore()
  document.title = resolveDocumentTitle(route.meta.title, appStore.siteName, route.meta.titleKey as string)
}

export function getLocale(): LocaleCode {
  const current = i18n.global.locale.value
  return isLocaleCode(current) ? current : DEFAULT_LOCALE
}

export const availableLocales = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
] as const

function getAllowedLocaleCodesForPath(path: string): LocaleCode[] {
  return path.startsWith('/admin') ? ADMIN_LOCALES : USER_FACING_LOCALES
}

export function getAvailableLocalesForRoute(path: string) {
  const allowedCodes = getAllowedLocaleCodesForPath(path)
  return availableLocales.filter((locale) => allowedCodes.includes(locale.code))
}

export async function ensureLocaleAllowedForRoute(path: string): Promise<void> {
  const allowedCodes = getAllowedLocaleCodesForPath(path)
  const current = getLocale()
  if (allowedCodes.includes(current)) {
    return
  }

  await setLocale(DEFAULT_LOCALE)
}

export default i18n
