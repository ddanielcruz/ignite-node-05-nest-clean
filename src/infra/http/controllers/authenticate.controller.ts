import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { AuthenticateStudent } from '@/domain/forum/application/use-cases/authenticate-student'
import { Public } from '@/infra/auth/public.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

@Public()
@Controller('/sessions')
export class AuthenticateController {
  constructor(private readonly authenticateStudent: AuthenticateStudent) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() { email, password }: AuthenticateBody) {
    const response = await this.authenticateStudent.execute({ email, password })

    if (response.isLeft()) {
      throw new UnauthorizedException(response.value.message)
    }

    return response.value
  }
}
