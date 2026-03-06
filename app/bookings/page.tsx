"use client";

import { useState, useMemo } from "react";
import { Plus, Train, ArrowDownUp, Upload } from "lucide-react";
import StatsBar from "@/components/bookings/StatsBar";
import FilterBar from "@/components/bookings/FilterBar";
import type { BookingFilter } from "@/components/bookings/FilterBar";
import SearchBar from "@/components/bookings/SearchBar";
import BookingCard from "@/components/bookings/BookingCard";
import {
  useRailBookings,
  useUploadSpreadsheet,
} from "@/lib/hooks/use-bookings";

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookingFilter>("all");
  const [sortAsc, setSortAsc] = useState(false);

  const { data: bookings = [], isPending, isError, error } = useRailBookings();
  const uploadMutation = useUploadSpreadsheet();

  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Apply status filter
    if (
      activeFilter === "Booked" ||
      activeFilter === "Planned" ||
      activeFilter === "Loaded" ||
      activeFilter === "Cancelled"
    ) {
      result = result.filter((b) => b.bookingStatus === activeFilter);
    } else if (activeFilter === "hazardous") {
      result = result.filter((b) => b.hazardous.length > 0);
    } else if (activeFilter === "customs-pending") {
      result = result.filter((b) => !b.isCustomsCleared);
    }

    // Apply search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.railBookingId.toLowerCase().includes(query) ||
          b.unitNumber.toLowerCase().includes(query) ||
          b.iluCode.toLowerCase().includes(query) ||
          b.customer.name.toLowerCase().includes(query),
      );
    }

    // Apply sort by requested departure
    result = [...result].sort((a, b) => {
      const cmp =
        new Date(a.requestedDepartureDateTime).getTime() -
        new Date(b.requestedDepartureDateTime).getTime();
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [bookings, search, activeFilter, sortAsc]);

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadMutation.mutate(file);
      }
    };
    input.click();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-semantic-global-background-light-grey text-semantic-global-text-default">
      {/* Page Header */}
      <header className="sticky top-0 z-20 border-b border-semantic-global-border-light bg-semantic-global-background-light-grey/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Train className="h-6 w-6 text-semantic-global-primary-default" />
            <h1 className="text-xl font-bold leading-tight tracking-tight">
              Rail Bookings
            </h1>
          </div>
          <button
            onClick={handleFileUpload}
            disabled={uploadMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-semantic-global-primary-lightest px-3 py-2 text-sm font-medium text-semantic-global-primary-default hover:bg-semantic-global-primary-default hover:text-semantic-global-text-lightest disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploadMutation.isPending ? "Uploading…" : "Upload Spreadsheet"}
          </button>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </header>

      {/* Stats */}
      <StatsBar bookings={bookings} />

      {/* Filters */}
      <FilterBar active={activeFilter} onChange={setActiveFilter} />

      {/* Booking List */}
      <main className="flex-1 space-y-4 px-4 py-4 pb-32">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-semantic-global-text-light">
            {isPending ? "Loading…" : `${filteredBookings.length} Bookings`}
          </h2>
          <button
            onClick={() => setSortAsc((prev) => !prev)}
            className="flex items-center gap-1 text-sm font-medium text-semantic-global-primary-default"
          >
            <ArrowDownUp className="h-4 w-4" />
            Sort by Date
          </button>
        </div>

        {isError && (
          <div className="rounded-xl border border-semantic-global-danger-default bg-semantic-global-danger-lightest p-4 text-sm text-semantic-global-danger-dark">
            Failed to load bookings: {error?.message ?? "Unknown error"}
          </div>
        )}

        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-semantic-global-neutral-default">
            <Train className="h-12 w-12 animate-pulse" />
            <p className="text-sm font-medium">Loading bookings…</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-semantic-global-neutral-default">
            <Train className="h-12 w-12" />
            <p className="text-sm font-medium">No bookings found</p>
            <p className="text-xs">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard key={booking.railBookingId} booking={booking} />
          ))
        )}
      </main>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-semantic-global-primary-default text-semantic-global-text-lightest shadow-xl transition-all hover:scale-105 active:scale-90"
        aria-label="Create new booking"
      >
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
}
