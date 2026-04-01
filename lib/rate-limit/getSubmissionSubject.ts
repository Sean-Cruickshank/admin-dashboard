import { headers } from 'next/headers'

export type SubmissionSubject = {
  subjectType: 'user' | 'ip'
  subjectKey: string
}

export async function getSubmissionSubject(userId: string | null): Promise<SubmissionSubject> {
  if (userId) {
    return {
      subjectType: 'user',
      subjectKey: userId,
    }
  }

  const headerStore = await headers()

  const forwardedFor = headerStore.get('x-forwarded-for')
  const realIp = headerStore.get('x-real-ip')

  const ip =
    forwardedFor?.split(',')[0]?.trim() || realIp?.trim() || 'unknown'

  return {
    subjectType: 'ip',
    subjectKey: ip,
  }
}