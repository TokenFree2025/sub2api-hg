import type { LoginAgreementDocument } from '@/types'

export type LoginAgreementDocumentIcon = 'document' | 'shield' | 'globe' | 'cog'

function normalizeLocale(locale?: string): 'zh' | 'ko' | 'en' {
  if (!locale) return 'en'
  if (locale.startsWith('zh')) return 'zh'
  if (locale.startsWith('ko')) return 'ko'
  return 'en'
}

export function getDefaultLoginAgreementDocuments(locale?: string): LoginAgreementDocument[] {
  const current = normalizeLocale(locale)

  if (current === 'zh') {
    return [
      { id: 'terms', title: '服务条款', content_md: '' },
      { id: 'usage-policy', title: '使用政策', content_md: '' },
      { id: 'supported-regions', title: '支持的国家和地区', content_md: '' },
      { id: 'service-specific-terms', title: '服务特定条款', content_md: '' },
    ]
  }

  if (current === 'ko') {
    return [
      { id: 'terms', title: '서비스 약관', content_md: '' },
      { id: 'usage-policy', title: '이용 정책', content_md: '' },
      { id: 'supported-regions', title: '지원 국가 및 지역', content_md: '' },
      { id: 'service-specific-terms', title: '서비스별 약관', content_md: '' },
    ]
  }

  return [
    { id: 'terms', title: 'Terms of Service', content_md: '' },
    { id: 'usage-policy', title: 'Usage Policy', content_md: '' },
    { id: 'supported-regions', title: 'Supported Countries and Regions', content_md: '' },
    { id: 'service-specific-terms', title: 'Service-Specific Terms', content_md: '' },
  ]
}

export function getLoginAgreementDocumentIcon(
  title: string,
  index: number,
): LoginAgreementDocumentIcon {
  const lowered = title.toLowerCase()

  if (
    lowered.includes('privacy') ||
    lowered.includes('policy') ||
    title.includes('政策') ||
    title.includes('隐私') ||
    title.includes('정책') ||
    title.includes('개인정보')
  ) {
    return 'shield'
  }

  if (
    lowered.includes('country') ||
    lowered.includes('region') ||
    title.includes('国家') ||
    title.includes('地区') ||
    title.includes('국가') ||
    title.includes('지역')
  ) {
    return 'globe'
  }

  if (
    lowered.includes('specific') ||
    title.includes('特定') ||
    title.includes('서비스별') ||
    index === 3
  ) {
    return 'cog'
  }

  return 'document'
}
