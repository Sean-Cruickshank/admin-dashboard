import { DEMO_ACCOUNTS, DEMO_LIFESPAN } from "../constants/demo"

export function getDemoExpirationFilter() {
  const demoAuditCutoff = new Date(Date.now() - DEMO_LIFESPAN).toISOString()
  const demoAccountIds = DEMO_ACCOUNTS.join(',')
  
  return [
    `performed_by.not.in.(${demoAccountIds})`,
    `and(performed_by.in.(${demoAccountIds}),performed_at.gt.${demoAuditCutoff})`
  ].join(',')
}

