import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'

import { SendNotification } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionsRepo: QuestionsRepository,
    private readonly sendNotification: SendNotification,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.execute.bind(this), AnswerCreatedEvent.name)
  }

  private async execute(event: AnswerCreatedEvent): Promise<void> {
    const { questionId } = event.answer
    const question = await this.questionsRepo.findById(questionId.toString())

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.abbreviatedTitle}"`,
        content: event.answer.excerpt,
      })
    }
  }
}
