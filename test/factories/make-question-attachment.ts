import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

type QuestionAttachmentFactoryProps = Partial<QuestionAttachmentProps> & {
  id?: UniqueEntityId
}

export function makeQuestionAttachment(
  override?: QuestionAttachmentFactoryProps,
) {
  return new QuestionAttachment(
    {
      attachmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    override?.id,
  )
}
