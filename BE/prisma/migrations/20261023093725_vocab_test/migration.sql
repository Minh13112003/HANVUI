-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "hsk2List" INTEGER;

-- CreateTable
CREATE TABLE "VocabTest" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "level" INTEGER,
    "mode" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "setSize" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "pct" INTEGER,
    "detail" JSONB,

    CONSTRAINT "VocabTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VocabTest_userId_level_idx" ON "VocabTest"("userId", "level");

-- AddForeignKey
ALTER TABLE "VocabTest" ADD CONSTRAINT "VocabTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
