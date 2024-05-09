import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { GetQuestionBySlug } from './get-question-by-slug'

let sut: GetQuestionBySlug
let inMemoryQuestionsRepository: InMemoryQuestionsRepository

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlug(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(newQuestion)
    const result = await sut.execute({ slug: newQuestion.slug.value })
    assert(result.isRight())
    expect(result.value.question.id).toBeTruthy()
    expect(result.value.question.id).toEqual(newQuestion.id)
  })
})
