'use client';
// Sơ đồ khối màu của công thức ngữ pháp. Mỗi hàng là một dạng câu; mỗi khối "chữ@vai" (xem BE content/grammar-visual.ts).
// Màu theo vai trong câu, luôn kèm nhãn chữ bên dưới khối nên không chỉ dựa vào màu.

const ROLE: Record<string, { label: string; color: string }> = {
  s: { label: 'chủ ngữ', color: '#2f6fe0' },
  v: { label: 'động từ', color: '#1f9d6b' },
  a: { label: 'tính từ', color: '#d9822b' },
  o: { label: 'tân ngữ', color: '#8b5cf6' },
  t: { label: 'thời gian', color: '#0e9aa7' },
  p: { label: 'nơi chốn', color: '#0e9aa7' },
  n: { label: 'số lượng', color: '#c2410c' },
  q: { label: 'mệnh đề', color: '#64748b' },
  k: { label: 'từ khóa', color: '#e11d48' },
  x: { label: '', color: '#94a3b8' },
};

interface Block {
  text: string;
  role: string;
  note: string;
}

export function parseRow(row: string): Block[] {
  return row.split(' + ').map((b) => {
    const at = b.lastIndexOf('@');
    if (at < 0) return { text: b, role: 'x', note: '' };
    const rest = b.slice(at + 1);
    return { text: b.slice(0, at), role: rest[0] ?? 'x', note: rest.slice(1).trim() };
  });
}

export default function GrammarDiagram({ rows }: { rows: string[] }) {
  return (
    <div className="stack" style={{ gap: 10 }} aria-label="Sơ đồ công thức">
      {rows.map((row, i) => (
        <div key={i} className="row" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {parseRow(row).map((b, k) => {
            const r = ROLE[b.role] ?? ROLE.x;
            const key = b.role === 'k';
            const optional = /^\(.*\)$/.test(b.text);
            return (
              <span key={k} className="row" style={{ gap: 6, alignItems: 'flex-start' }}>
                {k > 0 ? (
                  <span className="muted" style={{ paddingTop: 8, fontWeight: 700 }} aria-hidden="true">
                    +
                  </span>
                ) : null}
                <span style={{ display: 'grid', justifyItems: 'center', gap: 2 }}>
                  <span
                    className={key ? 'han' : undefined}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 10,
                      border: `2px ${optional ? 'dashed' : 'solid'} ${r.color}`,
                      background: key ? r.color : `color-mix(in srgb, ${r.color} 14%, transparent)`,
                      color: key ? '#fff' : 'inherit',
                      fontWeight: key ? 800 : 600,
                      fontSize: key ? 18 : 14,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {b.text}
                  </span>
                  <small style={{ color: r.color, fontSize: 10, fontWeight: 700 }}>{b.note || r.label}</small>
                </span>
              </span>
            );
          })}
        </div>
      ))}
      <small className="muted" style={{ fontSize: 11 }}>
        Khối viền nét đứt có thể bỏ. Khối đỏ đậm là từ ngữ pháp chính.
      </small>
    </div>
  );
}
