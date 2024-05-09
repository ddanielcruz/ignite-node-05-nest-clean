import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AnswerAttachmentProps {
  answerId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId(): UniqueEntityId {
    return this.props.answerId
  }

  get attachmentId(): UniqueEntityId {
    return this.props.attachmentId
  }
}
