'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Role = 'admin' | 'moderator' | 'viewer'

const DEMO_ACCOUNTS: Record<Role, { email: string; password: string }> = {
  admin: {
    email: 'admin@test.com',
    password: 'password123',
  },
  moderator: {
    email: 'moderator@test.com',
    password: 'password123',
  },
  viewer: {
    email: 'readonly@test.com',
    password: 'password123',
  },
}

export default function LoginForm() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.replace('/dashboard')
    router.refresh()
  }

  function populateDemoCredentials(role: Role) {
    setEmail(DEMO_ACCOUNTS[role].email)
    setPassword(DEMO_ACCOUNTS[role].password)
  }

  return (
    <div className='login'>
      <div className='login__banner'></div>

      <div className='login__form'>
        <h1>Welcome</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && <p>{error}</p>}
        </form>

        <div className='login__demo'>
          <h2>Demo Accounts</h2>
          <button type="button" onClick={() => populateDemoCredentials('admin')}>Use Demo Admin</button>
          <button type="button" onClick={() => populateDemoCredentials('moderator')}>Use Demo Moderator</button>
          <button type="button" onClick={() => populateDemoCredentials('viewer')}>Use Demo Viewer</button>
        </div>

        <div className='login__submit'>
          <Link href='/submit'>Submit Content Anonymously</Link>
        </div>
      </div>
    </div>
  )
}