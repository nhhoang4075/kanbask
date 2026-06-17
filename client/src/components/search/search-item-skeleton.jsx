import { Skeleton } from "@/components/ui/skeleton";

export default function SearchItemSkeleton() {
  return (
    <div className="flex items-center gap-2 mx-6 my-2 py-2 px-4 rounded-md bg-white">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
      </div>
    </div>
  );
}
