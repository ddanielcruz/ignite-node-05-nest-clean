import { Module } from '@nestjs/common'

import { AnswerQuestion } from '@/domain/forum/application/use-cases/answer-question'
import { AuthenticateStudent } from '@/domain/forum/application/use-cases/authenticate-student'
import { ChooseQuestionBestAnswer } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnAnswer } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestion } from '@/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestion } from '@/domain/forum/application/use-cases/create-question'
import { DeleteAnswer } from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteAnswerComment } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { DeleteQuestion } from '@/domain/forum/application/use-cases/delete-question'
import { DeleteQuestionComment } from '@/domain/forum/application/use-cases/delete-question-comment'
import { EditAnswer } from '@/domain/forum/application/use-cases/edit-answer'
import { EditQuestion } from '@/domain/forum/application/use-cases/edit-question'
import { FetchAnswerComments } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { FetchQuestionAnswers } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { FetchQuestionComments } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { FetchRecentQuestions } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlug } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { RegisterStudent } from '@/domain/forum/application/use-cases/register-student'
import { UploadAttachment } from '@/domain/forum/application/use-cases/upload-attachment'
import { ReadNotification } from '@/domain/notification/application/use-cases/read-notification'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller'
import { CommentOnQuestionController } from './controllers/comment-on-question.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditQuestionController } from './controllers/edit-question-controller'
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller'
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller'
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { ReadNotificationController } from './controllers/read-notification.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'

@Module({
  imports: [CryptographyModule, DatabaseModule, StorageModule],
  controllers: [
    AuthenticateController,
    AnswerQuestionController,
    CreateAccountController,
    CreateQuestionController,
    DeleteQuestionController,
    EditQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    AuthenticateStudent,
    AnswerQuestion,
    CreateQuestion,
    DeleteQuestion,
    EditQuestion,
    FetchRecentQuestions,
    GetQuestionBySlug,
    RegisterStudent,
    EditAnswer,
    DeleteAnswer,
    FetchQuestionAnswers,
    ChooseQuestionBestAnswer,
    CommentOnQuestion,
    DeleteQuestionComment,
    CommentOnAnswer,
    DeleteAnswerComment,
    FetchQuestionComments,
    FetchAnswerComments,
    UploadAttachment,
    ReadNotification,
  ],
})
export class HttpModule {}
