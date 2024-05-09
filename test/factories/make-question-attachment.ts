import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment({
  id,
  ...override
}: Partial<QuestionAttachmentProps> & { id?: UniqueEntityId } = {}) {
  return new QuestionAttachment(
    {
      attachmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
