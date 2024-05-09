import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import { EnvService } from '@/env/env.service'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(env: EnvService) {
    const logLevels: Prisma.LogLevel[] = ['warn', 'error']
    if (!env.isTest) {
      logLevels.push('query')
    }

    super({ log: logLevels })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
