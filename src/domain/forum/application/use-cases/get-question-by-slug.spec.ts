import { makeQuestion } from 'test/factories/make-question'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { GetQuestionBySlug } from './get-question-by-slug'

let sut: GetQuestionBySlug
let studentsRepo: InMemoryStudentsRepository
let attachmentsRepo: InMemoryAttachmentsRepository
let questionAttachmentsRepo: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository

describe('Get Question By Slug', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    attachmentsRepo = new InMemoryAttachmentsRepository()
    questionAttachmentsRepo = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository({
      attachmentsRepo,
      questionAttachmentsRepo,
      studentsRepo,
    })
    sut = new GetQuestionBySlug(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const student = makeStudent()
    await studentsRepo.create(student)

    const question = makeQuestion({ authorId: student.id })
    await questionsRepository.create(question)

    const result = await sut.execute({ slug: question.slug.value })
    assert(result.isRight())
    expect(result.value.question.question.id).toBeTruthy()
    expect(result.value.question.question.id).toEqual(question.id)
  })
})
