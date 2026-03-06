// ============================================================
// Voyage Planning API service
// Base: /voyages
// Falls back to mock data when backend is unavailable
// ============================================================

import { api } from "./client";
import type {
  RailVoyage,
  RailSchedule,
  CapacitySummary,
  SlotAgreement,
  Wagon,
  PlannedBooking,
} from "@/lib/domain/types";
import {
  MOCK_VOYAGE,
  MOCK_CAPACITY,
  MOCK_MAIN_LIST,
  MOCK_SPARE_LIST,
  MOCK_SLOT_AGREEMENTS,
  MOCK_WAGONS,
} from "@/lib/mock/data";

// ---- Rail Schedules ----

export async function listSchedules(
  params?: Record<string, string>,
): Promise<RailSchedule[]> {
  try {
    return await api.get<RailSchedule[]>("/voyages/schedules", params);
  } catch {
    return [];
  }
}

export function createSchedule(
  data: Partial<RailSchedule>,
): Promise<RailSchedule> {
  return api.post<RailSchedule>("/voyages/schedules", data);
}

export function confirmSchedule(id: string): Promise<void> {
  return api.post<void>(`/voyages/schedules/${id}/confirm`);
}

// ---- Rail Voyages ----

export interface ListVoyagesParams {
  status?: string;
  routeId?: string;
  from?: string;
  to?: string;
}

export async function listRailVoyages(
  params?: ListVoyagesParams,
): Promise<RailVoyage[]> {
  try {
    return await api.get<RailVoyage[]>(
      "/voyages/rail-voyages",
      params as Record<string, string>,
    );
  } catch {
    return [MOCK_VOYAGE];
  }
}

export async function getRailVoyage(id: string): Promise<RailVoyage> {
  try {
    return await api.get<RailVoyage>(`/voyages/rail-voyages/${id}`);
  } catch {
    return MOCK_VOYAGE;
  }
}

export function updateRailVoyage(
  id: string,
  data: Partial<RailVoyage>,
): Promise<RailVoyage> {
  return api.patch<RailVoyage>(`/voyages/rail-voyages/${id}`, data);
}

export function cancelRailVoyage(id: string, reason: string): Promise<void> {
  return api.post<void>(`/voyages/rail-voyages/${id}/cancel`, {
    cancellationReason: reason,
  });
}

// ---- Main List / Spare List ----

export async function getMainList(voyageId: string): Promise<PlannedBooking[]> {
  try {
    return await api.get<PlannedBooking[]>(
      `/voyages/rail-voyages/${voyageId}/main-list`,
    );
  } catch {
    return MOCK_MAIN_LIST;
  }
}

export async function getSpareList(voyageId: string): Promise<PlannedBooking[]> {
  try {
    return await api.get<PlannedBooking[]>(
      `/voyages/rail-voyages/${voyageId}/spare-list`,
    );
  } catch {
    return MOCK_SPARE_LIST;
  }
}

export function addToMainList(
  voyageId: string,
  railBookingId: string,
): Promise<void> {
  return api.post<void>(`/voyages/rail-voyages/${voyageId}/main-list`, {
    railBookingId,
  });
}

export function addToSpareList(
  voyageId: string,
  railBookingId: string,
): Promise<void> {
  return api.post<void>(`/voyages/rail-voyages/${voyageId}/spare-list`, {
    railBookingId,
  });
}

export function removeFromMainList(
  voyageId: string,
  bookingId: string,
): Promise<void> {
  return api.delete<void>(
    `/voyages/rail-voyages/${voyageId}/main-list/${bookingId}`,
  );
}

export function removeFromSpareList(
  voyageId: string,
  bookingId: string,
): Promise<void> {
  return api.delete<void>(
    `/voyages/rail-voyages/${voyageId}/spare-list/${bookingId}`,
  );
}

export function promoteToMainList(
  voyageId: string,
  bookingId: string,
): Promise<void> {
  return api.post<void>(
    `/voyages/rail-voyages/${voyageId}/spare-list/${bookingId}/promote-to-main`,
  );
}

export function demoteToSpareList(
  voyageId: string,
  bookingId: string,
): Promise<void> {
  return api.post<void>(
    `/voyages/rail-voyages/${voyageId}/main-list/${bookingId}/demote-to-spare`,
  );
}

// ---- Capacity ----

export async function getCapacity(voyageId: string): Promise<CapacitySummary> {
  try {
    return await api.get<CapacitySummary>(`/voyages/rail-voyages/${voyageId}/capacity`);
  } catch {
    return MOCK_CAPACITY;
  }
}

// ---- Slot Agreements ----

export async function listSlotAgreements(
  params?: Record<string, string>,
): Promise<SlotAgreement[]> {
  try {
    return await api.get<SlotAgreement[]>("/voyages/slot-agreements", params);
  } catch {
    return MOCK_SLOT_AGREEMENTS;
  }
}

export function createSlotAgreement(
  data: Partial<SlotAgreement>,
): Promise<SlotAgreement> {
  return api.post<SlotAgreement>("/voyages/slot-agreements", data);
}

export function confirmSlotAgreement(id: string): Promise<void> {
  return api.post<void>(`/voyages/slot-agreements/${id}/confirm`);
}

export function surrenderSlots(
  id: string,
  slotsToSurrender: number,
): Promise<void> {
  return api.post<void>(`/voyages/slot-agreements/${id}/surrender`, {
    slotsToSurrender,
  });
}

// ---- Wagon Composition ----

export async function getWagonComposition(voyageId: string): Promise<Wagon[]> {
  try {
    return await api.get<Wagon[]>(
      `/voyages/rail-voyages/${voyageId}/wagon-composition`,
    );
  } catch {
    return MOCK_WAGONS;
  }
}

export function addWagons(
  voyageId: string,
  wagons: Partial<Wagon>[],
): Promise<void> {
  return api.post<void>(`/voyages/rail-voyages/${voyageId}/wagon-composition`, {
    wagons,
  });
}

export function removeWagon(
  voyageId: string,
  wagonNumber: number,
): Promise<void> {
  return api.delete<void>(
    `/voyages/rail-voyages/${voyageId}/wagon-composition/${wagonNumber}`,
  );
}

export function confirmPlannedComposition(voyageId: string): Promise<void> {
  return api.post<void>(
    `/voyages/rail-voyages/${voyageId}/wagon-composition/confirm-planned`,
  );
}
