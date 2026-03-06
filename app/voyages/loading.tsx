import { Skeleton } from "@dfds-frontend/navigator-components";

export default function VoyagesLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-semantic-global-background-light-grey">
      {/* Header skeleton */}
      <div className="border-b border-semantic-global-border-light bg-semantic-global-background-white p-4">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="flex gap-8">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      <div className="p-4">
        {/* Capacity cards skeleton */}
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-1.5 w-full rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Slot agreements skeleton */}
        <div className="mb-6 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4">
          <Skeleton className="mb-3 h-5 w-44" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        {/* Booking cards skeleton */}
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-l-4 border-semantic-global-border-light bg-semantic-global-background-white p-4"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-44" />
                </div>
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 border-t border-semantic-global-border-lighter pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
                <div />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
