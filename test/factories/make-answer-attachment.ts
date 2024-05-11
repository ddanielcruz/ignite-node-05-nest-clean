import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

type AnswerAttachmentFactoryProps = Partial<AnswerAttachmentProps> & {
  id?: UniqueEntityId
}

export function makeAnswerAttachment(override?: AnswerAttachmentFactoryProps) {
  return new AnswerAttachment(
    {
      attachmentId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...override,
    },
    override?.id,
  )
}
