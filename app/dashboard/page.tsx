import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth/requireRole'

export default async function DashboardEntry() {
  const { profile } = await requireRole(['admin', 'moderator', 'viewer'])

  switch (profile.role) {
    case 'admin':
      redirect('/dashboard/admin')
    case 'moderator':
      redirect('/dashboard/moderator')
    case 'viewer':
      redirect('/dashboard/viewer')
    default:
      redirect('/login')
  }
}