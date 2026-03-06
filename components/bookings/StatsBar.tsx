import type { RailBooking } from "@/lib/domain/types";

interface StatsBarProps {
  bookings: RailBooking[];
}

export default function StatsBar({ bookings }: StatsBarProps) {
  const total = bookings.length;
  const booked = bookings.filter((b) => b.bookingStatus === "Booked").length;
  const planned = bookings.filter((b) => b.bookingStatus === "Planned").length;
  const loaded = bookings.filter((b) => b.bookingStatus === "Loaded").length;
  const cancelled = bookings.filter(
    (b) => b.bookingStatus === "Cancelled",
  ).length;
  const hazardous = bookings.filter((b) => b.hazardous.length > 0).length;
  const customsPending = bookings.filter((b) => !b.isCustomsCleared).length;

  const stats: {
    label: string;
    value: number;
    variant: "default" | "success" | "warning" | "error";
  }[] = [
    { label: "Total", value: total, variant: "default" },
    { label: "Booked", value: booked, variant: "default" },
    { label: "Planned", value: planned, variant: "success" },
    { label: "Loaded", value: loaded, variant: "success" },
    { label: "Cancelled", value: cancelled, variant: "error" },
    { label: "Hazardous", value: hazardous, variant: "warning" },
    { label: "Customs Pending", value: customsPending, variant: "warning" },
  ];

  const VARIANT_STYLES: Record<string, string> = {
    default: "text-semantic-global-text-default",
    success: "text-semantic-global-success-dark",
    warning: "text-semantic-global-warning-dark",
    error: "text-semantic-global-danger-dark",
  };

  return (
    <div className="flex gap-3 overflow-x-auto p-4" role="list">
      {stats.map((stat) => (
        <div
          key={stat.label}
          role="listitem"
          className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-semantic-global-text-light">
            {stat.label}
          </p>
          <p
            className={`text-2xl font-bold leading-tight ${VARIANT_STYLES[stat.variant]}`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
