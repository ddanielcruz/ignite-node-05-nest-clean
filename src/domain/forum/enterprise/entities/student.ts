import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface StudentProps {
  name: string
  email: string
  passwordHash: string
  createdAt: Date
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get createdAt() {
    return this.props.createdAt
  }

  constructor(
    props: Optional<StudentProps, 'createdAt'>,
    id?: string | UniqueEntityId,
  ) {
    super({ createdAt: new Date(), ...props }, id)
  }
}
