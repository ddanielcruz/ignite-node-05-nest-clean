import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public notifications: Notification[] = []

  async findById(id: string) {
    return this.notifications.find((item) => item.id.toString() === id) || null
  }

  async create(notification: Notification) {
    this.notifications.push(notification)
  }

  async save(notification: Notification) {
    const idx = this.notifications.findIndex(
      (item) => item.id === notification.id,
    )
    if (idx >= 0) {
      this.notifications[idx] = notification
    }
  }
}
