import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'

import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CreateQuestionRequest {
  authorId: string
  title: string
  content: string
  attachmentIds: string[]
}

type CreateQuestionResponse = Either<never, { question: Question }>

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
