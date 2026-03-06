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
} from "@/lib/domain/types";
import {
  MOCK_BOOKINGS,
  MOCK_FERRY_BOOKINGS,
} from "@/lib/mock/data";

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
    return await api.get<RailBooking[]>(
      "/bookings",
      params as Record<string, string>,
    );
  } catch {
    console.warn("Backend unavailable — falling back to mock bookings");
    return MOCK_BOOKINGS;
  }
}

export async function getRailBooking(id: string): Promise<RailBooking> {
  try {
    return await api.get<RailBooking>(`/bookings/${id}`);
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
