import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { SessionFactory } from 'test/factories/make-session'
import { waitFor } from 'test/utils/wait-for'

import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('OnAnswerCreated (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sessionFactory: SessionFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    DomainEvents.shouldRun = true

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

  it('should send a notification when answer is created', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })
    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .send({ content: 'Lorem ipsum dolor sit amet.' })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toEqual(204)

    await waitFor(async () => {
      const notifications = await prisma.notification.findMany()
      expect(notifications).toHaveLength(1)
    })
  })
})
