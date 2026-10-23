# FE — HanVui (Next.js 16, App Router, PWA)

Giao diện web ưu tiên điện thoại. Bảng màu và CSS lấy nguyên từ bản demo 11 (`app/globals.css`), không dùng thư viện
giao diện ngoài. Nghiệp vụ và luật chơi nằm ở `../rule.md`.

## Chạy

```bash
pnpm install
cp .env.local.example .env.local   # rồi điền nếu cần
pnpm dev                           # http://localhost:3000
```

BE phải chạy sẵn (mặc định `http://localhost:3001/api/v1`, xem `../BE/README.md`).

| Biến môi trường | Ý nghĩa |
|---|---|
| `NEXT_PUBLIC_API_BASE` | Đường gọi API, mặc định `/api/v1` (cùng nguồn). |
| `BE_ORIGIN` | Next chuyển tiếp `/api/v1` sang đây, mặc định `http://localhost:3001`. |
| `NEXT_PUBLIC_AUDIO_BASE` | Tên miền CDN của Cloudflare R2 chứa file âm thanh. **Để trống** thì app đọc bằng giọng trình duyệt (`SpeechSynthesis`) theo giới tính và cao độ của vai. |

## Các màn

| Đường dẫn | Màn |
|---|---|
| `/dang-nhap` | Đăng nhập, đăng ký |
| `/` | Trang chủ: chào theo giờ, nhiệm vụ hôm nay, bốn kỹ năng, thẻ sự kiện, nhiệm vụ tuần |
| `/hoc` | Học → Từ vựng theo chủ đề |
| `/hoc/tu-vung/[topic]` | Bảng từ: che nghĩa, nghe; chạm một từ mở bảng **cách viết từng nét + tập viết** |
| `/hoc/nghe`, `/hoc/nghe/[id]` | Danh sách hội thoại (chọn HSK 1/2/3, tìm kiếm, lọc chủ đề) và bài học |
| `/hoc/noi`, `/hoc/doc`, `/hoc/viet` | Nói, Đọc, Viết (bản mẫu) |
| `/so-tay`, `/so-tay/kiem-tra`, `/so-tay/lat-the` | Sổ tay (theo ngày / chủ đề), kiểm tra 8 câu, lật thẻ |
| `/su-kien`, `/su-kien/xep-hang`, `/su-kien/luat` | Bảng 12 ô, gợi ý, hồi truyện, xếp hạng, luật chơi |
| `/them`, `/them/tui-do`, `/them/huong-dan` | Tài khoản, chuẩn/cấp HSK, giao diện sáng tối, túi đồ, hướng dẫn |

## Điểm cần biết khi sửa

- **Lời thoại khóa tới khi trả lời xong.** BE không trả chữ của câu thoại khi chưa mở, nên màn Nghe chỉ phát được
  âm thanh. Chưa có file âm thanh (chờ R2) thì bài sẽ im lặng: app nói rõ điều này và cho trả lời hoặc bỏ qua.
- **Không bao giờ gợi ý "bài này có từ khóa".** Nút "Nhập từ khóa" luôn ở trạng thái bình thường (rule.md 5.5).
- **Tìm kiếm bài chỉ nhìn tên bài, chủ đề, bối cảnh** — BE đã chặn tìm theo nội dung câu thoại.
- Chữ Hán dùng phông có sẵn của máy; chỉ phông giao diện (Be Vietnam Pro) tải từ Google Fonts.
- Dữ liệu nét chữ do `hanzi-writer` tải từ CDN jsdelivr theo từng chữ.
- Service worker (`public/sw.js`) **không** lưu kết quả API; chỉ giữ vỏ app, âm thanh và dữ liệu nét.
- Biểu tượng PWA hiện là `public/icon.svg`. Trước khi phát hành nên thay bằng PNG 192/512 cho iOS.

## Mở qua Cloudflare Tunnel (thử trên điện thoại)

Chạy BE và FE như bình thường, rồi ở cửa sổ khác:

```bash
cloudflared tunnel --url http://localhost:3000
```

cloudflared in ra một địa chỉ `https://<ngẫu-nhiên>.trycloudflare.com` — mở trên điện thoại là dùng được. Chỉ cần một tunnel vì
FE tự chuyển tiếp `/api/v1` sang BE. Địa chỉ đổi mỗi lần chạy; muốn địa chỉ cố định thì cần tên miền trên Cloudflare và một
named tunnel. Ai có địa chỉ đều mở được app: tắt tunnel (Ctrl+C) khi thử xong.
