import { ListFilter, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import type { BookingStatus } from "@/lib/domain/types";

export type BookingFilter =
  | "all"
  | BookingStatus
  | "hazardous"
  | "customs-pending";

interface FilterBarProps {
  active: BookingFilter;
  onChange: (filter: BookingFilter) => void;
}

const FILTERS: {
  key: BookingFilter;
  label: string;
  icon?: "hazard" | "customs";
}[] = [
  { key: "all", label: "All" },
  { key: "Booked", label: "Booked" },
  { key: "Planned", label: "Planned" },
  { key: "Loaded", label: "Loaded" },
  { key: "Cancelled", label: "Cancelled" },
  { key: "hazardous", label: "Hazardous", icon: "hazard" },
  { key: "customs-pending", label: "Customs Pending", icon: "customs" },
];

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto px-4 py-2"
      role="tablist"
      aria-label="Booking filters"
    >
      {FILTERS.map((filter) => {
        const isActive = active === filter.key;
        return (
          <button
            key={filter.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.key)}
            className={`flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
              isActive
                ? "bg-semantic-global-primary-default text-semantic-global-text-lightest"
                : "border border-semantic-global-border-light bg-semantic-global-background-white text-semantic-global-text-default hover:bg-semantic-global-neutral-lightest"
            }`}
          >
            {filter.key === "all" && <ListFilter className="h-4 w-4" />}
            {filter.icon === "hazard" && (
              <AlertTriangle
                className={`h-4 w-4 ${isActive ? "text-semantic-global-text-lightest" : "text-semantic-global-warning-default"}`}
              />
            )}
            {filter.icon === "customs" && (
              <ShieldCheck
                className={`h-4 w-4 ${isActive ? "text-semantic-global-text-lightest" : "text-semantic-global-info-dark"}`}
              />
            )}
            {filter.key === "Booked" && !isActive && (
              <Clock className="h-3.5 w-3.5" />
            )}
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
