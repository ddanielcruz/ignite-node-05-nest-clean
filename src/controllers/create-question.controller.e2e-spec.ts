import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('CreateQuestionController (e2e)', () => {
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

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John',
        email: 'john@example.com',
        passwordHash: '123456',
      },
    })
    const accessToken = await jwt.signAsync({ sub: user.id })

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
