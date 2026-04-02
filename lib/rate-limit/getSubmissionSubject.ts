import { createHash } from 'crypto'
import { headers } from 'next/headers'

export type SubmissionSubject = {
  subjectType: 'user' | 'ip'
  subjectKey: string
}

function normalizeIp(ip: string): string {
  if (ip.startsWith('::ffff:')) return ip.slice(7)

  return ip
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT

  if (!salt) throw new Error('IP_HASH_SALT is not configured')

  return createHash('sha256')
    .update(`${salt}:${ip}`)
    .digest('hex')
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

  const rawIp =
    forwardedFor?.split(',')[0]?.trim() || realIp?.trim() || 'unknown'

  const normalizedIp = normalizeIp(rawIp)
  const hashedIp = hashIp(normalizedIp)

  return {
    subjectType: 'ip',
    subjectKey: hashedIp,
  }
}