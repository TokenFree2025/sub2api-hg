import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NotFoundView from '@/views/NotFoundView.vue'

const backMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    back: backMock,
  }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'errors.pageNotFound': '페이지를 찾을 수 없습니다',
        'errors.pageNotFoundDescription': '요청하신 페이지가 없거나 이동되었습니다.',
        'common.goBack': '뒤로 가기',
        'home.goToDashboard': '대시보드로 이동',
        'common.needHelp': '도움이 필요하신가요?',
        'common.contactSupport': '지원팀에 문의',
      }
      return map[key] ?? key
    },
  }),
}))

describe('NotFoundView', () => {
  it('renders Korean user-facing copy', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        stubs: {
          Icon: true,
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

    expect(wrapper.text()).toContain('페이지를 찾을 수 없습니다')
    expect(wrapper.text()).toContain('요청하신 페이지가 없거나 이동되었습니다.')
    expect(wrapper.text()).toContain('뒤로 가기')
    expect(wrapper.text()).toContain('대시보드로 이동')
    expect(wrapper.text()).toContain('도움이 필요하신가요?')
    expect(wrapper.text()).toContain('지원팀에 문의')
  })
})
