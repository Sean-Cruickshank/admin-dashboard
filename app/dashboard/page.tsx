import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth/requireUser'

export default async function DashboardEntry() {
  const { profile } = await requireUser()

  switch (profile.role) {
    case 'admin':
      redirect('/dashboard/admin')
    case 'moderator':
      redirect('/dashboard/moderator')
    case 'viewer':
      redirect('/dashboard/home')
    default:
      redirect('/login')
  }
}