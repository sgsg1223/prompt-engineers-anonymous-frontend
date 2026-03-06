"use client";

import { useState } from "react";
import { Train, Search, Bell, PlusCircle } from "lucide-react";
import CapacityMonitor from "@/components/voyages/CapacityMonitor";
import SlotAgreementsCard from "@/components/voyages/SlotAgreementsCard";
import RailBookingCard from "@/components/voyages/RailBookingCard";
import VoyageTabBar from "@/components/voyages/VoyageTabBar";
import {
  useRailVoyages,
  useRailVoyage,
  useCapacity,
  useMainList,
  useSpareList,
  useSlotAgreements,
} from "@/lib/hooks/use-voyages";
import { useRailBookings } from "@/lib/hooks/use-bookings";
import type { PlanningList, RailBooking } from "@/lib/domain/types";

export default function VoyagePlanningPage() {
  const [activeTab, setActiveTab] = useState<PlanningList>("Main");

  // Fetch list of voyages and pick the first for now
  const { data: voyages = [] } = useRailVoyages();
  const selectedVoyageId = voyages[0]?.railVoyageId;

  const { data: voyage } = useRailVoyage(selectedVoyageId ?? "");
  const { data: capacity, isPending: capacityLoading } = useCapacity(
    selectedVoyageId ?? "",
  );
  const { data: mainList = [] } = useMainList(selectedVoyageId ?? "");
  const { data: spareList = [] } = useSpareList(selectedVoyageId ?? "");
  const { data: slotAgreements = [], isPending: slotsLoading } =
    useSlotAgreements(
      voyage?.routeId ? { routeId: voyage.routeId } : undefined,
    );

  // Resolve bookings for the planned booking IDs
  const { data: allBookings = [] } = useRailBookings();

  const bookingMap = new Map<string, RailBooking>();
  for (const b of allBookings) {
    bookingMap.set(b.railBookingId, b);
  }

  const resolvedBookings = (activeTab === "Main" ? mainList : spareList)
    .map((pb) => bookingMap.get(pb.railBookingId))
    .filter((b): b is RailBooking => b !== undefined);

  const totalBookings = mainList.length + spareList.length;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-semantic-global-background-light-grey text-semantic-global-text-default">
      {/* Page Header */}
      <header className="sticky top-0 z-10 border-b border-semantic-global-border-light bg-semantic-global-background-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Train className="h-5 w-5 text-semantic-global-text-default" />
            <h1 className="text-lg font-bold leading-tight tracking-tight">
              Voyage Planning
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full p-2 hover:bg-semantic-global-neutral-lightest"
              aria-label="Search voyages"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              className="rounded-full p-2 hover:bg-semantic-global-neutral-lightest"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
        <VoyageTabBar active={activeTab} onChange={setActiveTab} />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Section: Capacity Monitoring */}
        <section className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Train Capacity Monitoring</h2>
            {voyage && (
              <span className="rounded-full bg-semantic-global-primary-lightest px-2 py-1 text-xs font-semibold uppercase text-semantic-global-primary-default">
                {voyage.railVoyageCode}
              </span>
            )}
          </div>
          <CapacityMonitor capacity={capacity} isLoading={capacityLoading} />
        </section>

        {/* Section: Slot Agreements */}
        <section className="mb-6">
          <SlotAgreementsCard
            agreements={
              capacity?.slotAgreements ??
              slotAgreements.map((sa) => ({
                slotAgreementId: sa.slotAgreementId,
                customerId: sa.customer.id,
                customerName: sa.customer.name,
                routeId: sa.routeId,
                reservedSlots: sa.numberOfAgreedUnits,
                usedSlots: sa.numberOfAgreedUnits - sa.surrenderedSlots,
                remainingSlots: sa.surrenderedSlots,
              }))
            }
            isLoading={slotsLoading}
          />
        </section>

        {/* Section: Active Rail Bookings */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold">
              {activeTab === "Main" ? "Main List" : "Spare List"} Bookings
            </h2>
            <span className="text-xs text-semantic-global-text-light">
              {totalBookings} total bookings
            </span>
          </div>
          <div className="space-y-3">
            {resolvedBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-semantic-global-border-light p-8 text-semantic-global-neutral-default">
                <Train className="h-8 w-8" />
                <p className="text-xs font-medium">
                  No bookings on {activeTab} List yet
                </p>
              </div>
            ) : (
              resolvedBookings.map((booking) => (
                <RailBookingCard
                  key={booking.railBookingId}
                  booking={booking}
                />
              ))
            )}

            {/* Drag-to-assign placeholder */}
            {activeTab === "Main" && resolvedBookings.length > 0 && (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-semantic-global-border-light p-4 text-semantic-global-neutral-default">
                <PlusCircle className="h-8 w-8" />
                <p className="text-xs font-medium">
                  Drag from Spare List to Assign
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
