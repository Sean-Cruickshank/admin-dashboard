import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth/requireUser'
import type { Database } from '@/lib/database.types'

type Role = Database['public']['Tables']['profiles']['Row']['role']

export async function requireRole( allowedRoles: Role[] ) {
  const { supabase, user, profile } = await requireUser()
  
  if (!allowedRoles.includes(profile.role)) redirect('/dashboard')

  return { supabase, user, profile }
}