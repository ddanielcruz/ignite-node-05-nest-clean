import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class QuestionDetailsPresenter {
  static toHTTP({
    question,
    bestAnswerId,
    author,
    attachments,
  }: QuestionDetails) {
    return {
      id: question.id.toString(),
      bestAnswerId: bestAnswerId?.toString() ?? null,
      title: question.title,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: {
        id: author.id.toString(),
        name: author.name,
      },
      attachments: attachments.map((attachment) => {
        return {
          id: attachment.id.toString(),
          title: attachment.title,
          url: attachment.url,
        }
      }),
    }
  }
}
