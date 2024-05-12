import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { SessionFactory } from 'test/factories/make-session'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('CommentOnQuestionController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sessionFactory: SessionFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SessionFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    sessionFactory = moduleRef.get(SessionFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[POST] /questions/:questionId/comments', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })
    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/comments`)
      .send({ content: 'Lorem ipsum dolor sit amet.' })
      .set('Authorization', `Bearer ${accessToken}`)

    const comments = await prisma.comment.findMany()

    expect(response.status).toEqual(204)
    expect(comments).toHaveLength(1)
    expect(comments[0].content).toEqual('Lorem ipsum dolor sit amet.')
  })
})
