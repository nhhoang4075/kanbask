import { SearchIcon } from "lucide-react";

import SearchOptions from "@/components/search/search-options";
import SearchResults from "@/components/search/search-results";
import { DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/custom-input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/use-search";
import { capitalCase } from "@/lib/utils";

export default function SearchDialog() {
  const { type, query, setQuery } = useSearch();

  return (
    <DialogContent
      onCloseAutoFocus={(e) => e.preventDefault()}
      className="flex flex-col gap-y-0 p-0 min-w-1/2 max-w-1/2 min-h-5/6 max-h-5/6 border-none bg-muted overflow-y-scroll"
    >
      <DialogDescription />
      <DialogHeader className="py-4 space-y-2 bg-ghost-white shadow-md">
        <div className="flex items-center mx-6 px-4 border-1 border-ring rounded-3xl">
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
          {type && (
            <Badge className="ml-2 rounded-sm h-6 bg-mustard text-prussian-blue">
              {capitalCase(type)}
            </Badge>
          )}
          <div className="flex-1">
            <Input
              type="text"
              placeholder={`Search ${type || "users, tasks, messages"}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <SearchOptions />
      </DialogHeader>
      <SearchResults />
    </DialogContent>
  );
}
