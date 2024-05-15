import { CommentWithAutor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(comment: CommentWithAutor) {
    return {
      id: comment.comment.id.toString(),
      author: comment.author,
      content: comment.comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
