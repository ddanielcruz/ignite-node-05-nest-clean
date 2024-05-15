import {
  Attachment as PrismaAttachment,
  Question as PrismaQuestion,
  User as PrismaStudent,
} from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaStudent
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(question: PrismaQuestionDetails): QuestionDetails {
    return new QuestionDetails({
      question: {
        id: new UniqueEntityId(question.id),
        title: question.title,
        content: question.content,
        slug: Slug.create(question.slug),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
      author: {
        id: new UniqueEntityId(question.author.id),
        name: question.author.name,
      },
      attachments: question.attachments.map((attachment) => {
        return new Attachment(
          {
            title: attachment.title,
            url: attachment.url,
          },
          attachment.id,
        )
      }),
      bestAnswerId: question.bestAnswerId
        ? new UniqueEntityId(question.bestAnswerId)
        : null,
    })
  }
}
