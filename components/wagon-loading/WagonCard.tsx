import { Train, ArrowLeftRight, PlusSquare, Package } from "lucide-react";
import type { Wagon } from "@/lib/domain/types";

interface WagonCardProps {
  wagon: Wagon;
  onUnload?: (railBookingId: string) => void;
}

export default function WagonCard({ wagon, onUnload }: WagonCardProps) {
  const loadedCount = wagon.loadedUnits.length;
  const equipmentCount = wagon.loadedEquipment.length;
  const payloadPct =
    wagon.maximumWagonPayload > 0
      ? Math.round((wagon.actualWagonPayload / wagon.maximumWagonPayload) * 100)
      : 0;

  return (
    <div className="mb-4 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Train className="h-5 w-5 text-semantic-global-primary-default" />
          <span className="font-bold text-semantic-global-text-default">
            Wagon #{wagon.wagonNumber}
          </span>
          <span className="rounded bg-semantic-global-neutral-lightest px-1.5 py-0.5 text-[10px] text-semantic-global-text-light">
            {wagon.wagonType} · Pos {wagon.positionOnTrain}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-semantic-global-text-light">
            {loadedCount} unit{loadedCount !== 1 ? "s" : ""}
            {equipmentCount > 0 ? ` + ${equipmentCount} equip` : ""}
          </span>
          <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-semantic-global-neutral-lighter">
            <div
              className={`h-full transition-all ${
                payloadPct >= 90
                  ? "bg-semantic-global-danger-default"
                  : payloadPct >= 70
                    ? "bg-semantic-global-warning-default"
                    : "bg-semantic-global-primary-default"
              }`}
              style={{ width: `${Math.min(payloadPct, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-semantic-global-text-light">
            {wagon.actualWagonPayload.toLocaleString()}/
            {wagon.maximumWagonPayload.toLocaleString()} kg
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Loaded units */}
        {wagon.loadedUnits.map((unit) => (
          <div
            key={unit.railBookingId}
            className="flex items-center justify-between rounded-lg border-l-4 border-l-semantic-global-success-default bg-semantic-global-success-lightest/50 p-3"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-semantic-global-text-light">
                Loaded
              </p>
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3 text-semantic-global-neutral-default" />
                <p className="text-sm font-semibold text-semantic-global-text-default">
                  {unit.railBookingId}
                </p>
              </div>
              <p className="text-[10px] text-semantic-global-text-light">
                {new Date(unit.loadingDateTime).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => onUnload?.(unit.railBookingId)}
              className="text-semantic-global-neutral-default"
              aria-label={`Unload ${unit.railBookingId}`}
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>
        ))}

        {/* Loaded equipment */}
        {wagon.loadedEquipment.map((eq) => (
          <div
            key={eq.id}
            className="flex items-center justify-between rounded-lg border-l-4 border-l-semantic-global-info-default bg-semantic-global-info-lightest/50 p-3"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-semantic-global-text-light">
                Equipment · {eq.type}
              </p>
              <p className="text-sm font-semibold text-semantic-global-text-default">
                {eq.id}
              </p>
              <p className="text-[10px] text-semantic-global-text-light">
                {eq.grossWeight.toLocaleString()} kg
              </p>
            </div>
          </div>
        ))}

        {/* Empty slot placeholder */}
        {loadedCount === 0 && equipmentCount === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-semantic-global-border-light p-6">
            <PlusSquare className="h-6 w-6 text-semantic-global-neutral-light" />
            <p className="text-xs font-medium text-semantic-global-neutral-default">
              Tap to Assign Unit to Wagon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
