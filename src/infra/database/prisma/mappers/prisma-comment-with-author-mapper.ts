import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'

import { CommentWithAutor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export type PrismaCommentWithAuthor = PrismaComment & {
  author: Pick<PrismaUser, 'id' | 'name'>
}

export class PrismaCommentWithAuthorMapper {
  static toDomain(comment: PrismaCommentWithAuthor) {
    return new CommentWithAutor({
      author: {
        id: comment.author.id,
        name: comment.author.name,
      },
      comment: {
        id: comment.id,
        content: comment.content,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    })
  }
}
