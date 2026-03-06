import type { CapacitySummary } from "@/lib/domain/types";

interface CapacityMonitorProps {
  capacity: CapacitySummary | undefined;
  isLoading?: boolean;
}

function barColor(pct: number): { bar: string; text: string } {
  if (pct >= 90)
    return {
      bar: "bg-semantic-global-danger-default",
      text: "text-semantic-global-danger-default",
    };
  if (pct >= 70)
    return {
      bar: "bg-semantic-global-warning-default",
      text: "text-semantic-global-warning-default",
    };
  return {
    bar: "bg-semantic-global-primary-default",
    text: "text-semantic-global-primary-default",
  };
}

function CapacityStatCard({
  label,
  value,
  unit,
  percentage,
}: {
  label: string;
  value: string;
  unit: string;
  percentage: number;
}) {
  const colors = barColor(percentage);
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-semantic-global-text-light">
        {label}
      </p>
      <p className="text-xl font-bold text-semantic-global-text-default">
        {value}{" "}
        <span className="text-sm font-normal text-semantic-global-neutral-default">
          {unit}
        </span>
      </p>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-semantic-global-neutral-lighter">
        <div
          className={`h-full ${colors.bar} transition-all`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className={`mt-1 text-xs font-bold ${colors.text}`}>
        {percentage.toFixed(0)}%{percentage >= 90 ? " (Near Limit)" : " Used"}
      </p>
    </div>
  );
}

export default function CapacityMonitor({
  capacity,
  isLoading,
}: CapacityMonitorProps) {
  if (isLoading || !capacity) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-semantic-global-border-light bg-semantic-global-neutral-lightest"
          />
        ))}
      </div>
    );
  }

  const weightPct =
    capacity.maximumTrainGrossWeight > 0
      ? (capacity.currentTrainGrossWeight / capacity.maximumTrainGrossWeight) *
        100
      : 0;

  const capacityPct =
    capacity.totalCapacity > 0
      ? (capacity.usedCapacity / capacity.totalCapacity) * 100
      : 0;

  const payloadPct =
    capacity.maximumPayload > 0
      ? (capacity.actualPayload / capacity.maximumPayload) * 100
      : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <CapacityStatCard
        label="Train Weight"
        value={capacity.currentTrainGrossWeight.toLocaleString()}
        unit={`/ ${capacity.maximumTrainGrossWeight.toLocaleString()} kg`}
        percentage={weightPct}
      />
      <CapacityStatCard
        label="Slot Capacity"
        value={`${capacity.usedCapacity}`}
        unit={`/ ${capacity.totalCapacity} units`}
        percentage={capacityPct}
      />
      <CapacityStatCard
        label="Payload"
        value={capacity.actualPayload.toLocaleString()}
        unit={`/ ${capacity.maximumPayload.toLocaleString()} kg`}
        percentage={payloadPct}
      />
      <CapacityStatCard
        label="Remaining"
        value={`${capacity.remainingCapacity}`}
        unit="slots free"
        percentage={
          capacity.totalCapacity > 0
            ? (capacity.remainingCapacity / capacity.totalCapacity) * 100
            : 0
        }
      />
    </div>
  );
}
