import { Attachment } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class PrismaAnswerAttachmentMapper {
  static toDomain(attachment: Attachment): AnswerAttachment {
    if (!attachment.answerId) {
      throw new Error('AnswerAttachment must have an answerId.')
    }

    return new AnswerAttachment(
      {
        attachmentId: new UniqueEntityId(attachment.id),
        answerId: new UniqueEntityId(attachment.answerId),
      },
      attachment.id,
    )
  }
}
