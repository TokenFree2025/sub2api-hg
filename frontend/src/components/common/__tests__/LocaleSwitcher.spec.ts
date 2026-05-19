import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import LocaleSwitcher from '../LocaleSwitcher.vue'

const routeState = vi.hoisted(() => ({
  path: '/profile'
}))

const authState = vi.hoisted(() => ({
  isAdmin: false
}))

vi.mock('vue-router', () => ({
  useRoute: () => routeState
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authState
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      locale: ref('ko')
    })
  }
})

vi.mock('@/components/icons/Icon.vue', () => ({
  default: {
    template: '<span class="icon-stub" />'
  }
}))

describe('LocaleSwitcher', () => {
  it('keeps Chinese available for admin users on account routes', async () => {
    routeState.path = '/profile'
    authState.isAdmin = true

    const wrapper = mount(LocaleSwitcher)

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('中文')
  })

  it('hides Chinese for non-admin users on account routes', async () => {
    routeState.path = '/profile'
    authState.isAdmin = false

    const wrapper = mount(LocaleSwitcher)

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).not.toContain('中文')
  })
})
