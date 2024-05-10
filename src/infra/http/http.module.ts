import { Module } from '@nestjs/common'

import { CreateQuestion } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestions } from '@/domain/forum/application/use-cases/fetch-recent-questions'

import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [CreateQuestion, FetchRecentQuestions],
})
export class HttpModule {}
