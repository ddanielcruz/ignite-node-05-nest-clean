import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

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
