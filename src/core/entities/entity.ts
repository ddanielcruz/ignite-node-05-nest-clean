import { Timestamps } from './timestamps'
import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<TProps> {
  protected props: TProps

  public readonly id: UniqueEntityId

  constructor(props: TProps, id?: string | UniqueEntityId) {
    this.props = props
    this.id = id instanceof UniqueEntityId ? id : new UniqueEntityId(id)
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id.equals(this.id)) {
      return true
    }

    return false
  }
}

export abstract class EntityWithTimestamps<TProps> extends Entity<
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
