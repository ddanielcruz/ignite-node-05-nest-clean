import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().int().min(1)),
})

type QueryParams = z.infer<typeof queryParamsSchema>

@Controller('questions')
export class FetchRecentQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(queryParamsSchema, { type: 'query' }))
    { page }: QueryParams,
  ) {
    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: 'desc' },
    })

    return { questions }
  }
}
