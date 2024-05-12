import {
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteAnswerComment } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private readonly deleteAnswerComment: DeleteAnswerComment) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const { sub: userId } = user
    const result = await this.deleteAnswerComment.execute({
      authorId: userId,
      answerCommentId,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(result.value.message)
        default:
          throw new ForbiddenException(result.value.message)
      }
    }
  }
}
