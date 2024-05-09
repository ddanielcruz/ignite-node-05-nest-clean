import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { z } from 'zod'

import type { TokenPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

@Controller('sessions')
export class AuthenticateController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() { email, password }: AuthenticateBody) {
    const user = await this.prisma.user.findUnique({
      select: { id: true, passwordHash: true },
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const isSamePassword = await compare(password, user.passwordHash)
    if (!isSamePassword) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const payload: TokenPayload = { sub: user.id }
    const accessToken = await this.jwt.signAsync(payload)

    return { accessToken }
  }
}
