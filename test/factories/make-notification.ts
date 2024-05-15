import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

type NotificationFactoryProps = Partial<
  NotificationProps & { id: UniqueEntityId }
>

export function makeNotification(override?: NotificationFactoryProps) {
  return new Notification(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    override?.id,
  )
}

@Injectable()
export class NotificationFactory {
  constructor(private readonly prisma: PrismaService) {}

  async make(override?: NotificationFactoryProps) {
    const notification = makeNotification(override)
    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    })

    return notification
  }
}
