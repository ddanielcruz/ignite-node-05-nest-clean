import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  students: Student[] = []

  async create(student: Student): Promise<void> {
    this.students.push(student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.students.find((student) => student.email === email) || null
  }

  async findById(id: string): Promise<Student | null> {
    return this.students.find((student) => student.id.equals(id)) || null
  }
}
