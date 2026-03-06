// ============================================================
// Wagon Loading API service
// Base: /loading
// ============================================================

import { api } from "./client";
import type {
  InspectionResult,
  LoadingPermission,
  Wagon,
} from "@/lib/domain/types";
import {
  MOCK_LOADING_PERMISSION,
  MOCK_INSPECTIONS,
} from "@/lib/mock/data";

// ---- Loading Permission ----

export async function getLoadingPermission(
  voyageId: string,
): Promise<LoadingPermission> {
  try {
    return await api.get<LoadingPermission>(
      `/loading/rail-voyages/${voyageId}/loading-permission`,
    );
  } catch {
    return MOCK_LOADING_PERMISSION;
  }
}

export function grantLoadingPermission(
  voyageId: string,
  grantedBy: string,
): Promise<void> {
  return api.post<void>(
    `/loading/rail-voyages/${voyageId}/loading-permission`,
    { grantedBy, grantedAt: new Date().toISOString() },
  );
}

// ---- Actual Wagon Composition ----

export function confirmActualComposition(
  voyageId: string,
  wagons: Partial<Wagon>[],
): Promise<void> {
  return api.post<void>(
    `/loading/rail-voyages/${voyageId}/actual-wagon-composition`,
    { wagons },
  );
}

export function removeActualWagon(
  voyageId: string,
  wagonNumber: number,
): Promise<void> {
  return api.delete<void>(
    `/loading/rail-voyages/${voyageId}/actual-wagon-composition/${wagonNumber}`,
  );
}

// ---- Inspection ----

export async function listInspections(voyageId: string): Promise<InspectionResult[]> {
  try {
    return await api.get<InspectionResult[]>(
      `/loading/rail-voyages/${voyageId}/inspections`,
    );
  } catch {
    return MOCK_INSPECTIONS;
  }
}

export function recordInspectionPassed(
  voyageId: string,
  bookingId: string,
  inspectedBy: string,
): Promise<void> {
  return api.post<void>(
    `/loading/rail-voyages/${voyageId}/inspections/${bookingId}/pass`,
    { inspectedBy },
  );
}

export function recordInspectionFailed(
  voyageId: string,
  bookingId: string,
  inspectedBy: string,
  failureReason: string,
): Promise<void> {
  return api.post<void>(
    `/loading/rail-voyages/${voyageId}/inspections/${bookingId}/fail`,
    { inspectedBy, failureReason },
  );
}

// ---- Wagon Assignment ----

export function loadUnitToWagon(
  voyageId: string,
  wagonNumber: number,
  railBookingId: string,
): Promise<void> {
  return api.post<void>(
    `/loading/rail-voyages/${voyageId}/wagons/${wagonNumber}/load-unit`,
    { railBookingId },
  );
}

export function unloadUnitFromWagon(
  voyageId: string,
  wagonNumber: number,
  bookingId: string,
): Promise<void> {
  return api.delete<void>(
    `/loading/rail-voyages/${voyageId}/wagons/${wagonNumber}/units/${bookingId}`,
  );
}

export function loadEquipmentToWagon(
  voyageId: string,
  wagonNumber: number,
  equipment: { type: "ISU" | "R2L"; id: string },
): Promise<void> {
  return api.post<void>(
    `/loading/rail-voyages/${voyageId}/wagons/${wagonNumber}/load-equipment`,
    equipment,
  );
}

export function removeEquipmentFromWagon(
  voyageId: string,
  wagonNumber: number,
  equipmentId: string,
): Promise<void> {
  return api.delete<void>(
    `/loading/rail-voyages/${voyageId}/wagons/${wagonNumber}/equipment/${equipmentId}`,
  );
}

// ---- Close & Depart ----

export interface CloseVoyageResponse {
  voyageId: string;
  voyageStatus: "Closed";
  closedAt: string;
  ferryBookingsCreated: number;
  spareListBookingsRolledOver: number;
}

export function closeRailVoyage(
  voyageId: string,
  closedBy: string,
): Promise<CloseVoyageResponse> {
  return api.post<CloseVoyageResponse>(
    `/loading/rail-voyages/${voyageId}/close`,
    { closedBy },
  );
}

export function recordDeparture(
  voyageId: string,
  actualDepartureDateTime: string,
): Promise<void> {
  return api.post<void>(`/loading/rail-voyages/${voyageId}/depart`, {
    actualDepartureDateTime,
  });
}
