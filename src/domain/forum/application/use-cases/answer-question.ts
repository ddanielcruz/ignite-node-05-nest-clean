import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerAnswerRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentIds: string[]
}

type AnswerAnswerResponse = Either<never, { answer: Answer }>

export class AnswerQuestion {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentIds,
  }: AnswerAnswerRequest): Promise<AnswerAnswerResponse> {
    const answer = new Answer({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    answer.attachments = new AnswerAttachmentList(
      attachmentIds.map(
        (attachmentId) =>
          new AnswerAttachment({
            answerId: answer.id,
            attachmentId: new UniqueEntityId(attachmentId),
          }),
      ),
    )

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
