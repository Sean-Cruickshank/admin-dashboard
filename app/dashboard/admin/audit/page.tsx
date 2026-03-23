import AuditTable from "@/app/components/AuditTable";
import { requireRole } from "@/lib/auth/requireRole";

export default async function GlobalAuditPage() {
  await requireRole(['admin'])
  return (
    <div>
      <h1>Audit History</h1>
      <AuditTable />
    </div>
  )
}