import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { SessionFactory } from 'test/factories/make-session'
import { waitFor } from 'test/utils/wait-for'

import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('OnQuestionBestAnswerChosen (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sessionFactory: SessionFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    DomainEvents.shouldRun = true

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SessionFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    sessionFactory = moduleRef.get(SessionFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[PATCH] /answers/:id/choose-as-best', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })
    const answer = await answerFactory.make({
      questionId: question.id,
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/answers/${answer.id.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toEqual(204)

    await waitFor(async () => {
      const notifications = await prisma.notification.findMany()
      expect(notifications).toHaveLength(1)
    })
  })
})
