import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { FetchAnswerComments } from './fetch-answer-comments'

let sut: FetchAnswerComments
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerComments(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const answer = makeAnswer()
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: answer.id }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: answer.id }),
    )

    const {
      value: { comments },
    } = await sut.execute({
      answerId: answer.id.value,
      page: 1,
    })

    expect(comments).toHaveLength(2)
  })

  it('should be able to fetch paginated comments', async () => {
    const answer = makeAnswer()
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: answer.id }),
      )
    }
    const {
      value: { comments },
    } = await sut.execute({
      answerId: answer.id.value,
      page: 2,
    })

    expect(comments).toHaveLength(2)
  })
})
