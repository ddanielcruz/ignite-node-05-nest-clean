import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { DeleteQuestion } from './delete-question'

let sut: DeleteQuestion
let inMemoryQuestionsRepository: InMemoryQuestionsRepository

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestion(inMemoryQuestionsRepository)
  })

  it('should be able to delete a question', async () => {
    const questionToDelete = makeQuestion()
    await inMemoryQuestionsRepository.create(questionToDelete)
    const result = await sut.execute({
      authorId: questionToDelete.authorId.value,
      questionId: questionToDelete.id.value,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.questions).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const questionToDelete = makeQuestion()
    await inMemoryQuestionsRepository.create(questionToDelete)
    const result = await sut.execute({
      authorId: 'another_user',
      questionId: questionToDelete.id.value,
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionsRepository.questions).toHaveLength(1)
  })
})
