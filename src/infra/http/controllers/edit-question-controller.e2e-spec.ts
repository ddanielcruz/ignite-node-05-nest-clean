import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { SessionFactory } from 'test/factories/make-session'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('EditQuestionController (e2e)', () => {
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

  test('[PUT] /questions/:id', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .send({
        title: 'How to create a new question?',
        content: 'I want to create a new question, how can I do that?',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    const questions = await prisma.question.findMany()

    expect(response.status).toEqual(204)
    expect(questions).toHaveLength(1)
    expect(questions[0]).toMatchObject({
      authorId: user.id.toString(),
      title: 'How to create a new question?',
      content: 'I want to create a new question, how can I do that?',
      slug: expect.any(String),
    })
  })
})
