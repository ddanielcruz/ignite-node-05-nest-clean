import { Injectable } from '@nestjs/common'

import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: answerComment.id.toString() },
    })
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    })

    return comment ? PrismaAnswerCommentMapper.toDomain(comment) : null
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * DEFAULT_PAGE_SIZE,
      take: DEFAULT_PAGE_SIZE,
    })

    return comments.map(PrismaAnswerCommentMapper.toDomain)
  }
}
