import { Module } from '@nestjs/common'

import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { ReadNotification } from '@/domain/notification/application/use-cases/read-notification'
import { SendNotification } from '@/domain/notification/application/use-cases/send-notification'

import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    SendNotification,
    ReadNotification,
  ],
})
export class EventsModule {}
