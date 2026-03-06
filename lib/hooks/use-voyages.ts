// ============================================================
// TanStack Query hooks for Voyage Planning
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listRailVoyages,
  getRailVoyage,
  getCapacity,
  getMainList,
  getSpareList,
  addToMainList,
  addToSpareList,
  removeFromMainList,
  removeFromSpareList,
  promoteToMainList,
  demoteToSpareList,
  getWagonComposition,
  listSlotAgreements,
  type ListVoyagesParams,
} from "@/lib/api/voyages";

export const voyageKeys = {
  all: ["rail-voyages"] as const,
  list: (params?: ListVoyagesParams) =>
    ["rail-voyages", "list", params] as const,
  detail: (id: string) => ["rail-voyages", "detail", id] as const,
  capacity: (id: string) => ["rail-voyages", "capacity", id] as const,
  mainList: (id: string) => ["rail-voyages", "main-list", id] as const,
  spareList: (id: string) => ["rail-voyages", "spare-list", id] as const,
  wagonComp: (id: string) => ["rail-voyages", "wagon-comp", id] as const,
  slotAgreements: (params?: Record<string, string>) =>
    ["slot-agreements", params] as const,
};

export function useRailVoyages(params?: ListVoyagesParams) {
  return useQuery({
    queryKey: voyageKeys.list(params),
    queryFn: () => listRailVoyages(params),
  });
}

export function useRailVoyage(id: string) {
  return useQuery({
    queryKey: voyageKeys.detail(id),
    queryFn: () => getRailVoyage(id),
    enabled: !!id,
  });
}

export function useCapacity(voyageId: string) {
  return useQuery({
    queryKey: voyageKeys.capacity(voyageId),
    queryFn: () => getCapacity(voyageId),
    enabled: !!voyageId,
  });
}

export function useMainList(voyageId: string) {
  return useQuery({
    queryKey: voyageKeys.mainList(voyageId),
    queryFn: () => getMainList(voyageId),
    enabled: !!voyageId,
  });
}

export function useSpareList(voyageId: string) {
  return useQuery({
    queryKey: voyageKeys.spareList(voyageId),
    queryFn: () => getSpareList(voyageId),
    enabled: !!voyageId,
  });
}

export function useWagonComposition(voyageId: string) {
  return useQuery({
    queryKey: voyageKeys.wagonComp(voyageId),
    queryFn: () => getWagonComposition(voyageId),
    enabled: !!voyageId,
  });
}

export function useSlotAgreements(params?: Record<string, string>) {
  return useQuery({
    queryKey: voyageKeys.slotAgreements(params),
    queryFn: () => listSlotAgreements(params),
  });
}

export function useAddToMainList(voyageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (railBookingId: string) =>
      addToMainList(voyageId, railBookingId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: voyageKeys.mainList(voyageId) });
      void qc.invalidateQueries({ queryKey: voyageKeys.capacity(voyageId) });
    },
  });
}

export function useAddToSpareList(voyageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (railBookingId: string) =>
      addToSpareList(voyageId, railBookingId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: voyageKeys.spareList(voyageId) });
    },
  });
}

export function useRemoveFromMainList(voyageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => removeFromMainList(voyageId, bookingId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: voyageKeys.mainList(voyageId) });
      void qc.invalidateQueries({ queryKey: voyageKeys.capacity(voyageId) });
    },
  });
}

export function useRemoveFromSpareList(voyageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => removeFromSpareList(voyageId, bookingId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: voyageKeys.spareList(voyageId) });
    },
  });
}

export function usePromoteToMain(voyageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => promoteToMainList(voyageId, bookingId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: voyageKeys.mainList(voyageId) });
      void qc.invalidateQueries({ queryKey: voyageKeys.spareList(voyageId) });
      void qc.invalidateQueries({ queryKey: voyageKeys.capacity(voyageId) });
    },
  });
}

export function useDemoteToSpare(voyageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => demoteToSpareList(voyageId, bookingId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: voyageKeys.mainList(voyageId) });
      void qc.invalidateQueries({ queryKey: voyageKeys.spareList(voyageId) });
      void qc.invalidateQueries({ queryKey: voyageKeys.capacity(voyageId) });
    },
  });
}
