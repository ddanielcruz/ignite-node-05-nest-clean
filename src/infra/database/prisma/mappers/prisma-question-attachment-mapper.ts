import { Attachment } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class PrismaQuestionAttachmentMapper {
  static toDomain(attachment: Attachment): QuestionAttachment {
    if (!attachment.questionId) {
      throw new Error('QuestionAttachment must have an questionId.')
    }

    return new QuestionAttachment({
      attachmentId: new UniqueEntityId(attachment.id),
      questionId: new UniqueEntityId(attachment.questionId),
    })
  }
}
