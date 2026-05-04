import AuditTable from "@/app/components/AuditTable";
import { requireRole } from "@/lib/auth/requireRole";

export default async function GlobalAuditPage() {
  await requireRole(['admin'])
  return (
    <div className="global-audit-page">
      <AuditTable />
    </div>
  )
}