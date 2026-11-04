-- CreateTable
CREATE TABLE "TranslateSentence" (
    "id" SERIAL NOT NULL,
    "zh" TEXT NOT NULL,
    "vi" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "tokens" JSONB NOT NULL,
    "natural" JSONB NOT NULL,
    "accept" JSONB NOT NULL,
    "optional" INTEGER[],
    "filler" TEXT[],
    "orders" JSONB NOT NULL,
    "alt" TEXT[],
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TranslateSentence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslateSentenceDone" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "sentenceId" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TranslateSentenceDone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TranslateSentence_zh_key" ON "TranslateSentence"("zh");

-- CreateIndex
CREATE INDEX "TranslateSentence_level_sort_idx" ON "TranslateSentence"("level", "sort");

-- CreateIndex
CREATE UNIQUE INDEX "TranslateSentenceDone_userId_sentenceId_direction_key" ON "TranslateSentenceDone"("userId", "sentenceId", "direction");

-- AddForeignKey
ALTER TABLE "TranslateSentenceDone" ADD CONSTRAINT "TranslateSentenceDone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslateSentenceDone" ADD CONSTRAINT "TranslateSentenceDone_sentenceId_fkey" FOREIGN KEY ("sentenceId") REFERENCES "TranslateSentence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
