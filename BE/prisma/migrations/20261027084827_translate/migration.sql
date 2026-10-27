-- CreateTable
CREATE TABLE "TranslateItem" (
    "id" SERIAL NOT NULL,
    "grammarId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "zh" TEXT NOT NULL,
    "vi" TEXT NOT NULL,
    "literal" TEXT NOT NULL,
    "chunks" JSONB NOT NULL,
    "alt" TEXT[],
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TranslateItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslateDone" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "itemId" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "self" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TranslateDone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TranslateItem_grammarId_zh_key" ON "TranslateItem"("grammarId", "zh");

-- CreateIndex
CREATE UNIQUE INDEX "TranslateDone_userId_itemId_direction_key" ON "TranslateDone"("userId", "itemId", "direction");

-- AddForeignKey
ALTER TABLE "TranslateItem" ADD CONSTRAINT "TranslateItem_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "GrammarPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslateDone" ADD CONSTRAINT "TranslateDone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslateDone" ADD CONSTRAINT "TranslateDone_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "TranslateItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
