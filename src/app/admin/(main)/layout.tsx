import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth/jwt';
import AdminShell from './AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
