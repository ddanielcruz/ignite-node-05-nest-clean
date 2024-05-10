-- AlterTable
ALTER TABLE "answers" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "updated_at" DROP NOT NULL;
