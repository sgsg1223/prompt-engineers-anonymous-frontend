// ============================================================
// TanStack Query hooks for Wagon Loading
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLoadingPermission,
  grantLoadingPermission,
  listInspections,
  recordInspectionPassed,
  recordInspectionFailed,
  loadUnitToWagon,
  unloadUnitFromWagon,
  loadEquipmentToWagon,
  closeRailVoyage,
} from "@/lib/api/loading";
import { voyageKeys } from "./use-voyages";

export const loadingKeys = {
  permission: (voyageId: string) =>
    ["loading", "permission", voyageId] as const,
  inspections: (voyageId: string) =>
    ["loading", "inspections", voyageId] as const,
};

export function useLoadingPermission(voyageId: string) {
  return useQuery({
    queryKey: loadingKeys.permission(voyageId),
    queryFn: () => getLoadingPermission(voyageId),
    enabled: !!voyageId,
  });
}

export function useGrantPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (voyageId: string) =>
      grantLoadingPermission(voyageId, "current-user"),
    onSuccess: (_data, voyageId) =>
      qc.invalidateQueries({ queryKey: loadingKeys.permission(voyageId) }),
  });
}

export function useInspections(voyageId: string) {
  return useQuery({
    queryKey: loadingKeys.inspections(voyageId),
    queryFn: () => listInspections(voyageId),
    enabled: !!voyageId,
  });
}

export function useRecordInspectionPassed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      voyageId,
      railBookingId,
    }: {
      voyageId: string;
      railBookingId: string;
    }) => recordInspectionPassed(voyageId, railBookingId, "current-user"),
    onSuccess: (_data, { voyageId }) =>
      qc.invalidateQueries({ queryKey: loadingKeys.inspections(voyageId) }),
  });
}

export function useRecordInspectionFailed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      voyageId,
      railBookingId,
      reason,
    }: {
      voyageId: string;
      railBookingId: string;
      reason: string;
    }) =>
      recordInspectionFailed(voyageId, railBookingId, "current-user", reason),
    onSuccess: (_data, { voyageId }) =>
      qc.invalidateQueries({ queryKey: loadingKeys.inspections(voyageId) }),
  });
}

export function useLoadUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      voyageId,
      wagonNumber,
      railBookingId,
    }: {
      voyageId: string;
      wagonNumber: number;
      railBookingId: string;
    }) => loadUnitToWagon(voyageId, wagonNumber, railBookingId),
    onSuccess: (_data, { voyageId }) => {
      void qc.invalidateQueries({
        queryKey: voyageKeys.wagonComp(voyageId),
      });
      void qc.invalidateQueries({
        queryKey: voyageKeys.capacity(voyageId),
      });
    },
  });
}

export function useUnloadUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      voyageId,
      wagonNumber,
      railBookingId,
    }: {
      voyageId: string;
      wagonNumber: number;
      railBookingId: string;
    }) => unloadUnitFromWagon(voyageId, wagonNumber, railBookingId),
    onSuccess: (_data, { voyageId }) => {
      void qc.invalidateQueries({
        queryKey: voyageKeys.wagonComp(voyageId),
      });
      void qc.invalidateQueries({
        queryKey: voyageKeys.capacity(voyageId),
      });
    },
  });
}

export function useLoadEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      voyageId,
      wagonNumber,
      equipment,
    }: {
      voyageId: string;
      wagonNumber: number;
      equipment: { type: "ISU" | "R2L"; id: string };
    }) => loadEquipmentToWagon(voyageId, wagonNumber, equipment),
    onSuccess: (_data, { voyageId }) => {
      void qc.invalidateQueries({
        queryKey: voyageKeys.wagonComp(voyageId),
      });
      void qc.invalidateQueries({
        queryKey: voyageKeys.capacity(voyageId),
      });
    },
  });
}

export function useCloseVoyage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (voyageId: string) => closeRailVoyage(voyageId, "current-user"),
    onSuccess: (_data, voyageId) => {
      void qc.invalidateQueries({ queryKey: voyageKeys.detail(voyageId) });
    },
  });
}
