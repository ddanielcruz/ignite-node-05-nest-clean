import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { EditAnswer } from './edit-answer'

let sut: EditAnswer
let answersRepository: InMemoryAnswersRepository
let attachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('Edit Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    attachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    sut = new EditAnswer(answersRepository, attachmentsRepository)
  })

  it('should be able to edit an answer', async () => {
    const answerToEdit = makeAnswer()
    await answersRepository.create(answerToEdit)
    attachmentsRepository.attachments.push(
      makeAnswerAttachment({
        answerId: answerToEdit.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: answerToEdit.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      authorId: answerToEdit.authorId.value,
      answerId: answerToEdit.id.value,
      content: 'new body',
      attachmentIds: ['1', '3'],
    })

    assert(result.isRight())
    expect(answersRepository.answers[0]).toMatchObject({
      content: 'new body',
    })
    expect(result.value.answer.attachments.getItems()).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ]),
    )
  })

  it('should not be able to edit an answer from another user', async () => {
    const answerToEdit = makeAnswer()
    await answersRepository.create(answerToEdit)

    const result = await sut.execute({
      authorId: 'another_user',
      answerId: answerToEdit.id.value,
      content: 'new body',
      attachmentIds: ['1', '3'],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(answersRepository.answers[0]).not.toMatchObject({
      title: 'new title',
      content: 'new body',
    })
  })
})
