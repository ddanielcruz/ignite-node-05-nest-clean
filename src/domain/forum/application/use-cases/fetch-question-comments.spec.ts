import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { FetchQuestionComments } from './fetch-question-comments'

let sut: FetchQuestionComments
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionComments(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const question = makeQuestion()
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: question.id }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: question.id }),
    )

    const {
      value: { comments },
    } = await sut.execute({
      questionId: question.id.value,
      page: 1,
    })

    expect(comments).toHaveLength(2)
  })

  it('should be able to fetch paginated comments', async () => {
    const question = makeQuestion()
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: question.id }),
      )
    }
    const {
      value: { comments },
    } = await sut.execute({
      questionId: question.id.value,
      page: 2,
    })

    expect(comments).toHaveLength(2)
  })
})
