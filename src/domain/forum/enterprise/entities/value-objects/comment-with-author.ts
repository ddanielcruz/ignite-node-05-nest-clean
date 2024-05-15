import { ValueObject } from '@/core/entities/value-object'

export interface CommentWithAutorProps {
  comment: {
    id: string
    content: string
  }
  author: {
    id: string
    name: string
  }
  createdAt: Date
  updatedAt: Date | null
}

export class CommentWithAutor extends ValueObject<CommentWithAutorProps> {
  get comment(): Readonly<CommentWithAutorProps['comment']> {
    return this.props.comment
  }

  get author(): Readonly<CommentWithAutorProps['author']> {
    return this.props.author
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
