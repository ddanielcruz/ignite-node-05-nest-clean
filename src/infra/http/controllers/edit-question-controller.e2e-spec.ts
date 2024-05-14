import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { SessionFactory } from 'test/factories/make-session'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('EditQuestionController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sessionFactory: SessionFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        SessionFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    sessionFactory = moduleRef.get(SessionFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })

  test('[PUT] /questions/:id', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })
    const attachment1 = await attachmentFactory.make()
    const attachment2 = await attachmentFactory.make()
    const attachment3 = await attachmentFactory.make()
    await questionAttachmentFactory.make({
      attachmentId: attachment1.id,
      questionId: question.id,
    })
    await questionAttachmentFactory.make({
      attachmentId: attachment2.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .send({
        title: 'How to create a new question?',
        content: 'I want to create a new question, how can I do that?',
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
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

    const attachments = await prisma.attachment.findMany()
    expect(attachments).toHaveLength(2)
    expect(attachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
          questionId: question.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
          questionId: question.id.toString(),
        }),
      ]),
    )
  })
})
