import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentProps {
  questionId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId(): UniqueEntityId {
    return this.props.questionId
  }

  get attachmentId(): UniqueEntityId {
    return this.props.attachmentId
  }
}
