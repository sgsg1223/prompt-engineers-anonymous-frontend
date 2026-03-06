import { Skeleton } from "@dfds-frontend/navigator-components";

export default function LoadingPlanLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-semantic-global-background-light-grey">
      {/* Header skeleton */}
      <div className="border-b border-semantic-global-border-light bg-semantic-global-background-white p-4">
        <Skeleton className="mx-auto mb-4 h-6 w-36" />
        <div className="flex gap-6">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="p-4">
        {/* Inspection skeleton */}
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-28 rounded" />
        </div>
        <div className="mb-6 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-semantic-global-border-lighter p-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          ))}
        </div>

        {/* Wagon cards skeleton */}
        <Skeleton className="mb-3 h-6 w-40" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="mb-4 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        ))}

        {/* Pending units skeleton */}
        <Skeleton className="mb-3 h-6 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-semantic-global-border-light bg-semantic-global-background-white p-4"
            >
              <Skeleton className="h-12 w-12 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
