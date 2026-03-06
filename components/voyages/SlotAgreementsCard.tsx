import { FileText } from "lucide-react";
import type { SlotAgreementUsage } from "@/lib/domain/types";

interface SlotAgreementsCardProps {
  agreements: SlotAgreementUsage[];
  isLoading?: boolean;
}

export default function SlotAgreementsCard({
  agreements,
  isLoading,
}: SlotAgreementsCardProps) {
  if (isLoading) {
    return (
      <div className="h-32 animate-pulse rounded-xl border border-semantic-global-border-light bg-semantic-global-neutral-lightest" />
    );
  }

  if (agreements.length === 0) {
    return (
      <div className="rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-semantic-global-text-light">
          <FileText className="h-4 w-4" />
          <span className="text-sm">No slot agreements for this voyage</span>
        </div>
      </div>
    );
  }

  const totalReserved = agreements.reduce((s, a) => s + a.reservedSlots, 0);
  const totalUsed = agreements.reduce((s, a) => s + a.usedSlots, 0);
  const totalRemaining = agreements.reduce((s, a) => s + a.remainingSlots, 0);

  return (
    <div className="rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-semantic-global-primary-default" />
        <h4 className="text-sm font-bold text-semantic-global-text-default">
          Slot Agreements
        </h4>
        <span className="ml-auto text-xs text-semantic-global-text-light">
          {agreements.length} agreement{agreements.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Totals summary */}
      <div className="mb-4 flex gap-4">
        <div className="flex-1 border-r border-semantic-global-border-lighter pr-2">
          <p className="text-[10px] font-bold uppercase text-semantic-global-text-light">
            Reserved
          </p>
          <p className="text-lg font-bold text-semantic-global-text-default">
            {totalReserved} slots
          </p>
        </div>
        <div className="flex-1 border-r border-semantic-global-border-lighter pr-2">
          <p className="text-[10px] font-bold uppercase text-semantic-global-text-light">
            Used
          </p>
          <p className="text-lg font-bold text-semantic-global-success-dark">
            {totalUsed} slots
          </p>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase text-semantic-global-text-light">
            Remaining
          </p>
          <p className="text-lg font-bold text-semantic-global-primary-default">
            {totalRemaining} slots
          </p>
        </div>
      </div>

      {/* Per-customer breakdown */}
      <div className="space-y-2">
        {agreements.map((a) => (
          <div
            key={a.slotAgreementId}
            className="flex items-center justify-between rounded-lg bg-semantic-global-neutral-lightest px-3 py-2"
          >
            <span className="text-sm font-medium text-semantic-global-text-default">
              {a.customerName}
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-semantic-global-text-light">
                {a.usedSlots}/{a.reservedSlots}
              </span>
              <span
                className={`font-bold ${
                  a.remainingSlots === 0
                    ? "text-semantic-global-danger-default"
                    : "text-semantic-global-primary-default"
                }`}
              >
                {a.remainingSlots} left
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
