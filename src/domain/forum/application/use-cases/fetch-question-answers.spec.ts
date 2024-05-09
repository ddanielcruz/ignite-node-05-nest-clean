import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { FetchQuestionAnswers } from './fetch-question-answers'

let sut: FetchQuestionAnswers
let inMemoryAnswersRepository: InMemoryAnswersRepository

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswers(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const question = makeQuestion()
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: question.id }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: question.id }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: question.id }),
    )

    const {
      value: { answers },
    } = await sut.execute({
      questionId: question.id.value,
      page: 1,
    })

    expect(answers).toHaveLength(3)
  })

  it('should be able to fetch paginated answers', async () => {
    const question = makeQuestion()
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: question.id }),
      )
    }

    const {
      value: { answers },
    } = await sut.execute({
      questionId: question.id.value,
      page: 2,
    })

    expect(answers).toHaveLength(2)
  })
})
