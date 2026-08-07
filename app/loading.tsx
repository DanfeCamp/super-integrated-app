import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level fallback. Mirrors the common page rhythm (breadcrumb → header →
 * card grid) so the swap to real content doesn't shift the layout.
 */
export default function Loading() {
  return (
    <div className="container-page flex flex-col gap-8 py-8 sm:py-10">
      <Skeleton className="h-4 w-48" />

      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-2/3 max-w-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-44 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
