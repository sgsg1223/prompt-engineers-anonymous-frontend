// ============================================================
// Booking Management API service
// Base: /bookings
// Falls back to mock data when backend is unavailable
// ============================================================

import { api } from "./client";
import type {
  RailBooking,
  FerryBooking,
  SpreadsheetUploadResult,
  BookingStatus,
  InspectionStatus,
} from "@/lib/domain/types";
import {
  MOCK_BOOKINGS,
  MOCK_FERRY_BOOKINGS,
} from "@/lib/mock/data";

const BOOKING_STATUS_BY_CODE: Record<number, BookingStatus> = {
  0: "Booked",
  1: "Planned",
  2: "Loaded",
  3: "Cancelled",
};

const INSPECTION_STATUS_BY_CODE: Record<number, InspectionStatus> = {
  0: "Not Inspected",
  1: "Inspection Passed",
  2: "Inspection Failed",
};

function normalizeBookingStatus(value: unknown): BookingStatus {
  if (typeof value === "number") {
    return BOOKING_STATUS_BY_CODE[value] ?? "Booked";
  }
  if (value === "Booked" || value === "Planned" || value === "Loaded" || value === "Cancelled") {
    return value;
  }
  return "Booked";
}

function normalizeInspectionStatus(value: unknown): InspectionStatus {
  if (typeof value === "number") {
    return INSPECTION_STATUS_BY_CODE[value] ?? "Not Inspected";
  }
  if (
    value === "Not Inspected" ||
    value === "Inspection Passed" ||
    value === "Inspection Failed"
  ) {
    return value;
  }
  return "Not Inspected";
}

function normalizeRailBooking(raw: unknown): RailBooking {
  const candidate = (raw ?? {}) as Partial<RailBooking> & {
    id?: string;
    bookingStatus?: unknown;
    inspectionStatus?: unknown;
  };

  return {
    railBookingId:
      candidate.railBookingId ??
      candidate.id ??
      candidate.unitNumber ??
      "unknown-booking",
    unitType: candidate.unitType ?? "",
    unitNumber: candidate.unitNumber ?? "",
    iluCode: candidate.iluCode ?? "",
    vehicleRegistrationNumber: candidate.vehicleRegistrationNumber ?? null,
    isCraneable: candidate.isCraneable ?? false,
    isWaste: candidate.isWaste ?? false,
    tareWeight: candidate.tareWeight ?? 0,
    grossWeight: candidate.grossWeight ?? 0,
    isCustomsCleared: candidate.isCustomsCleared ?? false,
    inspectionStatus: normalizeInspectionStatus(candidate.inspectionStatus),
    bookingStatus: normalizeBookingStatus(candidate.bookingStatus),
    cancellationReason: candidate.cancellationReason ?? null,
    internalRemarks: candidate.internalRemarks ?? null,
    sealNumber: candidate.sealNumber ?? null,
    externalReference1: candidate.externalReference1 ?? null,
    externalReference2: candidate.externalReference2 ?? null,
    requestedDepartureDateTime:
      candidate.requestedDepartureDateTime ?? new Date(0).toISOString(),
    customer: candidate.customer ?? { id: 0, name: "Unknown" },
    consignee: candidate.consignee ?? null,
    cargo: candidate.cargo ?? [],
    hazardous: candidate.hazardous ?? [],
  };
}

// ---- Rail Bookings ----

export interface ListBookingsParams {
  status?: string;
  customerId?: string;
  search?: string;
}

export async function listRailBookings(
  params?: ListBookingsParams,
): Promise<RailBooking[]> {
  try {
    const data = await api.get<unknown[]>(
      "/bookings",
      params as Record<string, string>,
    );
    return data.map(normalizeRailBooking);
  } catch {
    console.warn("Backend unavailable — falling back to mock bookings");
    return MOCK_BOOKINGS;
  }
}

export async function getRailBooking(id: string): Promise<RailBooking> {
  try {
    const data = await api.get<unknown>(`/bookings/${id}`);
    return normalizeRailBooking(data);
  } catch {
    console.warn(`Backend unavailable — falling back to mock for ${id}`);
    const found = MOCK_BOOKINGS.find((b) => b.railBookingId === id);
    if (found) return found;
    throw new Error(`Booking ${id} not found`);
  }
}

export function createRailBooking(
  data: Partial<RailBooking>,
): Promise<RailBooking> {
  return api.post<RailBooking>("/bookings", data);
}

export function updateRailBooking(
  id: string,
  data: {
    isCustomsCleared?: boolean;
    inspectionStatus?: string;
    internalRemarks?: string;
  },
): Promise<RailBooking> {
  return api.patch<RailBooking>(`/bookings/${id}`, data);
}

export function cancelRailBooking(
  id: string,
  reason: string,
): Promise<{ cancelled: boolean }> {
  return api.post<{ cancelled: boolean }>(
    `/bookings/${id}/cancel`,
    { cancellationReason: reason },
  );
}

// ---- Spreadsheet Upload ----

export function uploadBookingSpreadsheet(
  file: File,
): Promise<SpreadsheetUploadResult> {
  return api.upload<SpreadsheetUploadResult>(
    "/bookings/create-from-csv-utf8",
    file,
  );
}

// ---- Customs ----

export function updateCustomsStatus(
  id: string,
  isCustomsCleared: boolean,
): Promise<RailBooking> {
  return api.put<RailBooking>(`/bookings/${id}/customs`, {
    isCustomsCleared,
  });
}

// ---- Ferry Bookings (read model) ----

export interface ListFerryBookingsParams {
  search?: string;
  vessel?: string;
  pod?: string;
}

export async function listFerryBookings(
  params?: ListFerryBookingsParams,
): Promise<FerryBooking[]> {
  try {
    return await api.get<FerryBooking[]>(
      "/bookings/ferry-bookings",
      params as Record<string, string>,
    );
  } catch {
    return MOCK_FERRY_BOOKINGS;
  }
}

export function createRailBookingFromFerry(
  ferryBookingId: string,
  data: { requestedDepartureDateTime: string; prioritisation: string },
): Promise<RailBooking> {
  return api.post<RailBooking>(
    `/bookings/ferry-bookings/${ferryBookingId}/create-rail-booking`,
    data,
  );
}
