-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "colloc" JSONB,
ADD COLUMN     "mnemonic" TEXT;

-- CreateTable
CREATE TABLE "Hanzi" (
    "ch" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "vi" TEXT,
    "ids" TEXT NOT NULL,
    "radical" TEXT NOT NULL,
    "kind" TEXT,
    "semantic" TEXT,
    "phonetic" TEXT,
    "parts" TEXT[],

    CONSTRAINT "Hanzi_pkey" PRIMARY KEY ("ch")
);

-- CreateTable
CREATE TABLE "WordCompare" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "words" TEXT[],
    "title" TEXT NOT NULL,
    "explain" TEXT NOT NULL,
    "uses" JSONB NOT NULL,
    "trap" JSONB,

    CONSTRAINT "WordCompare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WordCompare_slug_key" ON "WordCompare"("slug");
