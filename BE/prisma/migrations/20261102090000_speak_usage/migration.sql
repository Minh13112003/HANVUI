-- Đếm lượt chấm phát âm mỗi người mỗi ngày và số giây âm thanh đã gửi Azure (rule.md 3.5).
CREATE TABLE "SpeakUsage" (
    "userId" UUID NOT NULL,
    "day" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "seconds" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "SpeakUsage_pkey" PRIMARY KEY ("userId","day")
);

CREATE INDEX "SpeakUsage_day_idx" ON "SpeakUsage"("day");

ALTER TABLE "SpeakUsage" ADD CONSTRAINT "SpeakUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
