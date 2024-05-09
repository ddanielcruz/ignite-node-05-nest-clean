import { UniqueEntityId } from '../entities/unique-entity-id'

export interface DomainEvent {
  ocurredAt: Readonly<Date>
  getAggregateId(): UniqueEntityId
}
