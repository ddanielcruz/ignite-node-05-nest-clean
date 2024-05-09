import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { DomainEvents } from '@/core/events/domain-events'
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'

import { SendNotification } from '../use-cases/send-notification'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotification

describe('OnAnswerCreated', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotification(inMemoryNotificationsRepository)

    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotification)
  })

  it('should send a notification when an answer is created', async () => {
    const sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await inMemoryAnswersRepository.create(answer)

    expect(inMemoryNotificationsRepository.notifications).toHaveLength(1)
    expect(sendNotificationExecuteSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientId: question.authorId.toString(),
        title: expect.stringContaining(question.abbreviatedTitle),
        content: answer.excerpt,
      }),
    )
  })
})
