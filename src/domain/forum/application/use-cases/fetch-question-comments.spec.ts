import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { FetchQuestionComments } from './fetch-question-comments'

let sut: FetchQuestionComments
let studentsRepo: InMemoryStudentsRepository
let commentsRepo: InMemoryQuestionCommentsRepository

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    commentsRepo = new InMemoryQuestionCommentsRepository(studentsRepo)
    sut = new FetchQuestionComments(commentsRepo)
  })

  it('should be able to fetch question comments', async () => {
    const question = makeQuestion()
    const student = makeStudent()
    const comment1 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })

    await studentsRepo.create(student)
    await commentsRepo.create(comment1)
    await commentsRepo.create(comment2)

    const {
      value: { comments },
    } = await sut.execute({
      questionId: question.id.value,
      page: 1,
    })

    expect(comments).toHaveLength(2)
    expect(comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: { id: student.id.toString(), name: student.name },
          comment: {
            id: comment1.id.toString(),
            content: comment1.content,
          },
          createdAt: comment1.createdAt,
          updatedAt: comment1.updatedAt,
        }),
        expect.objectContaining({
          author: { id: student.id.toString(), name: student.name },
          comment: {
            id: comment2.id.toString(),
            content: comment2.content,
          },
          createdAt: comment2.createdAt,
          updatedAt: comment2.updatedAt,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated comments', async () => {
    const question = makeQuestion()
    const student = makeStudent()
    await studentsRepo.create(student)

    for (let i = 1; i <= 22; i++) {
      await commentsRepo.create(
        makeQuestionComment({ questionId: question.id, authorId: student.id }),
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
