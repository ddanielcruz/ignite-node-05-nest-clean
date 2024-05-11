import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { createAndAuthenticateUser } from 'test/utils/create-and-authenticate-user'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('CreateQuestionController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const { user, accessToken } = await createAndAuthenticateUser(app, prisma)
    const response = await request(app.getHttpServer())
      .post('/questions')
      .send({
        title: 'How to create a new question?',
        content: 'I want to create a new question, how can I do that?',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    const questions = await prisma.question.findMany()

    expect(response.status).toEqual(204)
    expect(questions).toHaveLength(1)
    expect(questions[0]).toMatchObject({
      authorId: user.id,
      title: 'How to create a new question?',
      content: 'I want to create a new question, how can I do that?',
      slug: expect.any(String),
    })
  })
})
