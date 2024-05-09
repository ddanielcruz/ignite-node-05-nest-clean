import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('CreateAccountController (e2e)', () => {
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

  test('[POST] /accounts', async () => {
    const email = 'daniel@example.com'
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Daniel',
      email,
      password: '123456',
    })

    const user = await prisma.user.findUnique({ where: { email } })

    expect(response.status).toEqual(201)
    expect(user).toMatchObject({
      name: 'Daniel',
      email,
      passwordHash: expect.any(String),
    })
    expect(user?.passwordHash).not.toEqual('123456')
  })
})
