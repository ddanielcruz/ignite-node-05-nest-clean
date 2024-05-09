import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public attachments: QuestionAttachment[] = []

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return this.attachments.filter((a) => a.questionId.value === questionId)
  }
}
