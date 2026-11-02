-- Tháng dương lịch của phần đếm nhiệm vụ (ngày đăng nhập, nhiệm vụ tuần), để đếm lại khi một truyện được giữ chạy qua nhiều tháng.
ALTER TABLE "UserEvent" ADD COLUMN "cycle" TEXT NOT NULL DEFAULT '';
UPDATE "UserEvent" SET "cycle" = "month";
