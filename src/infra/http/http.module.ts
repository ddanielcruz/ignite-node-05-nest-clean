import { Module } from '@nestjs/common'

import { AuthenticateStudent } from '@/domain/forum/application/use-cases/authenticate-student'
import { CreateQuestion } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestions } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlug } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { RegisterStudent } from '@/domain/forum/application/use-cases/register-student'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
  ],
  providers: [
    CreateQuestion,
    FetchRecentQuestions,
    AuthenticateStudent,
    GetQuestionBySlug,
    RegisterStudent,
  ],
})
export class HttpModule {}
