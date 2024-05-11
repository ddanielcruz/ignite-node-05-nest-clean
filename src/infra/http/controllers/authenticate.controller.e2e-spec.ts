import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('AuthenticateController (e2e)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const student = await studentFactory.make({
      passwordHash: await hash('123456', 1),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: student.email,
      password: '123456',
    })

    expect(response.status).toEqual(201)
    expect(response.body).toMatchObject({ accessToken: expect.any(String) })
  })
})
