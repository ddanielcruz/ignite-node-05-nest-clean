import { UseCaseError } from '@/core/errors/use-case-error'

export class DuplicateQuestionError extends Error implements UseCaseError {
  constructor() {
    super('Question with the same title already exists.')
  }
}
