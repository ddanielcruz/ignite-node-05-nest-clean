import { Slug } from './slug'

describe('Slug', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFromText('How to create a slug?')
    expect(slug.value).toBe('how-to-create-a-slug')
  })
})
