import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public attachments: AnswerAttachment[] = []

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.attachments.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const attachmentIds = attachments.map((a) => a.id.toString())
    this.attachments = this.attachments.filter((attachment) => {
      return !attachmentIds.includes(attachment.id.toString())
    })
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this.attachments.filter((a) => a.answerId.value === answerId)
  }
}
