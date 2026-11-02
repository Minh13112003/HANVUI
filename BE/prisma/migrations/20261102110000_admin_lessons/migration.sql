ALTER TABLE "Lesson" ADD COLUMN "reviewed" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "TtsUsage" (
    "month" TEXT NOT NULL,
    "chars" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TtsUsage_pkey" PRIMARY KEY ("month")
);
