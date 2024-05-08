import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'

const createAccountBodySchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(6),
  name: z.string().trim().min(2),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>

@Controller('accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBody) {
    const { email, password, name } = body
    const userWithSameEmail = await this.prisma.user.findUnique({
      select: { id: true },
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists')
    }

    const passwordHash = await hash(password, 10)

    await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    })
  }
}
