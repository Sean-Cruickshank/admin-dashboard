import Navbar from '@/app/components/Navbar';
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function SubmitLayout({children}: {children: React.ReactNode}) {
  const supabase = await createSupabaseServerClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) console.error(userError)

  let username = null
  let role = null
  
  if (user) {
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
    
      if (profileError) console.error(profileError)
      
      if (profile) {
        username = profile.username
        role = profile.role
      }
  }

  return (
    <>
      <Navbar username={username} role={role} />
      <main>{children}</main>
    </>
  )
}