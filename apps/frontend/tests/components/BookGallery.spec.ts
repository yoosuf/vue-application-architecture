import { mount } from '@vue/test-utils'
import { BookGallery } from '@/modules/catalog'

const srcs = [
  'https://picsum.photos/seed/a/400/600',
  'https://picsum.photos/seed/b/400/600',
  'https://picsum.photos/seed/c/400/600',
]

function mountGallery() {
  return mount(BookGallery, {
    props: { srcs, alt: 'Test Book' },
  })
}

describe('BookGallery', () => {
  it('renders the main image and one thumbnail per photo', () => {
    const wrapper = mountGallery()

    expect(wrapper.get('img').attributes('src')).toBe(srcs[0])
    expect(wrapper.get('img').attributes('alt')).toBe(
      'Test Book — photo 1 of 3',
    )
    expect(wrapper.findAll('[role="group"] img')).toHaveLength(srcs.length)
  })

  it('switches the main image when a thumbnail is selected', async () => {
    const wrapper = mountGallery()

    const thumbnails = wrapper.findAll('[role="group"] button')
    await thumbnails[1].trigger('click')

    expect(wrapper.get('img').attributes('src')).toBe(srcs[1])
    expect(wrapper.get('img').attributes('alt')).toBe(
      'Test Book — photo 2 of 3',
    )
  })

  it('marks the selected thumbnail as pressed', async () => {
    const wrapper = mountGallery()

    const thumbnails = wrapper.findAll('[role="group"] button')
    expect(thumbnails[0].attributes('aria-pressed')).toBe('true')
    expect(thumbnails[1].attributes('aria-pressed')).toBe('false')

    await thumbnails[1].trigger('click')
    expect(thumbnails[0].attributes('aria-pressed')).toBe('false')
    expect(thumbnails[1].attributes('aria-pressed')).toBe('true')
  })

  it('moves the selection with the arrow keys', async () => {
    const wrapper = mountGallery()

    await wrapper
      .get('[role="group"]')
      .trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.get('img').attributes('src')).toBe(srcs[1])

    await wrapper.get('[role="group"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.get('img').attributes('src')).toBe(srcs[0])
  })
})
