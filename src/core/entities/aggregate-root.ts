import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'
import { Timestamps } from './timestamps'
import { UniqueEntityId } from './unique-entity-id'

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): Readonly<DomainEvent[]> {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markAggregateForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents = []
  }
}

export abstract class AggregateRootWithTimestamps<TProps> extends AggregateRoot<
  TProps & Timestamps
> {
  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  constructor(
    props: TProps & Partial<Timestamps>,
    id?: string | UniqueEntityId,
  ) {
    super(
      {
        createdAt: new Date(),
        updatedAt: null,
        ...props,
      },
      id,
    )
  }

  protected onUpdate() {
    this.props.updatedAt = new Date()
  }
}
