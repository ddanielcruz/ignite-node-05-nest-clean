import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Attachment } from '../attachment'
import { Slug } from './slug'

export interface QuestionDetailsProps {
  question: {
    id: UniqueEntityId
    title: string
    content: string
    slug: Slug
    createdAt: Date
    updatedAt: Date | null
  }
  author: {
    id: UniqueEntityId
    name: string
  }
  bestAnswerId: UniqueEntityId | null
  attachments: Attachment[]
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get question(): Readonly<QuestionDetailsProps['question']> {
    return this.props.question
  }

  get author(): Readonly<QuestionDetailsProps['author']> {
    return this.props.author
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get attachments(): Readonly<QuestionDetailsProps['attachments']> {
    return this.props.attachments
  }
}
