import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { SessionFactory } from 'test/factories/make-session'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'

const TEST_SUITE_TIMEOUT = 15_000 // 15 seconds

describe('UploadAttachmentController', { timeout: TEST_SUITE_TIMEOUT }, () => {
  let app: INestApplication
  let sessionFactory: SessionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, StorageModule],
      providers: [QuestionFactory, SessionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    sessionFactory = moduleRef.get(SessionFactory)

    await app.init()
  })

  test('[POST] /attachments', async () => {
    const { accessToken } = await sessionFactory.make()

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', 'test/fixtures/sample-upload.png')

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({ attachmentId: expect.any(String) })
  })
})
