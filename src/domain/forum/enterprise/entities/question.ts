import { AggregateRootWithTimestamps } from '@/core/entities/aggregate-root'
import { Timestamps } from '@/core/entities/timestamps'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { QuestionBestQuestionChosenEvent } from '../events/question-best-answer-chosen-event'
import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId: UniqueEntityId | null
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachmentList
}

export class Question extends AggregateRootWithTimestamps<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(value: UniqueEntityId | null) {
    if (value && !value.equals(this.props.bestAnswerId)) {
      this.addDomainEvent(new QuestionBestQuestionChosenEvent(this, value))
    }

    this.props.bestAnswerId = value
    this.onUpdate()
  }

  get title() {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
    this.props.slug = Slug.createFromText(value)
    this.onUpdate()
  }

  get abbreviatedTitle() {
    let value = this.title.substring(0, 40).trimEnd()
    if (this.title.length > value.length) {
      value += '...'
    }

    return value
  }

  get content() {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.onUpdate()
  }

  get slug() {
    return this.props.slug
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments
  }

  set attachments(value: QuestionAttachmentList) {
    this.props.attachments = value
    this.onUpdate()
  }

  constructor(
    props: Optional<QuestionProps, 'bestAnswerId' | 'slug' | 'attachments'> &
      Partial<Timestamps>,
    id?: UniqueEntityId | string,
  ) {
    super(
      {
        bestAnswerId: null,
        slug: Slug.createFromText(props.title),
        attachments: new QuestionAttachmentList(),
        ...props,
      },
      id,
    )
  }
}
