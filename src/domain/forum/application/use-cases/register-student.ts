import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { Student } from '../../enterprise/entities/student'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentsRepository } from '../repositories/students-repository'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

export type RegisterStudentRequest = {
  name: string
  email: string
  password: string
}

export type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>

@Injectable()
export class RegisterStudent {
  constructor(
    private readonly studentsRepo: StudentsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    const studentWithSameEmail = await this.studentsRepo.findByEmail(email)
    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const passwordHash = await this.hashGenerator.hash(password)
    const student = new Student({
      name,
      email,
      passwordHash,
    })

    await this.studentsRepo.create(student)

    return right({ student })
  }
}
