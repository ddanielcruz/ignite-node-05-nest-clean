import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { FetchAnswerComments } from './fetch-answer-comments'

let sut: FetchAnswerComments
let studentsRepo: InMemoryStudentsRepository
let commentsRepo: InMemoryAnswerCommentsRepository

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    commentsRepo = new InMemoryAnswerCommentsRepository(studentsRepo)
    sut = new FetchAnswerComments(commentsRepo)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent()
    await studentsRepo.create(student)

    const answer = makeAnswer({ authorId: student.id })
    await commentsRepo.create(
      makeAnswerComment({ authorId: student.id, answerId: answer.id }),
    )
    await commentsRepo.create(
      makeAnswerComment({ authorId: student.id, answerId: answer.id }),
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
    const student = makeStudent()
    await studentsRepo.create(student)
    const answer = makeAnswer({ authorId: student.id })
    for (let i = 1; i <= 22; i++) {
      await commentsRepo.create(
        makeAnswerComment({ authorId: student.id, answerId: answer.id }),
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
