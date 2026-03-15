import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '@/app/components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'

type ModeratorDashboardProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function ModeratorDashboard({ searchParams } : ModeratorDashboardProps) {
  const { user } = await requireRole(['admin', 'moderator'])

  const params = await searchParams
  const page = Math.max(1, Number(params.page)) || 1

  return (
    <div>
      <h1>Moderator Dashboard</h1>
      <ContentTable userId={user.id} mode={'all'} page={page} />
      <LogoutButton />
    </div>
  )
}