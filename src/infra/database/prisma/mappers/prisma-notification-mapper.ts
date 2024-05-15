import { Notification as PrismaNotification, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class PrismaNotificationMapper {
  static toDomain(notification: PrismaNotification): Notification {
    return new Notification(
      {
        title: notification.title,
        content: notification.content,
        recipientId: new UniqueEntityId(notification.recipientId),
        createdAt: notification.createdAt,
        readAt: notification.readAt,
        updatedAt: notification.updatedAt,
      },
      notification.id,
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      content: notification.content,
      readAt: notification.readAt,
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }
  }
}
