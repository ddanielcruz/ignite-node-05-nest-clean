import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswerQuestion } from './answer-question'

let sut: AnswerQuestion
let inMemoryAnswersRepository: InMemoryAnswersRepository

describe('Answer question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestion(inMemoryAnswersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      authorId: 'any_author_id',
      questionId: 'any_question_id',
      content: 'any_content',
      attachmentIds: ['1', '2'],
    })

    assert(result.isRight())
    const { answer } = result.value
    expect(answer.id).toBeTruthy()
    expect(answer.content).toBe('any_content')
    expect(inMemoryAnswersRepository.answers.at(0)?.id).toEqual(answer.id)
    expect(answer.attachments.getItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          answerId: answer.id,
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          answerId: answer.id,
          attachmentId: new UniqueEntityId('2'),
        }),
      ]),
    )
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      authorId: 'any_author_id',
      questionId: 'any_question_id',
      content: 'any_content',
      attachmentIds: ['1', '2'],
    })

    assert(result.isRight())
    expect(inMemoryAnswersRepository.attachmentsRepo.attachments).toHaveLength(
      2,
    )
    expect(inMemoryAnswersRepository.attachmentsRepo.attachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('2'),
        }),
      ]),
    )
  })
})
