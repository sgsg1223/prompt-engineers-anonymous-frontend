import {
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Package,
  Weight,
  User,
} from "lucide-react";
import type {
  RailBooking,
  BookingStatus,
  InspectionStatus,
} from "@/lib/domain/types";

interface BookingCardProps {
  booking: RailBooking;
}

const STATUS_STYLES: Record<
  BookingStatus,
  { bg: string; text: string; label: string }
> = {
  Booked: {
    bg: "bg-semantic-global-info-lightest",
    text: "text-semantic-global-info-dark",
    label: "Booked",
  },
  Planned: {
    bg: "bg-semantic-global-primary-lightest",
    text: "text-semantic-global-primary-default",
    label: "Planned",
  },
  Loaded: {
    bg: "bg-semantic-global-success-lightest",
    text: "text-semantic-global-success-dark",
    label: "Loaded",
  },
  Cancelled: {
    bg: "bg-semantic-global-neutral-lightest",
    text: "text-semantic-global-neutral-dark line-through",
    label: "Cancelled",
  },
};

const INSPECTION_BADGE: Record<
  InspectionStatus,
  { bg: string; text: string; label: string }
> = {
  "Not Inspected": {
    bg: "bg-semantic-global-neutral-lightest",
    text: "text-semantic-global-neutral-dark",
    label: "Not Inspected",
  },
  "Inspection Passed": {
    bg: "bg-semantic-global-success-lightest",
    text: "text-semantic-global-success-dark",
    label: "Passed",
  },
  "Inspection Failed": {
    bg: "bg-semantic-global-danger-lightest",
    text: "text-semantic-global-danger-dark",
    label: "Failed",
  },
};

export default function BookingCard({ booking }: BookingCardProps) {
  const status = STATUS_STYLES[booking.bookingStatus];
  const inspection = INSPECTION_BADGE[booking.inspectionStatus];
  const isCancelled = booking.bookingStatus === "Cancelled";
  const isHazardous = booking.hazardous.length > 0;

  return (
    <article
      className={`group relative flex flex-col gap-3 rounded-xl bg-semantic-global-background-white p-4 shadow-sm transition-transform active:scale-[0.98] ${
        isHazardous
          ? "border border-semantic-global-border-light border-l-4 border-l-semantic-global-warning-default"
          : "border border-semantic-global-border-light"
      } ${isCancelled ? "opacity-75" : ""}`}
    >
      {/* Top row: Unit info + Status */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-semantic-global-neutral-default">
              {booking.railBookingId}
            </p>
            {isHazardous && (
              <AlertTriangle className="h-3 w-3 text-semantic-global-warning-default" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-semantic-global-neutral-default" />
            <span className="text-base font-bold text-semantic-global-text-default">
              {booking.unitNumber}
            </span>
            <span className="rounded bg-semantic-global-neutral-lightest px-1.5 py-0.5 text-[10px] font-medium text-semantic-global-text-light">
              {booking.unitType}
            </span>
          </div>
          {booking.iluCode && (
            <p className="text-xs text-semantic-global-text-light">
              ILU: {booking.iluCode}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${inspection.bg} ${inspection.text}`}
          >
            {inspection.label}
          </span>
        </div>
      </div>

      {/* Bottom row: Customer + Weight + Customs */}
      <div className="flex items-center justify-between text-sm text-semantic-global-text-light">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{booking.customer.name}</span>
        </div>

        <div className="flex items-center gap-1">
          <Weight className="h-4 w-4" />
          <span>{booking.grossWeight.toLocaleString()} kg</span>
        </div>

        {booking.isCustomsCleared ? (
          <ShieldCheck className="h-4 w-4 text-semantic-global-success-default" />
        ) : (
          <ShieldX className="h-4 w-4 text-semantic-global-warning-default" />
        )}

        {isHazardous && (
          <span className="text-[10px] font-bold uppercase text-semantic-global-warning-dark">
            UN {booking.hazardous[0].unNumber} · Class{" "}
            {booking.hazardous[0].class}
          </span>
        )}

        {booking.cancellationReason && (
          <span className="text-[10px] font-bold text-semantic-global-danger-default">
            {booking.cancellationReason}
          </span>
        )}
      </div>
    </article>
  );
}
