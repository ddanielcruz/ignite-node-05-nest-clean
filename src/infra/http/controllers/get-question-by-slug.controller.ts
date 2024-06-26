import { Controller, Get, NotFoundException, Param } from '@nestjs/common'

import { GetQuestionBySlug } from '@/domain/forum/application/use-cases/get-question-by-slug'

import { QuestionDetailsPresenter } from '../presenters/question-details-presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private readonly getQuestionBySlug: GetQuestionBySlug) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug })
    if (result.isLeft()) {
      throw new NotFoundException(result.value)
    }

    return {
      question: QuestionDetailsPresenter.toHTTP(result.value.question),
    }
  }
}
