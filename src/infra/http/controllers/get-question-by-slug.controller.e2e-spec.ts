import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { createAndAuthenticateUser } from 'test/utils/create-and-authenticate-user'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('GetQuestionBySlug (e2e)', () => {
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

  test('[GET] /questions/:slug', async () => {
    const { user, accessToken } = await createAndAuthenticateUser(app, prisma)
    const createdQuestion = await prisma.question.create({
      data: {
        title: 'Question 1',
        content: 'Content 1',
        slug: 'question-1',
        authorId: user.id,
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/${createdQuestion.slug}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Question 1' }),
    })
  })
})
