import { Package, AlertTriangle } from "lucide-react";
import type { RailBooking, PlanningList } from "@/lib/domain/types";

interface PendingUnitCardProps {
  booking: RailBooking;
  list: PlanningList;
  onAssign?: (railBookingId: string) => void;
}

export default function PendingUnitCard({
  booking,
  list,
  onAssign,
}: PendingUnitCardProps) {
  const isSpare = list === "Spare";
  const isHazardous = booking.hazardous.length > 0;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border bg-semantic-global-background-white p-4 ${
        isSpare
          ? "border-semantic-global-border-light border-l-4 border-l-semantic-global-warning-default"
          : "border-semantic-global-border-light"
      }`}
    >
      {/* Icon */}
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded bg-semantic-global-neutral-lightest">
        <Package className="h-5 w-5 text-semantic-global-neutral-default" />
        {isHazardous && (
          <div className="absolute -right-1 -top-1">
            <AlertTriangle className="h-3.5 w-3.5 text-semantic-global-warning-default" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-semantic-global-text-default">
            {booking.unitNumber}
          </p>
          <span className="rounded bg-semantic-global-neutral-lightest px-1 text-[10px] font-medium text-semantic-global-text-light">
            {booking.unitType}
          </span>
          {isSpare && (
            <span className="rounded bg-semantic-global-warning-lightest px-1 text-[10px] font-medium text-semantic-global-warning-dark">
              SPARE
            </span>
          )}
        </div>
        <p className="text-xs text-semantic-global-text-light">
          {booking.railBookingId} • {booking.customer.name} •{" "}
          {booking.grossWeight.toLocaleString()} kg
        </p>
      </div>

      {/* Action */}
      <button
        onClick={() => onAssign?.(booking.railBookingId)}
        className="text-xs font-bold uppercase text-semantic-global-primary-default"
      >
        Assign
      </button>
    </div>
  );
}
