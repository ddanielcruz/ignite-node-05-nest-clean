import { Entity } from '@/core/entities/entity'

export interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  get name() {
    return this.props.name
  }
}
