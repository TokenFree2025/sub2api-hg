import { describe, expect, it } from 'vitest'
import { resolveWeChatOAuthStart, resolveWeChatOAuthStartStrict } from '@/api/auth'

describe('resolveWeChatOAuthStart', () => {
  it('returns native_app_required when only mobile app login is enabled outside WeChat', () => {
    const result = resolveWeChatOAuthStart(
      {
        wechat_oauth_enabled: true,
        wechat_oauth_open_enabled: false,
        wechat_oauth_mp_enabled: false,
        wechat_oauth_mobile_enabled: true,
      },
      'Mozilla/5.0'
    )

    expect(result.mode).toBeNull()
    expect(result.unavailableReason).toBe('native_app_required')
    expect(result.mobileEnabled).toBe(true)
  })

  it('keeps mp preferred inside WeChat browser when mp mode is enabled', () => {
    const result = resolveWeChatOAuthStart(
      {
        wechat_oauth_enabled: true,
        wechat_oauth_open_enabled: false,
        wechat_oauth_mp_enabled: true,
        wechat_oauth_mobile_enabled: true,
      },
      'Mozilla/5.0 MicroMessenger'
    )

    expect(result.mode).toBe('mp')
    expect(result.unavailableReason).toBeNull()
  })
})

describe('resolveWeChatOAuthStartStrict', () => {
  it('preserves native_app_required in strict mode once capability flags are explicit', () => {
    const result = resolveWeChatOAuthStartStrict(
      {
        wechat_oauth_open_enabled: false,
        wechat_oauth_mp_enabled: false,
        wechat_oauth_mobile_enabled: true,
      },
      'Mozilla/5.0'
    )

    expect(result.unavailableReason).toBe('native_app_required')
  })
})
