-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('AVATAR', 'LESSON_COVER', 'ROLE_AVATAR');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "coverId" TEXT;

-- AlterTable
ALTER TABLE "LessonRole" ADD COLUMN     "avatarId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarId" TEXT;

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "ownerId" UUID,
    "bytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_publicId_key" ON "MediaAsset"("publicId");

-- CreateIndex
CREATE INDEX "MediaAsset_kind_idx" ON "MediaAsset"("kind");

-- CreateIndex
CREATE INDEX "MediaAsset_ownerId_idx" ON "MediaAsset"("ownerId");
