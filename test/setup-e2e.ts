import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { Redis } from 'ioredis'

import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/env.schema'

config({ path: '.env', override: true })
config({ path: '.env.test.local', override: true })

const schemaId = randomUUID()
const env = envSchema.parse(process.env)
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  db: env.REDIS_DB,
})

function generateUniqueDatabaseUrl() {
  const url = new URL(env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)

  return url.toString()
}

beforeAll(async () => {
  process.env.DATABASE_URL = generateUniqueDatabaseUrl()
  execSync('npx prisma migrate deploy', { env: process.env })

  await redis.flushdb()

  DomainEvents.shouldRun = false
})

afterAll(async () => {
  const prisma = new PrismaClient()
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`)
  await prisma.$disconnect()
})
