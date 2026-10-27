# Nguồn dữ liệu tách chữ (hanzi.json)

`hanzi.json` được lọc từ `dictionary.txt` của dự án **Make Me a Hanzi** (https://github.com/skishore/makemeahanzi),
chỉ giữ các chữ có trong từ điển HanVui và bộ phận trực tiếp của chúng (pinyin, cấu trúc IDS, bộ thủ, loại cấu tạo,
bộ phận chỉ nghĩa / chỉ âm). Tạo lại bằng `pnpm tsx scripts/build-hanzi.ts <đường dẫn dictionary.txt>`.

Theo file COPYING của dự án gốc:

> dictionary.txt is derived from Unihan and CJKlib. You can redistribute and/or modify dictionary.txt under the terms of
> the GNU Lesser General Public License (LGPL). A copy of the license should accompany the file.

Vì vậy khi phân phối dữ liệu này cần kèm bản giấy phép LGPL (https://www.gnu.org/licenses/lgpl-3.0.txt) và giữ ghi chú
nguồn này. Phần nghĩa tiếng Việt (`components-vi.ts`) và câu chuyện nhớ chữ là nội dung HanVui tự soạn (chưa qua duyệt).

**Cần chủ dự án kiểm tra lại điều khoản LGPL với người có chuyên môn pháp lý trước khi phát hành thương mại.**
