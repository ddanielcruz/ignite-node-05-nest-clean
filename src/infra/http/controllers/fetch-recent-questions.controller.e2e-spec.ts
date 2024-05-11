import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { SessionFactory } from 'test/factories/make-session'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('FetchRecentQuestionsController (e2e)', () => {
  let app: INestApplication
  let sessionFactory: SessionFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SessionFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    sessionFactory = moduleRef.get(SessionFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const question1 = await questionFactory.make({ authorId: user.id })
    const question2 = await questionFactory.make({ authorId: user.id })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: question2.title }),
        expect.objectContaining({ title: question1.title }),
      ]),
    })
  })
})
