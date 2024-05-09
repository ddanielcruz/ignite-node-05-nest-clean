import { EntityWithTimestamps } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CommentProps {
  authorId: UniqueEntityId
  content: string
}

export abstract class Comment<
  TProps extends CommentProps,
> extends EntityWithTimestamps<TProps> {
  get authorId(): UniqueEntityId {
    return this.props.authorId
  }

  get content(): string {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.onUpdate()
  }
}
