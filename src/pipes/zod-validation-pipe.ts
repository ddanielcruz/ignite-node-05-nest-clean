import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

interface ZodValidationOptions {
  type?: ArgumentMetadata['type']
  data?: ArgumentMetadata['data']
}

const DEFAULT_TYPE: ArgumentMetadata['type'] = 'body'

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: ZodSchema,
    private readonly options?: ZodValidationOptions,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== (this.options?.type || DEFAULT_TYPE)) {
      return value
    }

    if (this.options?.data && metadata.data !== this.options.data) {
      return value
    }

    const result = this.schema.safeParse(value)
    if (result.success) {
      return result.data
    }

    throw new BadRequestException({
      message: 'Validation failed.',
      statusCode: 400,
      errors: this.formatZodError(result.error),
    })
  }

  private formatZodError(errors: ZodError): Record<string, string[]> {
    return errors.errors.reduce<Record<string, string[]>>((acc, curr) => {
      // BUG Path is empty on non-object schemas
      const field = curr.path.join('.')
      const message = curr.message

      if (acc[field]) {
        acc[field].push(message)
      } else {
        acc[field] = [message]
      }

      return acc
    }, {})
  }
}
