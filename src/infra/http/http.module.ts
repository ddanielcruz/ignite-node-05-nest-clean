import { Module } from '@nestjs/common'

import { AuthenticateStudent } from '@/domain/forum/application/use-cases/authenticate-student'
import { CreateQuestion } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestions } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { RegisterStudent } from '@/domain/forum/application/use-cases/register-student'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestion,
    FetchRecentQuestions,
    AuthenticateStudent,
    RegisterStudent,
  ],
})
export class HttpModule {}
