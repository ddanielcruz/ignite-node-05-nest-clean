import { Comment, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class PrismaQuestionCommentMapper {
  static toDomain(comment: Comment): QuestionComment {
    if (!comment.questionId) {
      throw new Error('QuestionComment must have an questionId.')
    }

    return new QuestionComment(
      {
        questionId: new UniqueEntityId(comment.questionId),
        authorId: new UniqueEntityId(comment.authorId),
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
      comment.id,
    )
  }

  static toPrisma(
    comment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      answerId: null,
      questionId: comment.questionId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
