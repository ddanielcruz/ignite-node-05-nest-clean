import { AggregateRootWithTimestamps } from '@/core/entities/aggregate-root'
import { Timestamps } from '@/core/entities/timestamps'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { AnswerCreatedEvent } from '../events/answer-created-event'
import { AnswerAttachmentList } from './answer-attachment-list'

export interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  attachments: AnswerAttachmentList
}

export type AnswerConstructorProps = Optional<AnswerProps, 'attachments'> &
  Partial<Timestamps>

export class Answer extends AggregateRootWithTimestamps<AnswerProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.onUpdate()
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(value: AnswerAttachmentList) {
    this.props.attachments = value
    this.onUpdate()
  }

  constructor(props: AnswerConstructorProps, id?: UniqueEntityId | string) {
    super({ attachments: new AnswerAttachmentList(), ...props }, id)

    const isNewAnswer = !id
    if (isNewAnswer) {
      this.addDomainEvent(new AnswerCreatedEvent(this))
    }
  }
}
