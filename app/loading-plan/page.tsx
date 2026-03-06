"use client";

import { useState } from "react";
import { ArrowLeft, Search, ShieldCheck, ShieldX } from "lucide-react";
import Link from "next/link";
import WagonTabBar from "@/components/wagon-loading/WagonTabBar";
import type { LoadingTab } from "@/components/wagon-loading/WagonTabBar";
import InspectionCard from "@/components/wagon-loading/InspectionCard";
import WagonCard from "@/components/wagon-loading/WagonCard";
import PendingUnitCard from "@/components/wagon-loading/PendingUnitCard";
import CloseVoyageButton from "@/components/wagon-loading/CloseVoyageButton";
import {
  useLoadingPermission,
  useGrantPermission,
  useInspections,
  useRecordInspectionPassed,
  useRecordInspectionFailed,
  useUnloadUnit,
  useCloseVoyage,
  useLoadUnit,
} from "@/lib/hooks/use-loading";
import {
  useRailVoyages,
  useRailVoyage,
  useMainList,
  useSpareList,
} from "@/lib/hooks/use-voyages";
import { useRailBookings } from "@/lib/hooks/use-bookings";
import type { RailBooking, PlannedBooking } from "@/lib/domain/types";

export default function WagonLoadingPage() {
  const [activeTab, setActiveTab] = useState<LoadingTab>("wagon-load");

  // Pick the first voyage for now (in real app, route param or selection)
  const { data: voyages = [] } = useRailVoyages();
  const selectedVoyageId = voyages[0]?.railVoyageId ?? "";

  const { data: voyage } = useRailVoyage(selectedVoyageId);
  const { data: permission } = useLoadingPermission(selectedVoyageId);
  const grantPermission = useGrantPermission();
  const { data: inspections = [] } = useInspections(selectedVoyageId);
  const passMutation = useRecordInspectionPassed();
  const failMutation = useRecordInspectionFailed();
  const unloadMutation = useUnloadUnit();
  const loadMutation = useLoadUnit();
  const closeMutation = useCloseVoyage();

  const { data: mainList = [] } = useMainList(selectedVoyageId);
  const { data: spareList = [] } = useSpareList(selectedVoyageId);
  const { data: allBookings = [] } = useRailBookings();

  const bookingMap = new Map<string, RailBooking>();
  for (const b of allBookings) {
    bookingMap.set(b.railBookingId, b);
  }

  // Bookings that are cleared + passed but not yet loaded (pending for loading)
  const loadedIds = new Set(
    (voyage?.wagonComposition ?? []).flatMap((w) =>
      w.loadedUnits.map((u) => u.railBookingId),
    ),
  );

  const pendingBookings = (list: PlannedBooking[]) =>
    list
      .map((pb) => bookingMap.get(pb.railBookingId))
      .filter(
        (b): b is RailBooking =>
          b !== undefined &&
          b.isCustomsCleared &&
          b.inspectionStatus === "Inspection Passed" &&
          !loadedIds.has(b.railBookingId),
      );

  const mainPending = pendingBookings(mainList);
  const sparePending = pendingBookings(spareList);

  const wagons = voyage?.wagonComposition ?? [];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-semantic-global-background-light-grey text-semantic-global-text-default">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-semantic-global-border-light bg-semantic-global-background-white">
        <div className="flex items-center justify-between p-4 pb-2">
          <Link
            href="/voyages"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-semantic-global-text-default"
            aria-label="Back to voyages"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-tight">
            Wagon Loading
          </h1>
          <div className="flex w-10 items-center justify-end">
            <button
              className="flex h-10 w-10 items-center justify-center text-semantic-global-text-default"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
        <WagonTabBar active={activeTab} onChange={setActiveTab} />
      </header>

      {/* Loading Permission Banner */}
      {permission && !permission.granted && (
        <div className="m-4 flex items-center justify-between rounded-xl border border-semantic-global-warning-default bg-semantic-global-warning-lightest p-4">
          <div className="flex items-center gap-2">
            <ShieldX className="h-5 w-5 text-semantic-global-warning-dark" />
            <span className="text-sm font-medium text-semantic-global-warning-dark">
              Loading not yet permitted
            </span>
          </div>
          <button
            onClick={() => grantPermission.mutate(selectedVoyageId)}
            disabled={grantPermission.isPending}
            className="rounded-lg bg-semantic-global-primary-default px-3 py-1.5 text-xs font-bold text-semantic-global-text-lightest"
          >
            Grant Permission
          </button>
        </div>
      )}
      {permission?.granted && (
        <div className="m-4 flex items-center gap-2 rounded-xl border border-semantic-global-success-default bg-semantic-global-success-lightest p-4">
          <ShieldCheck className="h-5 w-5 text-semantic-global-success-dark" />
          <span className="text-sm font-medium text-semantic-global-success-dark">
            Loading permitted by {permission.grantedBy}
          </span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 pb-32">
        {/* Inspection Tab */}
        {activeTab === "inspection" && (
          <InspectionCard
            inspections={inspections}
            onPass={(id) =>
              passMutation.mutate({
                voyageId: selectedVoyageId,
                railBookingId: id,
              })
            }
            onFail={(id, reason) =>
              failMutation.mutate({
                voyageId: selectedVoyageId,
                railBookingId: id,
                reason,
              })
            }
          />
        )}

        {/* Wagon Load Tab */}
        {activeTab === "wagon-load" && (
          <section className="mb-6">
            <h3 className="mb-3 text-lg font-bold text-semantic-global-text-default">
              Wagon Composition
            </h3>
            {wagons.length === 0 ? (
              <p className="py-8 text-center text-sm text-semantic-global-neutral-default">
                No wagons configured for this voyage
              </p>
            ) : (
              wagons.map((wagon) => (
                <WagonCard
                  key={wagon.wagonNumber}
                  wagon={wagon}
                  onUnload={(bookingId) =>
                    unloadMutation.mutate({
                      voyageId: selectedVoyageId,
                      wagonNumber: wagon.wagonNumber,
                      railBookingId: bookingId,
                    })
                  }
                />
              ))
            )}
          </section>
        )}

        {/* Pending Units Tab */}
        {activeTab === "pending" && (
          <section className="mb-6">
            <div className="mb-3 flex items-end justify-between">
              <h3 className="text-lg font-bold text-semantic-global-text-default">
                Pending Units
              </h3>
              <div className="flex gap-2">
                <span className="rounded bg-semantic-global-neutral-lightest px-2 py-0.5 text-[10px] text-semantic-global-text-light">
                  Main ({mainPending.length})
                </span>
                <span className="rounded bg-semantic-global-warning-lightest px-2 py-0.5 text-[10px] text-semantic-global-warning-dark">
                  Spare ({sparePending.length})
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {mainPending.map((booking) => (
                <PendingUnitCard
                  key={booking.railBookingId}
                  booking={booking}
                  list="Main"
                  onAssign={(bookingId) => {
                    const firstAvailableWagon = wagons[0];
                    if (firstAvailableWagon) {
                      loadMutation.mutate({
                        voyageId: selectedVoyageId,
                        wagonNumber: firstAvailableWagon.wagonNumber,
                        railBookingId: bookingId,
                      });
                    }
                  }}
                />
              ))}
              {sparePending.map((booking) => (
                <PendingUnitCard
                  key={booking.railBookingId}
                  booking={booking}
                  list="Spare"
                  onAssign={(bookingId) => {
                    const firstAvailableWagon = wagons[0];
                    if (firstAvailableWagon) {
                      loadMutation.mutate({
                        voyageId: selectedVoyageId,
                        wagonNumber: firstAvailableWagon.wagonNumber,
                        railBookingId: bookingId,
                      });
                    }
                  }}
                />
              ))}
              {mainPending.length === 0 && sparePending.length === 0 && (
                <p className="py-8 text-center text-sm text-semantic-global-neutral-default">
                  No units pending for loading
                </p>
              )}
            </div>
          </section>
        )}

        {/* Close Voyage */}
        <CloseVoyageButton
          onConfirm={() => closeMutation.mutate(selectedVoyageId)}
        />
      </main>
    </div>
  );
}
