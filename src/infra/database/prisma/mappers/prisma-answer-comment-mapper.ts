import { Comment, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class PrismaAnswerCommentMapper {
  static toDomain(comment: Comment): AnswerComment {
    if (!comment.answerId) {
      throw new Error('AnswerComment must have an answerId.')
    }

    return new AnswerComment(
      {
        answerId: new UniqueEntityId(comment.answerId),
        authorId: new UniqueEntityId(comment.authorId),
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
      comment.id,
    )
  }

  static toPrisma(comment: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      answerId: comment.answerId.toString(),
      questionId: null,
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
