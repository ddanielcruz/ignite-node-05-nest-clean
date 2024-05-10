import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { RegisterStudent } from './register-student'

let sut: RegisterStudent
let studentsRepo: InMemoryStudentsRepository
let hashGenerator: HashGenerator

describe('RegisterStudent', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    hashGenerator = new FakeHasher()
    sut = new RegisterStudent(studentsRepo, hashGenerator)
  })

  it('should return StudentAlreadyExistsError if email is already used', async () => {
    const email = 'daniel@example.com'
    await studentsRepo.create(makeStudent({ email }))

    const result = await sut.execute({
      email,
      name: 'Daniel',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
  })

  it('should create a new student', async () => {
    const result = await sut.execute({
      email: 'daniel@example.com',
      name: 'Daniel',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      student: {
        id: expect.any(UniqueEntityId),
        name: 'Daniel',
        email: 'daniel@example.com',
        passwordHash: 'hashed:123456',
      },
    })
    expect(studentsRepo.students).toHaveLength(1)
  })
})
