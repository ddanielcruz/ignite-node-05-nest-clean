import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { EditQuestion } from './edit-question'

let sut: EditQuestion
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    sut = new EditQuestion(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const questionToEdit = makeQuestion()

    await inMemoryQuestionsRepository.create(questionToEdit)
    inMemoryQuestionAttachmentsRepository.attachments.push(
      makeQuestionAttachment({
        questionId: questionToEdit.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: questionToEdit.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      authorId: questionToEdit.authorId.value,
      questionId: questionToEdit.id.value,
      title: 'new title',
      content: 'new body',
      attachmentIds: ['1', '3'],
    })

    assert(result.isRight())
    expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
      title: 'new title',
      content: 'new body',
    })
    expect(result.value.question.attachments.getItems()).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ]),
    )
  })

  it('should not be able to edit a question from another user', async () => {
    const questionToEdit = makeQuestion()
    await inMemoryQuestionsRepository.create(questionToEdit)
    const result = await sut.execute({
      authorId: 'another_user',
      questionId: questionToEdit.id.value,
      title: 'new title',
      content: 'new body',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionsRepository.questions[0]).not.toMatchObject({
      title: 'new title',
      content: 'new body',
    })
  })
})
