import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed.',
          statusCode: 400,
          errors: this.formatZodError(error),
        })
      }

      throw new BadRequestException('Validation failed')
    }
  }

  private formatZodError(errors: ZodError): Record<string, string[]> {
    return errors.errors.reduce<Record<string, string[]>>((acc, curr) => {
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
