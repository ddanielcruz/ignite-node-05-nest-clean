import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'

import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionsRepository } from '../repositories/questions-repository'
import { DuplicateQuestionError } from './errors/duplicate-question-error'

interface CreateQuestionRequest {
  authorId: string
  title: string
  content: string
  attachmentIds: string[]
}

type CreateQuestionResponse = Either<
  DuplicateQuestionError,
  { question: Question }
>
@Injectable()
export class CreateQuestion {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(
    request: CreateQuestionRequest,
  ): Promise<CreateQuestionResponse> {
    const question = new Question({
      authorId: new UniqueEntityId(request.authorId),
      title: request.title,
      content: request.content,
    })

    const questionWithSameSlug = await this.questionsRepository.findBySlug(
      question.slug.value,
    )

    if (questionWithSameSlug) {
      return left(new DuplicateQuestionError())
    }

    question.attachments = new QuestionAttachmentList(
      request.attachmentIds.map(
        (attachmentId) =>
          new QuestionAttachment({
            questionId: question.id,
            attachmentId: new UniqueEntityId(attachmentId),
          }),
      ),
    )

    await this.questionsRepository.create(question)

    return right({ question })
  }
}
