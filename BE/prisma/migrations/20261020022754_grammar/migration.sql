-- AlterTable
ALTER TABLE "WritingItem" ADD COLUMN     "grammarId" INTEGER;

-- CreateTable
CREATE TABLE "GrammarPoint" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "explain" TEXT NOT NULL,
    "compare" TEXT NOT NULL,
    "mistake" TEXT NOT NULL,
    "examples" JSONB NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GrammarPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GrammarPoint_slug_key" ON "GrammarPoint"("slug");

-- CreateIndex
CREATE INDEX "GrammarPoint_level_sort_idx" ON "GrammarPoint"("level", "sort");

-- CreateIndex
CREATE INDEX "WritingItem_grammarId_idx" ON "WritingItem"("grammarId");

-- AddForeignKey
ALTER TABLE "WritingItem" ADD CONSTRAINT "WritingItem_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "GrammarPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
