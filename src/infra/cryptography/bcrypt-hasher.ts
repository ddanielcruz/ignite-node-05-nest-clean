import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'

import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

import { EnvService } from '../env/env.service'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private get hashSaltRounds(): number {
    // For tests, we want to use a low number of rounds to speed up the tests
    if (this.env.isTest) {
      return 1
    }

    return 10
  }

  constructor(private readonly env: EnvService) {}

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.hashSaltRounds)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
  }
}
