'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
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

    router.push('/dashboard')
    router.refresh()
  }

  type Role = 'admin' | 'moderator' | 'viewer'

  const DEMO_ACCOUNTS: Record<Role, { email: string; password: string }> = {
    admin: {
      email: 'admin@test.com',
      password: 'password123'
    },
    moderator: {
      email: 'moderator@test.com',
      password: 'password123'
    },
    viewer: {
      email: 'readonly@test.com',
      password: 'password123'
    }
  }

  function populateDemoCredentials(role: Role) {
    setEmail(DEMO_ACCOUNTS[role].email)
    setPassword(DEMO_ACCOUNTS[role].password)
  }

  return (
    <div>
      <h1>Login</h1>

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

      <h1>Demo Accounts</h1>
      <button onClick={() => populateDemoCredentials('admin')}>Use Demo Admin</button>
      <button onClick={() => populateDemoCredentials('moderator')}>Use Demo Moderator</button>
      <button onClick={() => populateDemoCredentials('viewer')}>Use Demo Viewer</button>
    </div>
  )
}