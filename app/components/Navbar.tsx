'use client'

import LogoutButton from '@/app/components/LogoutButton'
import { Database } from '@/lib/database.types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaFilePen, FaFileLines } from "react-icons/fa6";

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
  const pathname = usePathname()
  
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
              <p><b>{email}</b></p>
              <p><i>{role}</i></p>
              
            </div>
          </div>
          <div className='user-dropdown__content'>
            <Link href={'/submit'}><FaFilePen /> Submit Content</Link>
            <Link href={'/dashboard/home'}><FaFileLines /> My Content</Link>
            <LogoutButton />
          </div>
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
        <Link
          className={pathname === '/dashboard/home' ? 'active' : ''}
          href={'/dashboard/home'}>
            Home
        </Link>

        <Link
          className={pathname === '/submit' ? 'active' : ''}
          href={'/submit'}>
            Submit Content
        </Link>

        {(role === 'admin' || role === 'moderator') &&
          <Link
            className={(pathname === '/dashboard/admin' || pathname === '/dashboard/moderator') ? 'active' : ''}
            href={'/dashboard'}>
              Dashboard
          </Link>
        }

        {role === 'admin' &&
          <Link
            className={pathname === '/dashboard/admin/audit' ? 'active' : ''}
            href={'/dashboard/admin/audit'}>
              Audits
          </Link>
        }

        { role
          ? <UserBadge clickable={true} />
          : <Link href={'/login'}>Login</Link>
        }
      </nav>
      
      <UserDropdown />
    </>
  )
}