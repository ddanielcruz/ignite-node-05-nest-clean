import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { RegisterStudent } from '@/domain/forum/application/use-cases/register-student'
import { Public } from '@/infra/auth/public.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const createAccountBodySchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(6),
  name: z.string().trim().min(2),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>

@Public()
@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly registerStudent: RegisterStudent) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBody) {
    const response = await this.registerStudent.execute(body)
    if (response.isLeft()) {
      throw new ConflictException(response.value.message)
    }
  }
}
