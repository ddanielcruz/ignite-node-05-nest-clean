import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Comment, CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId(): UniqueEntityId {
    return this.props.answerId
  }
}
