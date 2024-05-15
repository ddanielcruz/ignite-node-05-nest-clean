import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { SessionFactory } from 'test/factories/make-session'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('FetchQuestionCommentsController (e2e)', () => {
  let app: INestApplication
  let sessionFactory: SessionFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SessionFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    sessionFactory = moduleRef.get(SessionFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  test('[GET] /questions/:questionId/comments', async () => {
    const { user, accessToken } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })

    await Promise.all([
      questionCommentFactory.make({
        questionId: question.id,
        authorId: user.id,
        content: 'Comment 1',
      }),
      questionCommentFactory.make({
        questionId: question.id,
        authorId: user.id,
        content: 'Comment 2',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Comment 1',
          author: expect.objectContaining({
            id: user.id.toString(),
            name: user.name,
          }),
        }),
        expect.objectContaining({
          content: 'Comment 2',
          author: expect.objectContaining({
            id: user.id.toString(),
            name: user.name,
          }),
        }),
      ]),
    })
  })
})
