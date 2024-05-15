import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { SessionFactory } from 'test/factories/make-session'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AppModule } from '@/infra/app.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { DatabaseModule } from '@/infra/database/database.module'

import { PrismaQuestionsRepository } from './prisma-questions-repository'

describe('PrismaQuestionsRepository (e2e)', () => {
  let app: INestApplication
  let sut: PrismaQuestionsRepository
  let sessionFactory: SessionFactory
  let questionFactory: QuestionFactory
  let cacheRepository: CacheRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [QuestionFactory, SessionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    sut = moduleRef.get(QuestionsRepository) as PrismaQuestionsRepository
    sessionFactory = moduleRef.get(SessionFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    cacheRepository = moduleRef.get(CacheRepository)

    await app.init()
  })

  it('should cache question details', async () => {
    const { user } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })

    const slug = question.slug.value
    const questionDetails = await sut.findDetailsBySlug(slug)
    const cachedQuestionDetails = await cacheRepository.get(
      `question:${slug}:details`,
    )

    expect(cachedQuestionDetails).toEqual(JSON.stringify(questionDetails))
  })

  it('should return cached question details on subsequent calls', async () => {
    const { user } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })
    const slug = question.slug.value
    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    const questionDetails = await sut.findDetailsBySlug(slug)
    expect(questionDetails).toEqual({ empty: true })
  })

  it('should reset question details cache when saving the question', async () => {
    const { user } = await sessionFactory.make()
    const question = await questionFactory.make({ authorId: user.id })
    const slug = question.slug.value

    await sut.findDetailsBySlug(slug)

    question.content = 'New content'
    await sut.save(question)

    const cached = await cacheRepository.get(`question:${slug}:details`)
    expect(cached).toBeNull()
  })
})
