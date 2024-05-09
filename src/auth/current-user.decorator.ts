import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { TokenPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): TokenPayload => {
    const request = context.switchToHttp().getRequest()
    return request.user
  },
)

export type UserPayload = TokenPayload
