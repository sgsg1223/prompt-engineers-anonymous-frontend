import { CheckCircle, Clock, XCircle } from "lucide-react";
import type { InspectionResult, InspectionStatus } from "@/lib/domain/types";

interface InspectionCardProps {
  inspections: InspectionResult[];
  onPass: (railBookingId: string) => void;
  onFail: (railBookingId: string, reason: string) => void;
}

export default function InspectionCard({
  inspections,
  onPass,
  onFail,
}: InspectionCardProps) {
  const statusIcon = (status: InspectionStatus) => {
    switch (status) {
      case "Inspection Passed":
        return (
          <CheckCircle className="h-5 w-5 text-semantic-global-success-default" />
        );
      case "Inspection Failed":
        return (
          <XCircle className="h-5 w-5 text-semantic-global-danger-default" />
        );
      default:
        return (
          <Clock className="h-5 w-5 text-semantic-global-neutral-default" />
        );
    }
  };

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-semantic-global-text-default">
          Unit Inspection
        </h3>
        <span className="rounded bg-semantic-global-primary-lightest px-2 py-1 text-xs font-medium text-semantic-global-primary-default">
          {inspections.length} unit{inspections.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white">
        <div className="divide-y divide-semantic-global-border-lighter">
          {inspections.map((item) => (
            <div
              key={item.railBookingId}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                {statusIcon(item.inspectionStatus)}
                <div>
                  <span className="text-sm font-medium text-semantic-global-text-default">
                    {item.unitNumber}
                  </span>
                  <p className="text-[10px] text-semantic-global-text-light">
                    {item.railBookingId}
                  </p>
                  {item.failureReason && (
                    <p className="text-[10px] text-semantic-global-danger-default">
                      {item.failureReason}
                    </p>
                  )}
                </div>
              </div>

              {item.inspectionStatus === "Not Inspected" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onPass(item.railBookingId)}
                    className="rounded-full bg-semantic-global-success-default px-4 py-1 text-xs font-medium text-semantic-global-text-lightest"
                  >
                    Pass
                  </button>
                  <button
                    onClick={() =>
                      onFail(item.railBookingId, "Failed inspection")
                    }
                    className="rounded-full border border-semantic-global-danger-default px-4 py-1 text-xs font-medium text-semantic-global-danger-default"
                  >
                    Fail
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => onPass(item.railBookingId)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      item.inspectionStatus === "Inspection Passed"
                        ? "border-semantic-global-success-default bg-semantic-global-success-default text-semantic-global-text-lightest"
                        : "border-semantic-global-border-light text-semantic-global-text-light"
                    }`}
                  >
                    Pass
                  </button>
                  <button
                    onClick={() =>
                      onFail(item.railBookingId, "Failed inspection")
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      item.inspectionStatus === "Inspection Failed"
                        ? "border-semantic-global-danger-default bg-semantic-global-danger-lightest text-semantic-global-danger-default"
                        : "border-semantic-global-border-light text-semantic-global-text-light"
                    }`}
                  >
                    Fail
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
