import { DialogContent, DialogDescription } from "../ui/dialog";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useSearch } from "@/hooks/use-search";
import { useEffect } from "react";
import SearchTabs from "./search-tabs";

export default function SearchDialog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [convId, setConvId] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const { performSearch, clearSearch } = useSearch();

  useEffect(() => {
    if (searchQuery) {
      if (activeTab === "messages" && convId) {
        performSearch(searchQuery, convId);
      } else if (activeTab !== "messages") {
        performSearch(searchQuery);
      }
    } else {
      clearSearch();
    }
  }, [searchQuery]);
  return (
    <DialogContent className="flex flex-col justify-between w-full max-w-2xl h-full max-h-5/7 overflow-y-auto">
      <DialogDescription />
      <div className="relative mt-4 mb-1 mx-2">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      <SearchTabs
        convId={convId}
        setConvId={setConvId}
        setActiveTab={setActiveTab}
      />
    </DialogContent>
  );
}