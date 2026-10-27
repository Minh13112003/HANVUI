// Hình dạng dữ liệu BE trả về (xem BE/src/**/*.service.ts).

export type HskStandard = 'HSK2' | 'HSK3';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
  hskStandard: HskStandard;
  hskLevel: number;
  isVip: boolean;
}

export interface Topic {
  id: string;
  kind: 'VOCAB' | 'SITUATION';
  name: string;
  glyph: string | null;
  sort: number;
}

export interface Word {
  id: number;
  topicId: string | null;
  zh: string;
  pinyin: string;
  vi: string;
  pos: string | null;
  phrase: boolean;
  hsk2: number | null;
  hsk3: number | null;
  example: { zh: string; pinyin: string; vi: string } | null;
}

export interface LessonCard {
  id: string;
  title: string;
  situation: string;
  tags: string[];
  topics: { id: string; name: string; glyph?: string | null }[];
  level: number;
  /** Cấp hiển thị: cấp đã soạn, chỉ cao hơn khi hơn 70% từ của bài thuộc cấp cao hơn. */
  levelShown?: number;
  hsk2: number | null;
  hsk3: number | null;
  twinId: string | null;
  lines: number;
  /** Bài cấp cao hơn cấp của người học: khóa tới khi thi đạt đề lên cấp. */
  locked?: boolean;
  unlockLevel?: number;
  status: 'new' | 'started' | 'done';
}

export interface Role {
  who: string;
  label: string;
  gender: string;
  pitchRange: number;
  voiceId: string | null;
}

export interface Token {
  t: string;
  p?: string;
  v?: string;
  x?: boolean;
}

export interface Line {
  idx: number;
  who: string;
  zh?: string;
  pinyin?: string;
  vi?: string;
  tokens?: Token[];
  audioKey?: string | null;
}

export interface Question {
  idx: number;
  kind: string | null;
  prompt: string;
  options: string[];
  promptVi?: string;
  optionsVi?: string[];
}

export interface Lesson {
  id: string;
  kind: 'DIALOG' | 'STORY' | 'READING';
  title: string;
  situation: string;
  level: number;
  /** Cấp hiển thị: cấp đã soạn, chỉ cao hơn khi hơn 70% từ của bài thuộc cấp cao hơn. */
  levelShown?: number;
  hsk2: number | null;
  hsk3: number | null;
  twinId: string | null;
  topics: { id: string; name: string; glyph?: string | null }[];
  roles: Role[];
  lines: Line[];
  questions: Question[];
  progress: { transcript: boolean; allDone: boolean; correct: number };
}

export interface AnswerResult {
  correct: number;
  total: number;
  results: {
    idx: number;
    picked: number;
    correct: boolean;
    answer: number;
    promptVi: string;
    optionsVi: string[];
  }[];
  mission: { lessonsToday: number; granted: number; counted: boolean } | null;
}

export interface UserWord {
  id: number;
  zh: string;
  pinyin: string;
  vi: string;
  pos: string | null;
  isPhrase: boolean;
  aiPending: boolean;
  sourceLessonId: string | null;
  topics: string[];
  hsk2: number | null;
  hsk3: number | null;
  savedDay: string;
}

export interface Notebook {
  total: number;
  today: number;
  groups: { key: string; count: number; words: UserWord[] }[];
}

export interface Hint {
  zh: string;
  vi: string;
}

export interface HintLesson {
  id: string;
  title: string;
  level: number;
}

export interface Cell {
  pos: number;
  slotId: number;
  status: 'locked' | 'open' | 'solved';
  unlockDay?: number;
  hintsOpened?: number;
  hintGeneral?: Hint;
  hint1?: Hint | null;
  hint2?: Hint | null;
  /** Gợi ý 2 chỉ thẳng một bài chứa từ khóa (tên bài đã che nếu trùng từ khóa). */
  hint2Lesson?: HintLesson | null;
  hint3?: Hint | null;
  clueTopicId?: string | null;
  points?: number | null;
  word?: { zh: string; pinyin: string; vi: string } | null;
}

export interface Chapter {
  idx: number;
  current: boolean;
  solved: number;
  hoi: { idx: number; title: string; titleZh: string | null; opened: boolean; lessonId: string | null }[];
  cells: Cell[];
}

export interface WeeklyTask {
  key: 'login' | 'online' | 'lessons';
  marks: [number, number, number];
  rewards: [number, number, number];
}

export interface EventState {
  active: boolean;
  month: string;
  story?: { id: string; title: string; titleZh: string | null; month: string };
  day?: number;
  daysInMonth?: number;
  reserveDay?: boolean;
  optedOut?: boolean;
  tokens?: number;
  points?: number;
  solved?: number;
  totalKeys?: number;
  medal?: { level: number; name: string | null; thresholds: number[] };
  lockedUntil?: string | null;
  wrongLeft?: number;
  pendingPenalty?: number;
  week?: { index: number; login: number; online: number; lessons: number; marks: WeeklyTask[]; claimed: number };
  chapters?: Chapter[];
}

export interface GuessResult {
  correct: boolean;
  message?: string;
  wrongLeft?: number;
  penaltyAdded?: number;
  lockedUntil?: string | null;
  word?: { zh: string; pinyin: string; vi: string };
  points?: number;
  solved?: number;
  newMedal?: { level: number; name: string } | null;
  hoiOpened?: number | null;
  vipItem?: boolean;
}

export interface BoardRow {
  rank: number;
  name: string;
  points: number;
  solved: number;
  medal: { level: number; name: string } | null;
  me: boolean;
}

export interface Leaderboard {
  month: string;
  board: BoardRow[];
  me: BoardRow | null;
}

export interface InventoryItem {
  id: number;
  kind: 'VIP_3D';
  source: string | null;
  receivedAt: string;
  expiresAt: string;
  openedAt: string | null;
}

export interface CheckinResult {
  granted: number;
  alreadyCheckedIn: boolean;
  parts?: { reason: string; tokens: number }[];
}

export interface HintResult {
  hintNo: number;
  hint: Hint | null;
  clueTopicId?: string | null;
  hint2Lesson?: HintLesson | null;
  /** Số lượt còn lại sau khi trừ (để cập nhật ngay). */
  tokens?: number;
}

export interface WritingItem {
  id: number;
  level: number;
  type: 'ORDER' | 'FILL' | 'CHOOSE' | 'WRONG';
  vi: string;
  tiles?: string[];
  parts?: string[];
  options?: string[];
}

export interface WritingBatch {
  items: WritingItem[];
  lockedCount: number;
  level: number;
}

export interface WritingCheck {
  correct: boolean;
  answer: string;
  sentence: string;
  vi: string;
}

export interface GrammarListItem {
  slug: string;
  level: number;
  category: string;
  title: string;
  pattern: string;
  /** Biểu tượng tình huống (emoji) của điểm ngữ pháp. */
  icon: string | null;
  locked: boolean;
  fit: 'review' | 'match' | 'next' | 'far';
  recommended: boolean;
  mastered: boolean;
  practice: { total: number; done: number; correct: number };
}

export interface GrammarList {
  level: number;
  levels: { level: number; total: number; mastered: number; locked: boolean }[];
  readyForExam: boolean;
  points: GrammarListItem[];
}

export interface GrammarDetail {
  slug: string;
  level: number;
  category: string;
  title: string;
  pattern: string;
  explain: string;
  compare: string;
  mistake: string;
  examples: { zh: string; pinyin: string; vi: string }[];
  /** Sơ đồ khối của công thức và biểu tượng cho từng ví dụ (null khi chưa soạn). */
  visual: { rows: string[]; icons: string[] } | null;
  practice: WritingItem[];
}

// ───────────── Hộp thư ─────────────
export type MailSender = 'ADMIN' | 'SYSTEM';

export interface MailItem {
  id: number;
  sender: MailSender;
  subject: string;
  preview?: string;
  body?: string;
  createdAt: string;
  expiresAt: string | null;
  hasReward: boolean;
  reward: { tokens: number; item: 'VIP_3D' | null } | null;
  read: boolean;
  claimed: boolean;
  expired: boolean;
  claimable: boolean;
}

export interface MailCounts {
  unread: number;
  unclaimed: number;
}

export interface MailList {
  page: number;
  pageSize: number;
  total: number;
  items: MailItem[];
  counts: MailCounts;
}
