import { requireUser } from '@/lib/auth/requireUser'
import Navbar from '@/app/components/Navbar';

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const { profile } = await requireUser()

  return (
    <>
      <Navbar username={profile.username} role={profile.role} />
      <main>{children}</main>
    </>
  )
}