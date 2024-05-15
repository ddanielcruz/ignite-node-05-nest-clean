import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { NotificationFactory } from 'test/factories/make-notification'
import { SessionFactory } from 'test/factories/make-session'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('ReadNotification (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sessionFactory: SessionFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SessionFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    sessionFactory = moduleRef.get(SessionFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const notification = await notificationFactory.make({
      recipientId: user.id,
    })

    const notificationId = notification.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
