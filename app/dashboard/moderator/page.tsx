import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '@/app/components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'

type ModeratorDashboardProps = {
  searchParams: Promise<{ allPage?: string }>
}

export default async function ModeratorDashboard({ searchParams } : ModeratorDashboardProps) {
  const { user } = await requireRole(['admin', 'moderator'])

  const params = await searchParams
  const allPage = Math.max(1, Number(params.allPage)) || 1

  return (
    <div>
      <h1>Moderator Dashboard</h1>
      <ContentTable userId={user.id} mode={'all'} page={allPage} />
      <LogoutButton />
    </div>
  )
}