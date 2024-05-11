import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('GetQuestionBySlug (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John',
        email: 'john@example.com',
        passwordHash: '123456',
      },
    })
    const accessToken = await jwt.signAsync({ sub: user.id })
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
