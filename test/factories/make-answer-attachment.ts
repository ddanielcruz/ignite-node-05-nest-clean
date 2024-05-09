import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment({
  id,
  ...override
}: Partial<AnswerAttachmentProps> & { id?: UniqueEntityId } = {}) {
  return new AnswerAttachment(
    {
      attachmentId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
