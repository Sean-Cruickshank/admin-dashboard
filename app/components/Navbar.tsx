'use client'

import LogoutButton from '@/app/components/LogoutButton'
import Link from 'next/link'

type NavbarProps = {
  username: string | null,
  role: string | null
}

export default function Navbar({ username, role } : NavbarProps) {
  
  return (
    <nav>
      <Link href={'/submit'}>Submit Content</Link>
      <Link href={'/dashboard/viewer'}>My Content</Link>
      <Link href={'/dashboard'}>Dashboard</Link>
      {role === 'admin' && <Link href={'/dashboard/admin/audit'}>Audits</Link>}
      {role && <p>Hello, {username}!</p>}
      {role
        ? <LogoutButton />
        : <Link href={'/login'}>Login</Link>
      }
    </nav>
  )
}