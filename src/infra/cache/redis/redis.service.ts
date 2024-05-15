import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(env: EnvService) {
    super({
      host: env.get('REDIS_HOST'),
      password: env.get('REDIS_PASSWORD'),
      port: env.get('REDIS_PORT'),
      db: env.get('REDIS_DB'),
    })
  }

  async onModuleDestroy() {
    await this.quit()
  }
}
