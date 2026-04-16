import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export function handleRowClick(id: string, router: AppRouterInstance) {
  router.push(`/dashboard/content/${id}`)
}

export function handleRowKeyDown(e: React.KeyboardEvent<HTMLTableRowElement>, id: string, router: AppRouterInstance) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    router.push(`/dashboard/content/${id}`)
  }
}