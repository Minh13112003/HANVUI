-- CreateEnum
CREATE TYPE "WritingType" AS ENUM ('ORDER', 'FILL', 'CHOOSE');

-- AlterEnum
ALTER TYPE "LessonKind" ADD VALUE 'READING';

-- CreateTable
CREATE TABLE "WritingItem" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "type" "WritingType" NOT NULL,
    "vi" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WritingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingDone" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "itemId" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingDone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WritingItem_level_type_idx" ON "WritingItem"("level", "type");

-- CreateIndex
CREATE UNIQUE INDEX "WritingDone_userId_itemId_key" ON "WritingDone"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "WritingDone" ADD CONSTRAINT "WritingDone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingDone" ADD CONSTRAINT "WritingDone_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "WritingItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
