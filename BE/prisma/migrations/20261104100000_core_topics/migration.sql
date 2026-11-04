-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "synonyms" JSONB,
ADD COLUMN     "usage" TEXT;

-- CreateTable
CREATE TABLE "CoreTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "glyph" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CoreTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoreTopicWord" (
    "topicId" TEXT NOT NULL,
    "wordId" INTEGER NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CoreTopicWord_pkey" PRIMARY KEY ("topicId","wordId")
);

-- CreateIndex
CREATE INDEX "CoreTopicWord_wordId_idx" ON "CoreTopicWord"("wordId");

-- AddForeignKey
ALTER TABLE "CoreTopicWord" ADD CONSTRAINT "CoreTopicWord_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CoreTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreTopicWord" ADD CONSTRAINT "CoreTopicWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
