import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { DeleteAnswerComment } from './delete-answer-comment'

let sut: DeleteAnswerComment
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerComment(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.value,
      answerCommentId: answerComment.id.value,
    })

    expect(inMemoryAnswerCommentsRepository.comments).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment()
    await inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'another_user_id',
      answerCommentId: answerComment.id.value,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    // expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)
  })
})
