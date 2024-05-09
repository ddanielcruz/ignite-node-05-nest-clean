import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

const createQuestionBodySchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateQuestionBody,
  ) {
    const { sub: userId } = user
    const { title, content } = body
    const slug = this.convertToSlug(title)

    const questionWithSameSlug = await this.prisma.question.findUnique({
      select: { id: true },
      where: { slug },
    })

    if (questionWithSameSlug) {
      throw new ConflictException(
        'Question with the same title already exists.',
      )
    }

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
  }

  private convertToSlug(title: string) {
    return title
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
}
