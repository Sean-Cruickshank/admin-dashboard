import { requireRole } from '@/lib/auth/requireRole'

export default async function DashboardLayout({children,}: {children: React.ReactNode}) {
  await requireRole(['admin', 'moderator', 'viewer'])

  return <>{children}</>
}