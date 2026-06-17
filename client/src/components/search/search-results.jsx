import Spinner from "@/components/app/spinner";
import NotFound from "@/components/app/not-found";
import SearchItemSkeleton from "@/components/search/search-item-skeleton";
import SearchItemUser from "@/components/search/search-item-user";
import SearchItemTask from "@/components/search/search-item-task";
import SearchItemMessage from "@/components/search/search-item-message";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/use-search";

export default function SearchResults() {
  const { type, query, results, loadingInitial, loadingMore, error, hasMore, searchMore } =
    useSearch();

  const data = results[type];

  if (loadingInitial) {
    return (
      <div className="flex flex-col py-2 overflow-y-hidden">
        {Array.from({ length: 8 }, (_, index) => (
          <SearchItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error.message}</div>;
  }

  if (!query || !type || !data) {
    return;
  }

  if (query && type && !data.length && !hasMore[type]) {
    return <NotFound message="No results found" description="Try searching for something else" />;
  }

  return (
    <div className="flex flex-col py-2 overflow-y-scroll">
      <ul>
        {data.map((item) => {
          if (type === "users") {
            return <SearchItemUser key={item.id} user={item} />;
          } else if (type === "tasks") {
            return <SearchItemTask key={item.id} task={item} />;
          } else if (type === "messages") {
            return <SearchItemMessage key={item.id} message={item} />;
          }
        })}
      </ul>

      {loadingMore && <Spinner />}

      {!loadingMore && hasMore[type] && (
        <Button
          variant="ghost"
          onClick={searchMore}
          className="mx-6 my-2 hover:bg-prussian-blue/5 cursor-pointer"
        >
          View more
        </Button>
      )}

      {!loadingMore && !hasMore[type] && (
        <div className="my-2 text-center text-sm text-muted-foreground">
          {`No more results (${data.length} rows)`}
        </div>
      )}
    </div>
  );
}
