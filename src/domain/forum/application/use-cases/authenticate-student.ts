import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { StudentsRepository } from '../repositories/students-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

export type AuthenticateStudentRequest = {
  email: string
  password: string
}

export type AuthenticateStudentResponse = Either<
  InvalidCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateStudent {
  constructor(
    private readonly studentsRepo: StudentsRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentRequest): Promise<AuthenticateStudentResponse> {
    const student = await this.studentsRepo.findByEmail(email)
    if (!student) {
      return left(new InvalidCredentialsError())
    }

    const isSamePassword = await this.hashComparer.compare(
      password,
      student.passwordHash,
    )

    if (!isSamePassword) {
      return left(new InvalidCredentialsError())
    }

    const accessTokenPayload = { sub: student.id.toString() }
    const accessToken = await this.encrypter.encrypt(accessTokenPayload)

    return right({ accessToken })
  }
}
