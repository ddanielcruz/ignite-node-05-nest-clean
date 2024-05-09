import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { Env } from './env.schema'

@Injectable()
export class EnvService {
  get isProduction(): boolean {
    return this.config.get('NODE_ENV') === 'production'
  }

  get isDevelopment(): boolean {
    return this.config.get('NODE_ENV') === 'development'
  }

  get isTest(): boolean {
    return this.config.get('NODE_ENV') === 'test'
  }

  constructor(private readonly config: ConfigService<Env, true>) {}

  get<K extends keyof Env>(key: K): Env[K] {
    return this.config.get(key)
  }
}
