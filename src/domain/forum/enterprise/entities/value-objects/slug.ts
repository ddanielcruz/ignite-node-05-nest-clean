export class Slug {
  public readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Slug {
    return new Slug(value)
  }

  /**
   * Receives a string and normalizes it to a slug.
   *
   * Example: "How to create a slug?" -> "how-to-create-a-slug"
   *
   * @param text - The text to be normalized.
   * @returns A slug.
   */
  static createFromText(text: string): Slug {
    const slugValue = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    return new Slug(slugValue)
  }
}
