// ============================================================
// TanStack Query hooks for Booking Management
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listRailBookings,
  getRailBooking,
  cancelRailBooking,
  updateRailBooking,
  updateCustomsStatus,
  uploadBookingSpreadsheet,
  listFerryBookings,
  type ListBookingsParams,
  type ListFerryBookingsParams,
} from "@/lib/api/bookings";

export const bookingKeys = {
  all: ["rail-bookings"] as const,
  list: (params?: ListBookingsParams) =>
    ["rail-bookings", "list", params] as const,
  detail: (id: string) => ["rail-bookings", "detail", id] as const,
  ferryBookings: (params?: ListFerryBookingsParams) =>
    ["ferry-bookings", "list", params] as const,
};

export function useRailBookings(params?: ListBookingsParams) {
  return useQuery({
    queryKey: bookingKeys.list(params),
    queryFn: () => listRailBookings(params),
  });
}

export function useRailBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => getRailBooking(id),
    enabled: !!id,
  });
}

export function useFerryBookings(params?: ListFerryBookingsParams) {
  return useQuery({
    queryKey: bookingKeys.ferryBookings(params),
    queryFn: () => listFerryBookings(params),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelRailBooking(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateRailBooking>[1];
    }) => updateRailBooking(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}

export function useUpdateCustoms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      isCustomsCleared,
    }: {
      id: string;
      isCustomsCleared: boolean;
    }) => updateCustomsStatus(id, isCustomsCleared),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}

export function useUploadSpreadsheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadBookingSpreadsheet(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}
