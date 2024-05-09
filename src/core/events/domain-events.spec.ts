import { DomainEvents } from '@/core/events/domain-events'

import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from '../events/domain-event'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date

  constructor(private aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  constructor() {
    super(null)
    this.addDomainEvent(new CustomAggregateCreated(this))
  }
}

describe('DomainEvents', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn()
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    const aggregate = new CustomAggregate()
    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
