import { describe, expect, it } from 'vitest'
import {
  getDefaultLoginAgreementDocuments,
  getLoginAgreementDocumentIcon,
} from '@/utils/loginAgreement'

describe('login agreement utilities', () => {
  it('returns Korean default agreement document titles for Korean locale', () => {
    expect(getDefaultLoginAgreementDocuments('ko-KR')).toEqual([
      {
        id: 'terms',
        title: '서비스 약관',
        content_md: '',
      },
      {
        id: 'usage-policy',
        title: '이용 정책',
        content_md: '',
      },
      {
        id: 'supported-regions',
        title: '지원 국가 및 지역',
        content_md: '',
      },
      {
        id: 'service-specific-terms',
        title: '서비스별 약관',
        content_md: '',
      },
    ])
  })

  it('detects legal document icons for Korean titles', () => {
    expect(getLoginAgreementDocumentIcon('개인정보 처리방침', 0)).toBe('shield')
    expect(getLoginAgreementDocumentIcon('지원 국가 및 지역', 1)).toBe('globe')
    expect(getLoginAgreementDocumentIcon('서비스별 약관', 3)).toBe('cog')
  })
})
