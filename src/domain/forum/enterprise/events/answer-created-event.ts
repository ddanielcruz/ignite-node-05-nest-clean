import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Answer } from '../entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  private readonly _answer: Answer

  ocurredAt: Readonly<Date> = new Date()

  get answer(): Readonly<Answer> {
    return this._answer
  }

  constructor(answer: Answer) {
    this._answer = answer
  }

  getAggregateId(): UniqueEntityId {
    return this._answer.id
  }
}
