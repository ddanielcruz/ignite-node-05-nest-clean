import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'

import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly HASH_SALT_ROUNDS = 10

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.HASH_SALT_ROUNDS)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
  }
}
