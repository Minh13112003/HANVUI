-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "HskStandard" AS ENUM ('HSK2', 'HSK3');

-- CreateEnum
CREATE TYPE "TopicKind" AS ENUM ('VOCAB', 'SITUATION');

-- CreateEnum
CREATE TYPE "LessonKind" AS ENUM ('DIALOG', 'STORY');

-- CreateEnum
CREATE TYPE "TokenKind" AS ENUM ('HINT', 'ABSENCE', 'MONTH_END', 'RESERVE', 'CATCHUP', 'ADMIN');

-- CreateEnum
CREATE TYPE "ItemKind" AS ENUM ('VIP_3D');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "hskStandard" "HskStandard" NOT NULL DEFAULT 'HSK2',
    "hskLevel" INTEGER NOT NULL DEFAULT 1,
    "hoursLearned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vipUntil" TIMESTAMP(3),
    "eventOptOut" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "family" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLevelStat" (
    "userId" UUID NOT NULL,
    "standard" "HskStandard" NOT NULL,
    "level" INTEGER NOT NULL,
    "seconds" INTEGER NOT NULL DEFAULT 0,
    "words" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserLevelStat_pkey" PRIMARY KEY ("userId","standard","level")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "kind" "TopicKind" NOT NULL,
    "name" TEXT NOT NULL,
    "glyph" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "topicId" TEXT,
    "zh" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "vi" TEXT NOT NULL,
    "pos" TEXT,
    "phrase" BOOLEAN NOT NULL DEFAULT false,
    "hsk2" INTEGER,
    "hsk3" INTEGER,
    "example" JSONB,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "kind" "LessonKind" NOT NULL DEFAULT 'DIALOG',
    "title" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "tags" TEXT[],
    "level" INTEGER NOT NULL,
    "twinId" TEXT,
    "hsk2" INTEGER,
    "hsk3" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonTopic" (
    "lessonId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "LessonTopic_pkey" PRIMARY KEY ("lessonId","topicId")
);

-- CreateTable
CREATE TABLE "LessonRole" (
    "lessonId" TEXT NOT NULL,
    "who" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "pitchRange" INTEGER NOT NULL,
    "voiceId" TEXT,

    CONSTRAINT "LessonRole_pkey" PRIMARY KEY ("lessonId","who")
);

-- CreateTable
CREATE TABLE "LessonLine" (
    "lessonId" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "who" TEXT NOT NULL,
    "zh" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "vi" TEXT NOT NULL,
    "tokens" JSONB NOT NULL,
    "audioKey" TEXT,
    "audioHash" TEXT,

    CONSTRAINT "LessonLine_pkey" PRIMARY KEY ("lessonId","idx")
);

-- CreateTable
CREATE TABLE "LessonQuestion" (
    "lessonId" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "kind" TEXT,
    "prompt" TEXT NOT NULL,
    "promptVi" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answer" INTEGER NOT NULL,

    CONSTRAINT "LessonQuestion_pkey" PRIMARY KEY ("lessonId","idx")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleZh" TEXT,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "storyId" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "title" TEXT,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hoi" (
    "id" SERIAL NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "idx" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleZh" TEXT,
    "storyLessonId" TEXT,

    CONSTRAINT "Hoi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeySlot" (
    "id" SERIAL NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "idx" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    "clueTopicId" TEXT,
    "hintGeneral" JSONB NOT NULL,
    "hint1" JSONB NOT NULL,
    "hint2" JSONB NOT NULL,
    "hint3" JSONB NOT NULL,

    CONSTRAINT "KeySlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeySlotLesson" (
    "slotId" INTEGER NOT NULL,
    "lessonId" TEXT NOT NULL,
    "hskGroup" INTEGER NOT NULL,

    CONSTRAINT "KeySlotLesson_pkey" PRIMARY KEY ("slotId","lessonId")
);

-- CreateTable
CREATE TABLE "UserLesson" (
    "userId" UUID NOT NULL,
    "lessonId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" JSONB,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "allDone" BOOLEAN NOT NULL DEFAULT false,
    "transcript" BOOLEAN NOT NULL DEFAULT false,
    "skippedDay" TEXT,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLesson_pkey" PRIMARY KEY ("userId","lessonId")
);

-- CreateTable
CREATE TABLE "UserWord" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "wordId" INTEGER,
    "zh" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL DEFAULT '',
    "vi" TEXT NOT NULL DEFAULT '',
    "pos" TEXT,
    "isPhrase" BOOLEAN NOT NULL DEFAULT false,
    "aiPending" BOOLEAN NOT NULL DEFAULT false,
    "sourceLessonId" TEXT,
    "topics" TEXT[],
    "hsk2" INTEGER,
    "hsk3" INTEGER,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savedDay" TEXT NOT NULL,
    "reviewBox" INTEGER NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMP(3),

    CONSTRAINT "UserWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSlot" (
    "userId" UUID NOT NULL,
    "slotId" INTEGER NOT NULL,
    "hintsOpened" INTEGER NOT NULL DEFAULT 0,
    "hintGroups" INTEGER[],
    "foundAt" TIMESTAMP(3),
    "points" INTEGER NOT NULL DEFAULT 0,
    "early" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSlot_pkey" PRIMARY KEY ("userId","slotId")
);

-- CreateTable
CREATE TABLE "UserEvent" (
    "userId" UUID NOT NULL,
    "month" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "solved" INTEGER NOT NULL DEFAULT 0,
    "medal" INTEGER NOT NULL DEFAULT 0,
    "lastSolvedAt" TIMESTAMP(3),
    "wrong" INTEGER NOT NULL DEFAULT 0,
    "left" INTEGER NOT NULL DEFAULT 3,
    "penalty" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "loginBits" INTEGER NOT NULL DEFAULT 0,
    "joinDay" INTEGER NOT NULL,
    "lastLoginDay" INTEGER NOT NULL,
    "weekLessons" INTEGER[] DEFAULT ARRAY[0, 0, 0, 0]::INTEGER[],
    "weekOnlineSec" INTEGER[] DEFAULT ARRAY[0, 0, 0, 0]::INTEGER[],
    "weekClaimed" INTEGER[] DEFAULT ARRAY[0, 0, 0, 0]::INTEGER[],
    "flags" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("userId","month")
);

-- CreateTable
CREATE TABLE "UserMission" (
    "userId" UUID NOT NULL,
    "day" TEXT NOT NULL,
    "lessonIds" TEXT[],
    "onlineSec" INTEGER NOT NULL DEFAULT 0,
    "lastPingAt" TIMESTAMP(3),
    "claimed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserMission_pkey" PRIMARY KEY ("userId","day")
);

-- CreateTable
CREATE TABLE "TokenLedger" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "month" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "kind" "TokenKind" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "kind" "ItemKind" NOT NULL,
    "source" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "openedAt" TIMESTAMP(3),

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "standard" "HskStandard" NOT NULL,
    "level" INTEGER NOT NULL,
    "idx" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "passScore" INTEGER NOT NULL,
    "sections" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAttempt" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "examId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "score" INTEGER,
    "passed" BOOLEAN,
    "leveledUp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExamAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_family_idx" ON "RefreshToken"("family");

-- CreateIndex
CREATE INDEX "Word_topicId_idx" ON "Word"("topicId");

-- CreateIndex
CREATE INDEX "Word_zh_idx" ON "Word"("zh");

-- CreateIndex
CREATE UNIQUE INDEX "Word_zh_pinyin_key" ON "Word"("zh", "pinyin");

-- CreateIndex
CREATE INDEX "Lesson_kind_level_idx" ON "Lesson"("kind", "level");

-- CreateIndex
CREATE INDEX "LessonTopic_topicId_idx" ON "LessonTopic"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Story_month_key" ON "Story"("month");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_storyId_idx_key" ON "Chapter"("storyId", "idx");

-- CreateIndex
CREATE UNIQUE INDEX "Hoi_chapterId_idx_key" ON "Hoi"("chapterId", "idx");

-- CreateIndex
CREATE UNIQUE INDEX "KeySlot_chapterId_idx_key" ON "KeySlot"("chapterId", "idx");

-- CreateIndex
CREATE INDEX "UserWord_userId_savedDay_idx" ON "UserWord"("userId", "savedDay");

-- CreateIndex
CREATE UNIQUE INDEX "UserWord_userId_zh_key" ON "UserWord"("userId", "zh");

-- CreateIndex
CREATE INDEX "UserEvent_month_points_medal_lastSolvedAt_idx" ON "UserEvent"("month", "points" DESC, "medal" DESC, "lastSolvedAt");

-- CreateIndex
CREATE INDEX "TokenLedger_userId_month_idx" ON "TokenLedger"("userId", "month");

-- CreateIndex
CREATE INDEX "InventoryItem_userId_idx" ON "InventoryItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_userId_source_key" ON "InventoryItem"("userId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_standard_level_idx_key" ON "Exam"("standard", "level", "idx");

-- CreateIndex
CREATE INDEX "ExamAttempt_userId_idx" ON "ExamAttempt"("userId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLevelStat" ADD CONSTRAINT "UserLevelStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTopic" ADD CONSTRAINT "LessonTopic_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTopic" ADD CONSTRAINT "LessonTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonRole" ADD CONSTRAINT "LessonRole_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLine" ADD CONSTRAINT "LessonLine_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonQuestion" ADD CONSTRAINT "LessonQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hoi" ADD CONSTRAINT "Hoi_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hoi" ADD CONSTRAINT "Hoi_storyLessonId_fkey" FOREIGN KEY ("storyLessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeySlot" ADD CONSTRAINT "KeySlot_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeySlot" ADD CONSTRAINT "KeySlot_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeySlot" ADD CONSTRAINT "KeySlot_clueTopicId_fkey" FOREIGN KEY ("clueTopicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeySlotLesson" ADD CONSTRAINT "KeySlotLesson_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "KeySlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeySlotLesson" ADD CONSTRAINT "KeySlotLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLesson" ADD CONSTRAINT "UserLesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLesson" ADD CONSTRAINT "UserLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWord" ADD CONSTRAINT "UserWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWord" ADD CONSTRAINT "UserWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSlot" ADD CONSTRAINT "UserSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSlot" ADD CONSTRAINT "UserSlot_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "KeySlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMission" ADD CONSTRAINT "UserMission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenLedger" ADD CONSTRAINT "TokenLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
