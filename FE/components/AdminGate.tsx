'use client';
// Vỏ các trang quản trị. Chỉ để ẩn giao diện: quyền thật do BE kiểm tra ở từng API.
import Shell from '@/components/Shell';
import { useAuth } from '@/lib/auth';

export default function AdminGate({ title, children }: { title: string; children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <Shell title={title}>
      {user?.role === 'ADMIN' ? (
        children
      ) : (
        <div className="card empty center">
          <b>Bạn không có quyền vào trang này</b>
          <p className="muted">Trang này chỉ dành cho quản trị viên. Nếu vừa được cấp quyền, hãy đăng xuất rồi đăng nhập lại.</p>
        </div>
      )}
    </Shell>
  );
}
