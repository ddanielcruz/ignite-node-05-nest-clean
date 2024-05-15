import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAutor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public readonly studentsRepo: InMemoryStudentsRepository

  public comments: QuestionComment[] = []

  constructor(studentsRepo?: InMemoryStudentsRepository) {
    this.studentsRepo = studentsRepo ?? new InMemoryStudentsRepository()
  }

  async create(question: QuestionComment): Promise<void> {
    this.comments.push(question)
  }

  async delete(question: QuestionComment): Promise<void> {
    const index = this.comments.findIndex((c) => c.id === question.id)
    this.comments.splice(index, 1)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    return this.comments.find((c) => c.id.value === id) || null
  }

  async findManyByQuestionId(
    questionId: string,
    options: PaginationParams,
  ): Promise<QuestionComment[]> {
    const offset = (options.page - 1) * DEFAULT_PAGE_SIZE
    return this.comments
      .filter((c) => c.questionId.value === questionId)
      .slice(offset, offset + DEFAULT_PAGE_SIZE)
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    options: PaginationParams,
  ): Promise<CommentWithAutor[]> {
    const offset = (options.page - 1) * DEFAULT_PAGE_SIZE
    return this.comments
      .filter((c) => c.questionId.value === questionId)
      .slice(offset, offset + DEFAULT_PAGE_SIZE)
      .map((c) => {
        const author = this.studentsRepo.students.find((student) =>
          student.id.equals(c.authorId),
        )

        if (!author) {
          throw new Error('Author not found')
        }

        return new CommentWithAutor({
          author: {
            id: c.authorId.toString(),
            name: author.name,
          },
          comment: {
            id: c.id.toString(),
            content: c.content,
          },
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        })
      })
  }
}
