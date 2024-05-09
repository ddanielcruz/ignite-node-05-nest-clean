import { EntityWithTimestamps } from '@/core/entities/entity'
import { Timestamps } from '@/core/entities/timestamps'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface NotificationProps {
  recipientId: UniqueEntityId
  title: string
  content: string
  readAt: Date | null
}

export class Notification extends EntityWithTimestamps<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt
  }

  read() {
    if (!this.props.readAt) {
      this.props.readAt = new Date()
    }
  }

  constructor(
    props: Optional<NotificationProps, 'readAt'> & Partial<Timestamps>,
    id?: UniqueEntityId,
  ) {
    super({ readAt: null, ...props }, id)
  }
}
