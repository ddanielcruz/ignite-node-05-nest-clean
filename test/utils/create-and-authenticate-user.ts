import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

export async function createAndAuthenticateUser(
  app: INestApplication,
  prisma: PrismaService,
) {
  // Create an user
  const email = faker.internet.email()
  await request(app.getHttpServer()).post('/accounts').send({
    name: faker.person.fullName(),
    email,
    password: '123456',
  })

  // Authenticate the user
  const response = await request(app.getHttpServer()).post('/sessions').send({
    email,
    password: '123456',
  })

  const accessToken: string = response.body.accessToken
  const user = await prisma.user.findUniqueOrThrow({ where: { email } })

  return { accessToken, user }
}
