'use client'

import LogoutButton from '@/app/components/LogoutButton'
import Link from 'next/link'
import { useState } from 'react'

type NavbarProps = {
  username: string | null,
  role: string | null
}

export default function Navbar({ username, role } : NavbarProps) {
  const [dropdownStatus, setDropdownStatus] = useState(false)
  const split = username?.split(' ')
  const initials = split?.map(letter => letter.substring(0, 1)).join('')
  return (
    <>
      <nav>
        <Link href={'/submit'}>Submit Content</Link>
        <Link href={'/dashboard/viewer'}>My Content</Link>
        <Link href={'/dashboard'}>Dashboard</Link>
        {role === 'admin' && <Link href={'/dashboard/admin/audit'}>Audits</Link>}

        <div className='user-badge' onClick={() => setDropdownStatus(prev => !prev)}>
          {initials}
        </div>
      </nav>
      
      <div className={dropdownStatus ? 'user-dropdown active' : 'user-dropdown'}>
        {role && <p>Hello, {username}!</p>}
        {role
          ? <LogoutButton />
          : <Link href={'/login'}>Login</Link>
        }
      </div>

      <div
        className={dropdownStatus ? 'user-dropdown__clickaway active' : 'user-dropdown__clickaway'}
        onClick={() => setDropdownStatus(prev => !prev)}>

      </div>
    </>
  )
}