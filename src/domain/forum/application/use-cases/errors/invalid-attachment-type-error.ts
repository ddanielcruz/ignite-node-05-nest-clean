import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`The attachment type "${type}" is invalid.`)
    this.name = 'InvalidAttachmentTypeError'
  }
}
