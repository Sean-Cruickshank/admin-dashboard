import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import LoginForm from '@/app/components/LoginForm'

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!error && user) {
    redirect('/dashboard')
  }

  return <LoginForm />
}