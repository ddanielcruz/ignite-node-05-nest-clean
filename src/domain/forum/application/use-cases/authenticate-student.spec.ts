import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { Encrypter } from '../cryptography/encrypter'
import { AuthenticateStudent } from './authenticate-student'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let sut: AuthenticateStudent
let studentsRepo: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let encrypter: Encrypter

describe('AuthenticateStudent', () => {
  beforeEach(() => {
    studentsRepo = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateStudent(studentsRepo, fakeHasher, encrypter)
  })

  it('should return InvalidCredentialsError if email is invalid', async () => {
    const response = await sut.execute({
      email: 'daniel@example.com',
      password: '123456',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should return InvalidCredentialsError if password is invalid', async () => {
    const student = makeStudent()
    await studentsRepo.create(student)

    const response = await sut.execute({
      email: student.email,
      password: 'invalid-password',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should return an access token when credentials are valid', async () => {
    const password = '123456'
    const passwordHash = await fakeHasher.hash(password)
    const student = makeStudent({ passwordHash })
    await studentsRepo.create(student)

    const response = await sut.execute({
      email: student.email,
      password,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toMatchObject({ accessToken: expect.any(String) })
  })
})
