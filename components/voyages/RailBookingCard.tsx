import {
  Gavel,
  Hourglass,
  ShieldAlert,
  GripVertical,
  Package,
} from "lucide-react";
import type { RailBooking, InspectionStatus } from "@/lib/domain/types";

interface RailBookingCardProps {
  booking: RailBooking;
}

const CUSTOMS_CONFIG = {
  cleared: {
    bg: "bg-semantic-global-success-lightest",
    text: "text-semantic-global-success-dark",
    label: "Customs Cleared",
    Icon: Gavel,
    border: "border-l-semantic-global-primary-default",
  },
  pending: {
    bg: "bg-semantic-global-warning-lightest",
    text: "text-semantic-global-warning-dark",
    label: "Customs Pending",
    Icon: Hourglass,
    border: "border-l-semantic-global-neutral-light",
  },
} as const;

const INSPECTION_LABELS: Record<InspectionStatus, string> = {
  "Not Inspected": "Not Inspected",
  "Inspection Passed": "Passed",
  "Inspection Failed": "Failed",
};

export default function RailBookingCard({ booking }: RailBookingCardProps) {
  const customs = booking.isCustomsCleared
    ? CUSTOMS_CONFIG.cleared
    : CUSTOMS_CONFIG.pending;
  const isPending = !booking.isCustomsCleared;

  const totalGrossWeight = booking.grossWeight;

  return (
    <div
      className={`rounded-xl border border-semantic-global-border-light border-l-4 bg-semantic-global-background-white p-4 shadow-sm ${customs.border} ${
        isPending ? "opacity-90" : ""
      }`}
    >
      {/* Top row: booking ID + customer + customs status */}
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p
            className={`text-xs font-bold ${
              booking.isCustomsCleared
                ? "text-semantic-global-primary-default"
                : "text-semantic-global-text-light"
            }`}
          >
            {booking.railBookingId}
          </p>
          <h5 className="font-bold text-semantic-global-text-default">
            {booking.customer.name}
          </h5>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${customs.bg} ${customs.text}`}
          >
            <customs.Icon className="h-3 w-3" />
            {customs.label}
          </span>
          <span
            className={`text-[10px] font-bold ${
              booking.inspectionStatus === "Inspection Passed"
                ? "text-semantic-global-success-dark"
                : booking.inspectionStatus === "Inspection Failed"
                  ? "text-semantic-global-danger-dark"
                  : "text-semantic-global-neutral-default"
            }`}
          >
            {INSPECTION_LABELS[booking.inspectionStatus]}
          </span>
        </div>
      </div>

      {/* Bottom row: unit details */}
      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-semantic-global-border-lighter py-2">
        <div>
          <p className="text-[10px] uppercase text-semantic-global-text-light">
            Unit
          </p>
          <div className="flex items-center gap-1">
            <Package className="h-3 w-3 text-semantic-global-neutral-default" />
            <p className="text-xs font-semibold text-semantic-global-text-default">
              {booking.unitNumber}
            </p>
          </div>
          <p className="text-[10px] text-semantic-global-text-light">
            {booking.unitType}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-semantic-global-text-light">
            Weight
          </p>
          <p className="text-xs font-semibold text-semantic-global-text-default">
            {totalGrossWeight.toLocaleString()} kg
          </p>
        </div>
        <div className="flex items-center justify-end">
          <GripVertical className="h-5 w-5 text-semantic-global-neutral-default" />
        </div>
      </div>
    </div>
  );
}
