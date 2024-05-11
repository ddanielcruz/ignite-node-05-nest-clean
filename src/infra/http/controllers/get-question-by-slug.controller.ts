import { Controller, Get, NotFoundException, Param } from '@nestjs/common'

import { GetQuestionBySlug } from '@/domain/forum/application/use-cases/get-question-by-slug'

import { QuestionPresenter } from '../presenters/question-presenter'

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
      question: QuestionPresenter.toHTTP(result.value.question),
    }
  }
}
