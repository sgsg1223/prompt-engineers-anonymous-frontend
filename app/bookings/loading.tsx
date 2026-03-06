import { Skeleton } from "@dfds-frontend/navigator-components";

export default function BookingsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-semantic-global-background-light-grey">
      {/* Header skeleton */}
      <div className="border-b border-semantic-global-border-light p-4">
        <Skeleton className="mb-4 h-7 w-40" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Stats skeleton */}
      <div className="flex gap-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4"
          >
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-2 px-4 py-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-56" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
