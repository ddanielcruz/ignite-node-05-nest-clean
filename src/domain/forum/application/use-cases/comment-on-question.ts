import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments.repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CommentOnQuestionRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  { comment: QuestionComment }
>

export class CommentOnQuestion {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const comment = new QuestionComment({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })
    await this.questionCommentsRepository.create(comment)

    return right({ comment })
  }
}
