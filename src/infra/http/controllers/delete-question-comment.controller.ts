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
import { DeleteQuestionComment } from '@/domain/forum/application/use-cases/delete-question-comment'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(private readonly deleteQuestionComment: DeleteQuestionComment) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionCommentId: string,
  ) {
    const { sub: userId } = user
    const result = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId,
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
