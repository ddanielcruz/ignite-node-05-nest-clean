import {
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ReadNotification } from '@/domain/notification/application/use-cases/read-notification'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readonly readNotification: ReadNotification) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const recipientId = user.sub
    const result = await this.readNotification.execute({
      recipientId,
      notificationId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new ForbiddenException(error.message)
      }
    }
  }
}
