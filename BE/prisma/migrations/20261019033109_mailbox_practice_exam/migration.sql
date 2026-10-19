-- CreateEnum
CREATE TYPE "MailSender" AS ENUM ('ADMIN', 'SYSTEM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TokenKind" ADD VALUE 'STARTER';
ALTER TYPE "TokenKind" ADD VALUE 'MAIL';

-- AlterTable
ALTER TABLE "ExamAttempt" ADD COLUMN     "answers" JSONB,
ADD COLUMN     "detail" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "practiceTokens" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Mail" (
    "id" SERIAL NOT NULL,
    "sender" "MailSender" NOT NULL DEFAULT 'ADMIN',
    "toUserId" UUID,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "rewardTokens" INTEGER NOT NULL DEFAULT 0,
    "rewardItem" "ItemKind",
    "createdBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMail" (
    "userId" UUID NOT NULL,
    "mailId" INTEGER NOT NULL,
    "readAt" TIMESTAMP(3),
    "claimedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserMail_pkey" PRIMARY KEY ("userId","mailId")
);

-- CreateIndex
CREATE INDEX "Mail_toUserId_createdAt_idx" ON "Mail"("toUserId", "createdAt");

-- CreateIndex
CREATE INDEX "Mail_createdAt_idx" ON "Mail"("createdAt");

-- CreateIndex
CREATE INDEX "UserMail_mailId_idx" ON "UserMail"("mailId");

-- AddForeignKey
ALTER TABLE "UserMail" ADD CONSTRAINT "UserMail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMail" ADD CONSTRAINT "UserMail_mailId_fkey" FOREIGN KEY ("mailId") REFERENCES "Mail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
