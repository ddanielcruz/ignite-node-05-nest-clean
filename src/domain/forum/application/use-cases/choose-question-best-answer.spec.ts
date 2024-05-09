import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { ChooseQuestionBestAnswer } from './choose-question-best-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswer

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new ChooseQuestionBestAnswer(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryAnswersRepository.create(answer)
    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      authorId: question.authorId.value,
      answerId: answer.id.value,
    })

    expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
      bestAnswerId: answer.id,
    })
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId('user_a'),
    })
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryAnswersRepository.create(answer)
    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      authorId: 'user_b',
      answerId: answer.id.value,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionsRepository.questions[0].bestAnswerId).toBeFalsy()
  })
})
