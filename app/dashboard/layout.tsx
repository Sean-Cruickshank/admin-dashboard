import { requireUser } from '@/lib/auth/requireUser'
import Navbar from '@/app/components/Navbar';

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const { user, profile } = await requireUser()

  return (
    <>
      <Navbar username={profile.username} role={profile.role} email={user.email} />
      <main>{children}</main>
    </>
  )
}