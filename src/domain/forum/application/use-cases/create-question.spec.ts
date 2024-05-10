import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Slug } from '../../enterprise/entities/value-objects/slug'
import { CreateQuestion } from './create-question'
import { DuplicateQuestionError } from './errors/duplicate-question-error'

let sut: CreateQuestion
let inMemoryQuestionsRepository: InMemoryQuestionsRepository

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestion(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: 'any_author_id',
      title: 'any_title',
      content: 'any_content',
      attachmentIds: ['1', '2'],
    })

    assert(result.isRight())
    const question = inMemoryQuestionsRepository.questions[0]
    expect(question).toEqual(result.value.question)
    expect(question.attachments.getItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          questionId: question.id,
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          questionId: question.id,
          attachmentId: new UniqueEntityId('2'),
        }),
      ]),
    )
  })

  it('should return a DuplicateQuestionError if there is another question with the same slug', async () => {
    const title = 'Lorem Ipsum'
    await inMemoryQuestionsRepository.create(
      makeQuestion({ slug: Slug.createFromText(title) }),
    )

    const result = await sut.execute({
      authorId: 'any_author_id',
      title,
      content: 'any_content',
      attachmentIds: [],
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(DuplicateQuestionError)
  })
})
