import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('AuthenticateController (e2e)', () => {
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

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Daniel',
        email: 'daniel@example.com',
        passwordHash: await hash('123456', 1),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'daniel@example.com',
      password: '123456',
    })

    expect(response.status).toEqual(201)
    expect(response.body).toMatchObject({ accessToken: expect.any(String) })
  })
})
