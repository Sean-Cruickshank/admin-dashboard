'use client'

import LogoutButton from '@/app/components/logoutButton'
import Link from 'next/link'

type Profile = {
    created_at: string;
    id: string;
    role: string;
    username: string;
}

type NavbarProps = {
  profile: Profile
}

export default function Navbar({ profile } : NavbarProps) {
  
  return (
    <nav>
      <Link href={'/submit'}>Submit Content</Link>
      <Link href={'/dashboard/viewer'}>My Content</Link>
      <Link href={'/dashboard'}>Dashboard</Link>
      {profile.role === 'admin' && <Link href={'/dashboard/admin/audit'}>Audits</Link>}
      <p>Hello, {profile.username}!</p>
      <LogoutButton />
    </nav>
  )
}