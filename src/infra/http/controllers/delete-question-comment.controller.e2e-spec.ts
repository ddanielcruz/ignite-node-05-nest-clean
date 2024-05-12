import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { SessionFactory } from 'test/factories/make-session'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('DeleteQuestionCommentController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sessionFactory: SessionFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SessionFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    sessionFactory = moduleRef.get(SessionFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  test('[DELETE] /questions/comments/:id', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })
    const comment = await questionCommentFactory.make({
      questionId: question.id,
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${comment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    const comments = await prisma.comment.findMany()

    expect(response.status).toEqual(204)
    expect(comments).toHaveLength(0)
  })
})
