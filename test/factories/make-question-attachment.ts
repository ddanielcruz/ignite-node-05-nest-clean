import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

type QuestionAttachmentFactoryProps = Partial<QuestionAttachmentProps> & {
  id?: UniqueEntityId
}

export function makeQuestionAttachment(
  override?: QuestionAttachmentFactoryProps,
) {
  return new QuestionAttachment({
    attachmentId: new UniqueEntityId(),
    questionId: new UniqueEntityId(),
    ...override,
  })
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async make(override?: QuestionAttachmentFactoryProps) {
    const attachment = makeQuestionAttachment(override)
    await this.prisma.attachment.update({
      where: {
        id: attachment.id.toString(),
      },
      data: {
        questionId: attachment.questionId.toString(),
      },
    })

    return attachment
  }
}
