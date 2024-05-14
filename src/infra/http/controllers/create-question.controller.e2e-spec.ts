import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { SessionFactory } from 'test/factories/make-session'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('CreateQuestionController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sessionFactory: SessionFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SessionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    sessionFactory = moduleRef.get(SessionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const attachment1 = await attachmentFactory.make()
    const attachment2 = await attachmentFactory.make()

    const response = await request(app.getHttpServer())
      .post('/questions')
      .send({
        title: 'How to create a new question?',
        content: 'I want to create a new question, how can I do that?',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
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

    const attachmentsOnDb = await prisma.attachment.findMany({
      where: { questionId: questions[0].id },
    })
    expect(attachmentsOnDb).toHaveLength(2)
  })
})
