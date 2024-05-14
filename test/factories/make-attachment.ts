import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export type AttachmentFactoryProps = Partial<
  AttachmentProps & { id: UniqueEntityId | string }
>

export function makeAttachment(override?: AttachmentFactoryProps): Attachment {
  return new Attachment(
    {
      title: faker.lorem.slug(),
      url: faker.internet.url(),
      ...override,
    },
    override?.id,
  )
}

@Injectable()
export class AttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async make(override?: AttachmentFactoryProps) {
    const attachment = makeAttachment(override)
    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }
}
