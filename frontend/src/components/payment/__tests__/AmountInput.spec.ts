import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AmountInput from '../AmountInput.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

describe('AmountInput', () => {
  it('uses KRW quick amounts by default', () => {
    const wrapper = mount(AmountInput, {
      props: {
        modelValue: null,
      },
    })

    expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
      '1200',
      '5400',
      '11000',
      '22000',
      '55000',
      '82400',
    ])
    expect(wrapper.text()).toContain('₩')
  })

  it('emits integer custom KRW amounts', async () => {
    const wrapper = mount(AmountInput, {
      props: {
        modelValue: null,
      },
    })

    await wrapper.find('input').setValue('1200')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1200])
  })
})
