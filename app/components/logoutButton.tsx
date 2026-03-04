'use client'

import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const queryClient = useQueryClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    queryClient.clear()
    router.push('/login')
    router.refresh()
  }

  return <button onClick={handleLogout}>Logout</button>
}