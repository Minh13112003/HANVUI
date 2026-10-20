// Màu nhận diện của một ô từ khóa, dùng khi ô đã mở từ 2 gợi ý trở lên (gợi ý 2 chỉ tới một bài hội thoại):
// bảng gợi ý, thẻ "Manh mối" và thẻ bài trong danh sách cùng mang màu này để người học biết gợi ý nào thuộc bài nào.
// Màu theo vị trí ô trong chương (0-11, mỗi người một thứ tự riêng nhưng ổn định); luôn kèm số "Ô n", không chỉ dựa vào màu.
// Mọi màu đều đạt tương phản 4,5:1 với chữ trắng.
export const CLUE_COLORS = [
  '#2F5BD8',
  '#C8402B',
  '#0E7A6A',
  '#B45309',
  '#6D3FD0',
  '#B83267',
  '#8A6200',
  '#0369A1',
  '#4D7C0F',
  '#A21CAF',
  '#475569',
  '#7C2D12',
];

export const clueColor = (pos: number) => CLUE_COLORS[((pos % CLUE_COLORS.length) + CLUE_COLORS.length) % CLUE_COLORS.length];

/** Ô có được tô màu không: chỉ khi đã mở từ 2 gợi ý trở lên. */
export const hasClueColor = (hintsOpened?: number) => (hintsOpened ?? 0) >= 2;
