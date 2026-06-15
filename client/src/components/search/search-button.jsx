import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import { Dialog, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchDialog from "./search-dialog";

export default function SearchButton({ className, ...props }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <SidebarMenuItem>
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogTitle />
        <DialogTrigger asChild>
          <SidebarMenuButton
            tooltip="Search"
            {...props}
            isActive={isSearchOpen}
            onClick={toggleSearch}
          >
            <SearchIcon className={cn("h-5 w-5", isSearchOpen && "text-blue-green")} />
            <span>Search</span>
          </SidebarMenuButton>
        </DialogTrigger>
        <SearchDialog />
      </Dialog>
    </SidebarMenuItem>
  );
}