import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { DeleteAnswer } from './delete-answer'

let sut: DeleteAnswer
let inMemoryAnswersRepository: InMemoryAnswersRepository

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswer(inMemoryAnswersRepository)
  })

  it('should be able to delete an answer', async () => {
    const answerToDelete = makeAnswer()
    await inMemoryAnswersRepository.create(answerToDelete)
    const result = await sut.execute({
      authorId: answerToDelete.authorId.value,
      answerId: answerToDelete.id.value,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAnswersRepository.answers).toHaveLength(0)
  })

  it('should not be able to delete an answer from another user', async () => {
    const answerToDelete = makeAnswer()
    await inMemoryAnswersRepository.create(answerToDelete)
    const result = await sut.execute({
      authorId: 'another_user',
      answerId: answerToDelete.id.value,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryAnswersRepository.answers).toHaveLength(1)
  })
})
