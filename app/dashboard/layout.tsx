import { requireUser } from '@/lib/auth/requireUser'
import Navbar from '@/app/components/Navbar';

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const { profile } = await requireUser()

  return (
    <>
      <Navbar profile={profile} />
      <main>{children}</main>
    </>
  )
}