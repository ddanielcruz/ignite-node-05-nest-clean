import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestQuestionChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'

import { SendNotification } from '../use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private readonly answersRepo: AnswersRepository,
    private readonly sendNotification: SendNotification,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.execute.bind(this),
      QuestionBestQuestionChosenEvent.name,
    )
  }

  private async execute({
    question,
    bestAnswerId,
  }: QuestionBestQuestionChosenEvent): Promise<void> {
    const answer = await this.answersRepo.findById(bestAnswerId.toString())
    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida como a melhor resposta!',
        content: `A resposta que você deu para a pergunta "${question.abbreviatedTitle}" foi escolhida pelo autor!`,
      })
    }
  }
}
