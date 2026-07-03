import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationItemSkeleton() {
  return (
    <div className="flex items-center gap-2 p-4">
      <Skeleton className="w-10 h-10 rounded-md" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="w-1/2 h-4 rounded-md" />
        <Skeleton className="w-5/6 h-4 rounded-md" />
      </div>
    </div>
  );
}
