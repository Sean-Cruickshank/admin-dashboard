'use client'

import LogoutButton from '@/app/components/LogoutButton'
import { Database } from '@/lib/database.types'
import Link from 'next/link'
import { useState } from 'react'

type NavbarProps = {
  username: string | null
  role: string | null
  email: string | undefined
}

type UserBadgeProps = {
  clickable: boolean
}

export type AuditSchema = Database['public']['Tables']['content_audit_logs']['Row']

export default function Navbar({ username, role, email } : NavbarProps) {
  const [dropdownStatus, setDropdownStatus] = useState(false)
  const split = username?.split(' ')
  const initials = split?.map(letter => letter.substring(0, 1)).join('')

  function UserBadge({ clickable } : UserBadgeProps) {
    return (
      <div
        className={clickable ? 'user-badge--clickable' : 'user-badge'}
        onClick={() => clickable && setDropdownStatus(prev => !prev)}>
        <b>{initials}</b>
      </div>
    )
  }

  function UserDropdown() {
    return (
      <>
        <div className={dropdownStatus ? 'user-dropdown active' : 'user-dropdown'}>
          <div className='user-dropdown__details'>
            <UserBadge clickable={false} />
            <div>
              <p><b>{username}</b></p>
              <p><i>{role}</i></p>
            </div>
          </div>
          {email && <p>{email}</p>}
          <Link href={'/submit'}>Submit Content</Link>
          <Link href={'/dashboard/viewer'}>My Content</Link>
          <LogoutButton />
        </div>

        <div
          className={dropdownStatus ? 'user-dropdown__clickaway active' : 'user-dropdown__clickaway'}
          onClick={() => setDropdownStatus(prev => !prev)}>
        </div>
      </>
    )
  }

  return (
    <>
      <nav>
        <Link href={'/submit'}>Submit Content</Link>
        <Link href={'/dashboard/viewer'}>My Content</Link>
        <Link href={'/dashboard'}>Dashboard</Link>
        {role === 'admin' && <Link href={'/dashboard/admin/audit'}>Audits</Link>}

        { role
          ? <UserBadge clickable={true} />
          : <Link href={'/login'}>Login</Link>
        }
      </nav>
      
      <UserDropdown />
    </>
  )
}