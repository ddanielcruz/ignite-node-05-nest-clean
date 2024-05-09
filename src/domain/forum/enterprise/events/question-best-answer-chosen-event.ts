import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Question } from '../entities/question'

export class QuestionBestQuestionChosenEvent implements DomainEvent {
  ocurredAt: Readonly<Date> = new Date()

  constructor(
    public readonly question: Question,
    public readonly bestAnswerId: UniqueEntityId,
  ) {}

  getAggregateId(): UniqueEntityId {
    return this.question.id
  }
}
