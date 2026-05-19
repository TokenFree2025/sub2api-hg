import { describe, expect, it } from 'vitest'
import en from '@/i18n/locales/en'
import ko from '@/i18n/locales/ko'

describe('Korean locale coverage', () => {
  function flattenMessages(value: unknown, prefix = '', output: Record<string, string> = {}) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
        flattenMessages(child, prefix ? `${prefix}.${key}` : key, output)
      })
      return output
    }

    if (typeof value === 'string') {
      output[prefix] = value
    }

    return output
  }

  function canRemainEnglish(path: string, value: string) {
    if (/\.providers\.|\.platforms\.|payment\.methods\.|\.apiKey$|\.baseUrl$|\.endpoint$|\.url$|\.uri$|accountId$|jwksUrl$|cdnUrl$/i.test(path)) return true
    if (/^(Claude|Gemini|Antigravity|OpenAI|Anthropic|Redis|PostgreSQL|S3|R2|AWS|GCP|OIDC|OAuth|TOTP|SMTP|TLS|HTTP|HTTPS|API|WebSocket|EasyPay|Alipay|Stripe|Airwallex|WeChat|LinuxDo|Cloudflare|YAML|JSON|RPM|TPM|QPS|TPS|TTFT|SLA|ID|IP|URL|URI|CNY|USD|HKD|RPM \/ TPM|GitHub|JWKS URL|CDN URL)$/.test(value)) return true
    if (/^[\s\d{}#:+/._@$*\-(),<>=≥≤|\\[\]]+$/.test(value)) return true
    if (value.trim() === '') return true
    if (/^[-A-Z0-9_]+$/.test(value)) return true
    if (/^[A-Z0-9_{}() :|/-]+$/.test(value)) return true
    if (/^[A-Za-z0-9_{}() :|/._-]+$/.test(value)) return true
    if (/^(sk-|https?:|example\.com|localhost|\.json|\.yaml|\.svg|gpt-|claude-|AIza|0x|RS256|<svg>|[A-Za-z0-9._%+-]+\{'@'\}[A-Za-z0-9.-]+)/i.test(value)) return true
    if (/User-Agent:|x-app:|anthropic-beta:/i.test(value)) return true

    return false
  }

  it('preserves i18n placeholders after Korean translation', () => {
    const englishMessages = flattenMessages(en)
    const koreanMessages = flattenMessages(ko)

    Object.entries(englishMessages).forEach(([path, englishValue]) => {
      const englishPlaceholders = englishValue.match(/\{[^}]+\}/g) ?? []
      const koreanPlaceholders = koreanMessages[path]?.match(/\{[^}]+\}/g) ?? []

      expect(koreanPlaceholders.sort(), path).toEqual(englishPlaceholders.sort())
      expect(koreanMessages[path], path).not.toContain('ZXQ')
    })
  })

  it('does not leave translatable Korean messages identical to English', () => {
    const englishMessages = flattenMessages(en)
    const koreanMessages = flattenMessages(ko)

    const untranslatedPaths = Object.entries(englishMessages)
      .filter(([path, englishValue]) => koreanMessages[path] === englishValue)
      .filter(([path, englishValue]) => !canRemainEnglish(path, englishValue))
      .map(([path, englishValue]) => `${path}: ${englishValue}`)

    expect(untranslatedPaths).toEqual([])
  })

  it('localizes key user-facing labels in Korean', () => {
    expect(ko.customPage.title).toBe('맞춤 페이지')
    expect(ko.customPage.tocTitle).toBe('목차')
    expect(ko.customPage.copyCode).toBe('복사')
    expect(ko.dashboard.welcomeMessage).toBe('다시 오신 것을 환영합니다. 계정 현황을 한눈에 확인해 보세요.')
    expect(ko.keys.title).toBe('API 키')
    expect(ko.auth.emailOAuth.signIn).toBe('{providerName}로 계속하기')
    expect(ko.auth.oauthFlow.wechatNotConfigured).toBe('WeChat 로그인이 아직 설정되지 않았습니다.')
  })

  it('localizes high-traffic public pages in Korean', () => {
    expect(ko.home.comparison.items.pricing.feature).toBe('요금 방식')
    expect(ko.home.comparison.items.management.us).toBe('통합 키, 하나의 대시보드')
    expect(ko.keyUsage.model).toBe('모델')
    expect(ko.keyUsage.totalCost).toBe('총 비용')
    expect(ko.common.expand).toBe('펼치기')
    expect(ko.pagination.previous).toBe('이전')
    expect(ko.purchase.title).toBe('충전 / 구독')
    expect(ko.purchase.notConfiguredDesc).toBe('관리자가 충전/구독 입구를 활성화했지만 아직 링크를 설정하지 않았습니다. 관리자에게 문의해 주세요.')
    expect(ko.announcements.markAllRead).toBe('모두 읽음으로 표시')
    expect(ko.announcements.emptyDescription).toBe('현재 시스템 공지사항이 없습니다')
    expect(ko.userSubscriptions.title).toBe('내 구독')
    expect(ko.userSubscriptions.noActiveSubscriptionsDesc).toBe('활성 구독이 없습니다. 필요하면 관리자에게 문의해 주세요.')
    expect(ko.userSubscriptions.resetIn).toBe('{time} 후 초기화')
  })

  it('localizes remaining major user account surfaces in Korean', () => {
    expect(ko.payment.title).toBe('충전 / 구독')
    expect(ko.payment.amountLabel).toBe('금액')
    expect(ko.payment.methods.wxpay).toBe('WeChat Pay')
    expect(ko.payment.orders.title).toBe('내 주문')
    expect(ko.payment.orders.empty).toBe('아직 주문이 없습니다')
    expect(ko.payment.result.success).toBe('결제가 완료되었습니다')
    expect(ko.redeem.title).toBe('교환 코드')
    expect(ko.redeem.redeemButton).toBe('교환 코드 사용')
    expect(ko.redeem.recentActivity).toBe('최근 활동')
    expect(ko.profile.title).toBe('프로필 설정')
    expect(ko.profile.accountBalance).toBe('계정 잔액')
    expect(ko.profile.newPassword).toBe('새 비밀번호')
    expect(ko.profile.totp.title).toBe('2단계 인증 (2FA)')
    expect(ko.affiliate.title).toBe('제휴 리베이트')
    expect(ko.affiliate.copyCode).toBe('코드 복사')
    expect(ko.affiliate.transfer.button).toBe('잔액으로 이체')
    expect(ko.availableChannels.title).toBe('사용 가능한 채널')
    expect(ko.availableChannels.searchPlaceholder).toBe('채널 또는 모델 검색...')
  })

  it('localizes shared utility and status surfaces in Korean', () => {
    expect(ko.usage.title).toBe('사용 기록')
    expect(ko.channelStatus.title).toBe('채널 상태')
    expect(ko.subscriptionProgress.title).toBe('내 구독')
    expect(ko.version.currentVersion).toBe('현재 버전')
    expect(ko.keys.useKeyModal.title).toBe('API 키 사용')
    expect(ko.onboarding.restartTour).toBe('온보딩 가이드 다시 시작')
  })

  it('localizes admin dashboard and payment admin labels in Korean', () => {
    expect(ko.admin.dashboard.title).toBe('관리 대시보드')
    expect(ko.admin.dashboard.description).toBe('시스템 개요와 실시간 통계')
    expect(ko.payment.admin.tabs.overview).toBe('개요')
    expect(ko.payment.admin.todayRevenue).toBe('오늘 매출')
    expect(ko.payment.admin.searchOrders).toBe('주문 검색...')
    expect(ko.payment.admin.paymentConfigTitle).toBe('결제 설정')
    expect(ko.admin.backup.title).toBe('데이터베이스 백업')
    expect(ko.admin.backup.s3.title).toBe('S3 저장소 설정')
  })
})
